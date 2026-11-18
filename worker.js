// Cloudflare Worker — BGMI Lua License API + Admin Panel
// Required KV binding variable: ZAK_LICENSES
// Required Worker secret: ADMIN_SECRET
//
// Lua compatibility:
// URL: /connect
// POST form fields: game, user_key, serial
// Response: { status: true, data: { token: <MD5>, rng: <unix seconds> } }

const GAME_NAME = "BGMI";
const LUA_SECRET = "ZAKPUBGSKIN";
const KV_PREFIX = "key:";

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

// MD5 implementation using little-endian 512-bit blocks.
// Lua's input is ASCII in this protocol (game/key/serial/secret).
function md5(input) {
  const text = String(input);
  const bytes = [];
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code > 0x7f) throw new Error("MD5 input must be ASCII");
    bytes.push(code);
  }

  const bitLength = bytes.length * 8;
  bytes.push(0x80);
  while ((bytes.length % 64) !== 56) bytes.push(0);
  const low = bitLength >>> 0;
  const high = Math.floor(bitLength / 0x100000000) >>> 0;
  for (let i = 0; i < 4; i++) bytes.push((low >>> (8 * i)) & 0xff);
  for (let i = 0; i < 4; i++) bytes.push((high >>> (8 * i)) & 0xff);

  const shifts = [
    7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,
    5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,
    4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,
    6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21
  ];
  const K = [];
  for (let i = 0; i < 64; i++) {
    K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000) >>> 0;
  }

  let a0 = 0x67452301, b0 = 0xefcdab89;
  let c0 = 0x98badcfe, d0 = 0x10325476;

  function add32(x, y) { return (x + y) >>> 0; }
  function rotl(x, n) { return ((x << n) | (x >>> (32 - n))) >>> 0; }

  for (let offset = 0; offset < bytes.length; offset += 64) {
    const M = new Array(16);
    for (let j = 0; j < 16; j++) {
      const p = offset + j * 4;
      M[j] = (bytes[p] | (bytes[p + 1] << 8) |
             (bytes[p + 2] << 16) | (bytes[p + 3] << 24)) >>> 0;
    }

    let A = a0, B = b0, C = c0, D = d0;
    for (let i = 0; i < 64; i++) {
      let F, g;
      if (i < 16) {
        F = (B & C) | (~B & D); g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C); g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D; g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D); g = (7 * i) % 16;
      }
      const nextD = D;
      D = C;
      C = B;
      const sum = add32(add32(add32(A, F >>> 0), K[i]), M[g]);
      B = add32(B, rotl(sum, shifts[i]));
      A = nextD;
    }

    a0 = add32(a0, A);
    b0 = add32(b0, B);
    c0 = add32(c0, C);
    d0 = add32(d0, D);
  }

  function hexLE(n) {
    return [0, 8, 16, 24].map(s => ((n >>> s) & 255).toString(16).padStart(2, "0")).join("");
  }
  return hexLE(a0) + hexLE(b0) + hexLE(c0) + hexLE(d0);
}

function randomKeyPart(length = 6) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => alphabet[b % alphabet.length]).join("");
}

function validKeyData(data) {
  return data && typeof data === "object" &&
    typeof data.key === "string" &&
    Number.isFinite(data.expires_at) &&
    Number.isInteger(data.max_devices) &&
    Array.isArray(data.devices);
}

async function readKey(env, key) {
  const raw = await env.ZAK_LICENSES.get(KV_PREFIX + key);
  if (!raw) return null;
  let data;
  try { data = JSON.parse(raw); } catch { return null; }
  return validKeyData(data) ? data : null;
}

function adminAuth(url, env) {
  const expected = env.ADMIN_SECRET;
  const supplied = url.searchParams.get("secret") || "";
  return typeof expected === "string" && expected.length > 0 && supplied === expected;
}

const ADMIN_HTML = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>BGMI License Admin</title>
<style>
*{box-sizing:border-box}body{margin:0;padding:22px;background:#090b10;color:#edf0f6;font:15px system-ui,Segoe UI,sans-serif}
.wrap{max-width:900px;margin:auto}h1{text-align:center;color:#e8bd55;letter-spacing:1px}
.card{background:#141821;border:1px solid #2b3240;border-radius:14px;padding:20px;margin:18px 0}
input,button{width:100%;padding:12px;border-radius:9px;border:1px solid #394252;background:#0e121a;color:#fff;font-size:15px;margin:6px 0}
button{background:#e8bd55;color:#111;border:0;font-weight:750;cursor:pointer}
button:disabled{opacity:.5;cursor:wait}.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.item{border:1px solid #343c4b;background:#10151e;padding:14px;border-radius:10px;margin:12px 0}
.item.revoked{border-left:4px solid #e34d59}.item.active{border-left:4px solid #3abf85}
.key{font-weight:800;color:#e8bd55;overflow-wrap:anywhere}.muted{color:#aab3c2;font-size:13px}
.actions{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.actions button{font-size:13px;padding:9px}
.danger{background:#d94c58;color:white}.warn{background:#d98a37;color:#111}
#message{white-space:pre-wrap;color:#9fe0bd;margin-top:10px}
@media(max-width:560px){body{padding:12px}.grid{grid-template-columns:1fr}.actions{grid-template-columns:1fr 1fr}}
</style></head><body><main class="wrap">
<h1>♛ BGMI LICENSE ADMIN ♛</h1>
<section class="card" id="login">
<h2>Admin Login</h2>
<input id="secret" type="password" placeholder="Admin secret">
<button id="loginBtn">Unlock panel</button>
</section>
<div id="panel" hidden>
<section class="card">
<h2>Generate license</h2>
<div class="grid">
<input id="days" type="number" min="1" max="3650" value="30" placeholder="Validity in days">
<input id="max" type="number" min="1" max="20" value="1" placeholder="Maximum devices">
</div>
<button id="generateBtn">Generate key</button><div id="message"></div>
</section>
<section class="card"><h2>Manage licenses</h2>
<button id="refreshBtn">Refresh list</button><div id="keys"></div>
</section></div></main>
<script>
let adminSecret="";
const $=id=>document.getElementById(id);
async function api(action,params={}){
 const u=new URL(location.href);u.search="";u.searchParams.set("action",action);u.searchParams.set("secret",adminSecret);
 for(const [k,v] of Object.entries(params))u.searchParams.set(k,String(v));
 const r=await fetch(u.toString(),{cache:"no-store"});
 let d;try{d=await r.json()}catch{throw Error("Invalid server response")}
 if(!r.ok||!d.success)throw Error(d.error||("HTTP "+r.status));return d;
}
function showError(e){$("message").textContent="Error: "+e.message}
async function loadKeys(){
 const box=$("keys");box.textContent="Loading...";
 try{
  const d=await api("list");box.textContent="";
  if(!d.keys.length){box.textContent="No keys found.";return}
  for(const k of d.keys){
   const item=document.createElement("div");item.className="item "+(k.revoked?"revoked":"active");
   const title=document.createElement("div");title.className="key";title.textContent=k.key;
   const info=document.createElement("div");info.className="muted";
   info.textContent=(k.revoked?"REVOKED":"ACTIVE")+" · Expires: "+new Date(k.expires_at*1000).toLocaleString()+" · Devices: "+k.devices.length+"/"+k.max_devices;
   const actions=document.createElement("div");actions.className="actions";
   const add=(label,act,cls)=>{const b=document.createElement("button");b.textContent=label;b.className=cls||"";b.onclick=()=>runAction(act,k.key);actions.appendChild(b)};
   if(!k.revoked)add("Revoke","revoke","danger");
   add("Reset devices","reset","warn");add("Delete","delete","danger");
   item.append(title,info,actions);box.appendChild(item);
  }
 }catch(e){box.textContent="Could not load keys: "+e.message}
}
async function runAction(action,key){
 if(!confirm("Are you sure you want to "+action+" this key?"))return;
 try{await api(action,{key});await loadKeys()}catch(e){alert(e.message)}
}
$("loginBtn").onclick=async()=>{
 adminSecret=$("secret").value.trim();if(!adminSecret)return alert("Enter admin secret");
 try{await api("list");$("login").hidden=true;$("panel").hidden=false;sessionStorage.setItem("bgmi_admin_secret",adminSecret);await loadKeys()}
 catch(e){alert("Login failed: "+e.message)}
};
$("generateBtn").onclick=async()=>{
 const days=Number($("days").value),max=Number($("max").value);
 if(!Number.isInteger(days)||days<1||days>3650)return alert("Days must be 1–3650");
 if(!Number.isInteger(max)||max<1||max>20)return alert("Devices must be 1–20");
 try{const d=await api("create",{days,max});$("message").textContent="Generated: "+d.key;await loadKeys()}
 catch(e){showError(e)}
};
$("refreshBtn").onclick=loadKeys;
const saved=sessionStorage.getItem("bgmi_admin_secret");if(saved){$("secret").value=saved;$("loginBtn").click()}
</script></body></html>`;

async function handleAdmin(request, env, url) {
  const action = url.searchParams.get("action");

  if (request.method === "GET" && !action) {
    return new Response(ADMIN_HTML, {
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" }
    });
  }

  if (!adminAuth(url, env)) return json({ success: false, error: "Unauthorized" }, 401);

  if (request.method !== "GET") return json({ success: false, error: "Method not allowed" }, 405);

  if (action === "create") {
    const days = Number.parseInt(url.searchParams.get("days") || "30", 10);
    const maxDevices = Number.parseInt(url.searchParams.get("max") || "1", 10);
    if (!Number.isInteger(days) || days < 1 || days > 3650 ||
        !Number.isInteger(maxDevices) || maxDevices < 1 || maxDevices > 20) {
      return json({ success: false, error: "Invalid days or max devices" }, 400);
    }

    let key;
    for (let attempt = 0; attempt < 5; attempt++) {
      key = "ZAK-" + randomKeyPart(6) + "-" + randomKeyPart(6);
      if (!(await env.ZAK_LICENSES.get(KV_PREFIX + key))) break;
      key = null;
    }
    if (!key) return json({ success: false, error: "Could not generate a unique key" }, 500);

    const data = {
      key,
      expires_at: Math.floor(Date.now() / 1000) + days * 86400,
      max_devices: maxDevices,
      devices: [],
      revoked: false
    };
    await env.ZAK_LICENSES.put(KV_PREFIX + key, JSON.stringify(data));
    return json({ success: true, key, expires_at: data.expires_at });
  }

  if (action === "list") {
    const keys = [];
    let cursor;
    do {
      const page = await env.ZAK_LICENSES.list({ prefix: KV_PREFIX, cursor, limit: 1000 });
      for (const entry of page.keys) {
        const raw = await env.ZAK_LICENSES.get(entry.name);
        if (!raw) continue;
        try {
          const data = JSON.parse(raw);
          if (validKeyData(data)) keys.push(data);
        } catch {}
      }
      cursor = page.list_complete ? undefined : page.cursor;
    } while (cursor);
    keys.sort((a, b) => b.expires_at - a.expires_at);
    return json({ success: true, keys });
  }

  if (["revoke", "reset", "delete"].includes(action)) {
    const key = (url.searchParams.get("key") || "").trim();
    if (!key || key.length > 100) return json({ success: false, error: "Invalid key" }, 400);
    const storageKey = KV_PREFIX + key;

    if (action === "delete") {
      const existing = await env.ZAK_LICENSES.get(storageKey);
      if (!existing) return json({ success: false, error: "Key not found" }, 404);
      await env.ZAK_LICENSES.delete(storageKey);
      return json({ success: true });
    }

    const data = await readKey(env, key);
    if (!data) return json({ success: false, error: "Key not found or damaged" }, 404);
    if (action === "revoke") data.revoked = true;
    if (action === "reset") data.devices = [];
    await env.ZAK_LICENSES.put(storageKey, JSON.stringify(data));
    return json({ success: true });
  }

  return json({ success: false, error: "Unknown action" }, 400);
}

async function handleLua(request, env) {
  if (request.method !== "POST") return json({ status: false, reason: "Method not allowed" }, 405);

  try {
    const contentType = request.headers.get("content-type") || "";
    let body = {};

    if (contentType.includes("application/x-www-form-urlencoded") ||
        contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      for (const [key, value] of form.entries()) body[key] = String(value);
    } else if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      const raw = await request.text();
      const form = new URLSearchParams(raw);
      for (const [key, value] of form.entries()) body[key] = value;
    }

    const game = String(body.game || "");
    const userKey = String(body.user_key || "").trim();
    const serial = String(body.serial || "");

    if (game !== GAME_NAME || !userKey || !serial || serial.length > 512) {
      return json({ status: false, reason: "Missing or invalid fields" }, 400);
    }

    const keyData = await readKey(env, userKey);
    if (!keyData) return json({ status: false, reason: "Invalid Key" }, 200);

    const now = Math.floor(Date.now() / 1000);
    if (keyData.revoked === true) return json({ status: false, reason: "Key Revoked" });
    if (now >= keyData.expires_at) return json({ status: false, reason: "Key Expired" });

    if (!keyData.devices.includes(serial)) {
      if (keyData.devices.length >= keyData.max_devices) {
        return json({ status: false, reason: "Max Devices Reached" });
      }
      keyData.devices.push(serial);
      await env.ZAK_LICENSES.put(KV_PREFIX + userKey, JSON.stringify(keyData));
    }

    // Must match Lua exactly:
    // md5(cfg.game .. '-' .. key .. '-' .. serial .. '-' .. cfg.secret)
    const token = md5(game + "-" + userKey + "-" + serial + "-" + LUA_SECRET);

    return json({
      status: true,
      data: {
        token,
        rng: now
      }
    });
  } catch (error) {
    return json({ status: false, reason: "Server error: " + String(error?.message || error) }, 500);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (!env.ZAK_LICENSES) {
      return json({ success: false, error: "KV binding ZAK_LICENSES is missing" }, 500);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    if (path === "/connect") return handleLua(request, env);

    if (path === "/") return handleAdmin(request, env, url);

    return json({ success: false, error: "Not found" }, 404);
  }
};

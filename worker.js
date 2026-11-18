// language: JavaScript, file: worker.js

const SECRET_KEY = "ZAKPUBGSKIN"; // Lua config wala secret
const GAME_NAME = "BGMI";         // Lua config wala game
const ADMIN_SECRET = "ZAKADMIN2026"; // Admin panel ka password

// ==========================================
// PURE JAVASCRIPT MD5 (Cloudflare me error na aye)
// ==========================================
function md5(str) {
  var k = [], i = 0, j = 0, l = 0, s = [], r = [], a, b, c, d, S = [], K = [], n = 0, x = [], y = 0, z = 0, A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0;
  var utf8 = unescape(encodeURIComponent(str));
  for (i = 0; i < 64; i++) {
    if (i < 16) K[i] = 0xd76aa478 ^ (i * 0x1234567);
    else if (i < 32) K[i] = 0xe8c7b756 ^ (i * 0x1234567);
    else if (i < 48) K[i] = 0x242070db ^ (i * 0x1234567);
    else K[i] = 0xc1bdceee ^ (i * 0x1234567);
  }
  // Standard MD5 array
  var T = [ -680876936, -389564586, 606105819, -1044525330, -176418897, 1200080426, -1473231341, -45705983, 1770035416, -1958414417, -42063, -1990404162, 1804603682, -40341101, -1502002290, 1236535329, -165796510, -1069501632, 643717713, -373897302, -701558691, 38016083, -660478335, -405537848, 568446438, -1019803690, -187363961, 1163531501, -1444681467, -51403784, 1735328473, -1926607734, -378558, -2022574463, 1839030562, -35309556, -1530992060, 1272893353, -155497632, -1094730640, 681279174, -358537222, -722521979, 76029189, -640364487, -421815835, 530742520, -995338651, -198630844, 1126891415, -1416354905, -57434055, 1700485571, -1894986606, -1051523, -2054922799, 1873313359, -30611744, -1560198380, 1309151649, -145523070, -1120210379, 718787259, -343485551 ];
  for (i = 0; i < utf8.length; i++) { x[i >> 2] |= utf8.charCodeAt(i) << (i % 4) * 8; }
  x[utf8.length >> 2] |= 0x80 << (utf8.length % 4) * 8;
  x[(((utf8.length + 8) >> 6) << 4) + 14] = utf8.length * 8;
  var h = [ 1732584193, -271733879, -1732584194, 271733878 ];
  for (i = 0; i < x.length; i += 16) {
    var olda = h[0], oldb = h[1], oldc = h[2], oldd = h[3];
    for (j = 0; j < 64; j++) {
      if (j < 16) { F = (h[1] & h[2]) | (~h[1] & h[3]); G = j; }
      else if (j < 32) { F = (h[3] & h[1]) | (~h[3] & h[2]); G = (5 * j + 1) % 16; }
      else if (j < 48) { F = h[1] ^ h[2] ^ h[3]; G = (3 * j + 5) % 16; }
      else { F = h[2] ^ (h[1] | ~h[3]); G = (7 * j) % 16; }
      var tmp = h[3]; h[3] = h[2]; h[2] = h[1];
      h[1] = h[1] + (((h[0] + F + T[j] + (x[i + G] | 0)) << (j % 32)) | ((h[0] + F + T[j] + (x[i + G] | 0)) >>> (32 - (j % 32))));
      h[0] = tmp;
    }
    h[0] = (h[0] + olda) | 0; h[1] = (h[1] + oldb) | 0; h[2] = (h[2] + oldc) | 0; h[3] = (h[3] + oldd) | 0;
  }
  var hex = "";
  for (i = 0; i < 4; i++) for (j = 0; j < 4; j++) hex += ((h[i] >> (j * 8 + 4)) & 0x0F).toString(16) + ((h[i] >> (j * 8)) & 0x0F).toString(16);
  return hex;
}

// ==========================================
// PREMIUM ADMIN PANEL HTML
// ==========================================
const ADMIN_HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ZAK License VIP</title>
<style>
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0a0a0a; color: #eee; margin: 0; padding: 20px; }
  .container { max-width: 900px; margin: auto; }
  h1 { color: #f5c518; text-align: center; text-shadow: 0 0 10px rgba(245,197,24,0.5); }
  .card { background: #151515; border: 1px solid #333; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
  input, button, select { font-size: 16px; padding: 12px; border-radius: 8px; border: 1px solid #444; background: #222; color: #fff; width: 100%; box-sizing: border-box; margin-bottom: 10px; outline: none; transition: 0.3s; }
  input:focus { border-color: #f5c518; }
  button { background: #f5c518; color: #000; font-weight: bold; border: 0; cursor: pointer; margin-top: 10px; }
  button:hover { background: #e0b000; transform: scale(1.02); }
  .row { display: flex; gap: 10px; }
  .row > * { flex: 1; }
  .key-list { margin-top: 20px; }
  .key-item { background: #1a1a1a; border-left: 4px solid #f5c518; padding: 15px; border-radius: 8px; margin-bottom: 10px; display: flex; flex-direction: column; gap: 10px; }
  .key-item.revoked { border-left-color: #ff3333; opacity: 0.7; }
  .key-header { display: flex; justify-content: space-between; align-items: center; font-size: 18px; font-weight: bold; color: #f5c518; }
  .key-details { font-size: 14px; color: #aaa; }
  .actions { display: flex; gap: 8px; margin-top: 10px; }
  .actions button { padding: 8px; font-size: 13px; margin: 0; }
  .btn-danger { background: #ff3333; color: white; }
  .btn-danger:hover { background: #cc0000; }
  .btn-warning { background: #ff9900; color: white; }
  .btn-warning:hover { background: #cc7a00; }
  .hidden { display: none; }
</style></head><body>
<div class="container">
  <h1>♛ ZAK LICENSE VIP ♛</h1>
  
  <div id="loginBox" class="card">
    <h2>Admin Login</h2>
    <input type="password" id="secret" placeholder="Enter Admin Secret">
    <button onclick="login()">Unlock Panel</button>
  </div>

  <div id="panelBox" class="hidden">
    <div class="card">
      <h2>Generate New Key</h2>
      <div class="row">
        <input type="number" id="days" value="30" placeholder="Days">
        <input type="number" id="maxDev" value="1" placeholder="Max Devices">
      </div>
      <button onclick="generate()">Generate Key</button>
      <div id="genResult" style="color:#00ff00; margin-top:10px; font-weight:bold;"></div>
    </div>

    <div class="card">
      <h2>Manage Keys</h2>
      <button onclick="loadKeys()">Refresh List</button>
      <div id="keyList" class="key-list"></div>
    </div>
  </div>
</div>

<script>
let adminSecret = "";

function login() {
  adminSecret = document.getElementById("secret").value;
  if (!adminSecret) return alert("Enter secret");
  localStorage.setItem("zak_admin", adminSecret);
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("panelBox").classList.remove("hidden");
  loadKeys();
}

async function api(action, params = "") {
  const res = await fetch(\`?action=\${action}&secret=\${adminSecret}\${params}\`);
  return await res.json();
}

async function generate() {
  const days = document.getElementById("days").value;
  const maxDev = document.getElementById("maxDev").value;
  const res = await api("create", \`&days=\${days}&max=\${maxDev}\`);
  if (res.success) {
    document.getElementById("genResult").innerText = "✅ Key: " + res.key;
    loadKeys();
  } else {
    document.getElementById("genResult").innerText = "❌ Error: " + res.error;
  }
}

async function loadKeys() {
  const res = await api("list");
  const box = document.getElementById("keyList");
  box.innerHTML = "";
  if (!res.success || !res.keys.length) {
    box.innerHTML = "<p style='color:#aaa'>No keys found.</p>";
    return;
  }

  res.keys.forEach(k => {
    const isRevoked = k.revoked;
    const expDate = new Date(k.expires_at * 1000).toLocaleString();
    box.innerHTML += \`
      <div class="key-item \${isRevoked ? 'revoked' : ''}">
        <div class="key-header">
          <span>\${k.key}</span>
          <span style="color:\${isRevoked ? '#ff3333' : '#00ff00'}">\${isRevoked ? 'REVOKED' : 'ACTIVE'}</span>
        </div>
        <div class="key-details">
          Expires: \${expDate}<br>
          Devices: \${k.devices.length} / \${k.max_devices}
        </div>
        <div class="actions">
          \${!isRevoked ? \`<button class="btn-danger" onclick="actionKey('revoke', '\${k.key}')">Revoke</button>\` : ''}
          <button class="btn-warning" onclick="actionKey('reset', '\${k.key}')">Reset Devices</button>
          <button class="btn-danger" onclick="actionKey('delete', '\${k.key}')">Delete</button>
        </div>
      </div>
    \`;
  });
}

async function actionKey(action, key) {
  if (!confirm(\`Are you sure you want to \${action} this key?\`)) return;
  const res = await api(action, \`&key=\${key}\`);
  if (res.success) {
    loadKeys();
  } else {
    alert(res.error);
  }
}

const saved = localStorage.getItem("zak_admin");
if (saved) {
  document.getElementById("secret").value = saved;
  login();
}
</script></body></html>`;

// ==========================================
// WORKER ROUTER (Lua + Admin)
// ==========================================
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const action = url.searchParams.get("action");
    const secret = url.searchParams.get("secret");

    // --- 1. ADMIN PANEL ROUTES ---
    if (request.method === "GET") {
      if (!action) {
        return new Response(ADMIN_HTML, { headers: { "Content-Type": "text/html" } });
      }

      if (secret !== ADMIN_SECRET) {
        return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401 });
      }

      // Create Key
      if (action === "create") {
        const days = parseInt(url.searchParams.get("days")) || 30;
        const maxDev = parseInt(url.searchParams.get("max")) || 1;
        const newKey = "ZAK-" + Math.random().toString(36).substring(2, 8).toUpperCase() + "-" + Math.random().toString(36).substring(2, 8).toUpperCase();
        
        const data = {
          key: newKey,
          expires_at: Math.floor(Date.now() / 1000) + (days * 86400),
          max_devices: maxDev,
          devices: [],
          revoked: false
        };
        await env.ZAK_LICENSES.put(`key:${newKey}`, JSON.stringify(data));
        return new Response(JSON.stringify({ success: true, key: newKey }), { headers: { "Content-Type": "application/json" } });
      }

      // List Keys
      if (action === "list") {
        const list = await env.ZAK_LICENSES.list({ prefix: "key:" });
        let keys = [];
        for (const k of list.keys) {
          const raw = await env.ZAK_LICENSES.get(k.name);
          if (raw) keys.push(JSON.parse(raw));
        }
        return new Response(JSON.stringify({ success: true, keys }), { headers: { "Content-Type": "application/json" } });
      }

      // Revoke / Reset / Delete
      if (action === "revoke" || action === "reset" || action === "delete") {
        const key = url.searchParams.get("key");
        if (!key) return new Response(JSON.stringify({ success: false, error: "No key provided" }));
        
        if (action === "delete") {
          await env.ZAK_LICENSES.delete(`key:${key}`);
        } else {
          const raw = await env.ZAK_LICENSES.get(`key:${key}`);
          if (!raw) return new Response(JSON.stringify({ success: false, error: "Key not found" }));
          const data = JSON.parse(raw);
          
          if (action === "revoke") data.revoked = true;
          if (action === "reset") data.devices = [];
          
          await env.ZAK_LICENSES.put(`key:${key}`, JSON.stringify(data));
        }
        return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
      }
    }

    // --- 2. LUA MOD VERIFICATION ROUTE ---
    if (request.method === "POST") {
      try {
        const contentType = request.headers.get("content-type") || "";
        let body = {};
        
        if (contentType.includes("form")) {
          const form = await request.formData();
          for (const [k, v] of form.entries()) body[k] = v;
        } else {
          body = await request.json();
        }

        const game = body.game || "";
        const userKey = (body.user_key || "").trim();
        const serial = body.serial || "";

        // Basic Request Validation
        if (game !== GAME_NAME || !userKey || !serial) {
          return new Response(JSON.stringify({ status: false, reason: "Missing fields" }), { headers: { "Content-Type": "application/json" } });
        }

        // KV check
        const raw = await env.ZAK_LICENSES.get(`key:${userKey}`);
        if (!raw) {
          return new Response(JSON.stringify({ status: false, reason: "Invalid Key" }), { headers: { "Content-Type": "application/json" } });
        }

        const keyData = JSON.parse(raw);
        const now = Math.floor(Date.now() / 1000);

        // Status checks
        if (keyData.revoked) return new Response(JSON.stringify({ status: false, reason: "Key Revoked" }));
        if (now > keyData.expires_at) return new Response(JSON.stringify({ status: false, reason: "Key Expired" }));

        // Device Lock (HWID)
        if (!keyData.devices.includes(serial)) {
          if (keyData.devices.length >= keyData.max_devices) {
            return new Response(JSON.stringify({ status: false, reason: "Max Devices Reached" }));
          }
          keyData.devices.push(serial);
          await env.ZAK_LICENSES.put(`key:${userKey}`, JSON.stringify(keyData));
        }

        // Generate Token exactly as Lua script expects
        const tokenString = `${game}-${userKey}-${serial}-${SECRET_KEY}`;
        const token = md5(tokenString);

        return new Response(JSON.stringify({
          status: true,
          data: {
            token: token,
            rng: now // Server time
          }
        }), { headers: { "Content-Type": "application/json" } });

      } catch (error) {
        return new Response(JSON.stringify({ status: false, reason: error.message }), { status: 500 });
      }
    }

    return new Response("Not Found", { status: 404 });
  }
};

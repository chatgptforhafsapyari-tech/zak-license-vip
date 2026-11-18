// language: JavaScript, file: worker.js

const SECRET_KEY = "ZAKPUBGSKIN"; // Lua config wala secret
const GAME_NAME = "BGMI";         // Lua config wala game
const ADMIN_SECRET = "ZAKADMIN2026"; // Admin panel ka password

// ==========================================
// 100% RELIABLE MD5 (Matches Lua Script)
// ==========================================
function md5(inputString) {
    var hc="0123456789abcdef";
    function rh(n) {var j,s="";for(j=0;j<=3;j++) s+=hc.charAt((n>>(j*8+4))&0x0F)+hc.charAt((n>>(j*8))&0x0F);return s;}
    function ad(x,y) {var l=(x&0xFFFF)+(y&0xFFFF);var m=(x>>16)+(y>>16)+(l>>16);return (m<<16)|(l&0xFFFF);}
    function rl(n,c) {return (n<<c)|(n>>>(32-c));}
    function cm(q,a,b,x,s,t) {return ad(rl(ad(ad(a,q),ad(x,t)),s),b);}
    function ff(a,b,c,d,x,s,t) {return cm((b&c)|((~b)&d),a,b,x,s,t);}
    function gg(a,b,c,d,x,s,t) {return cm((b&d)|(c&(~d)),a,b,x,s,t);}
    function hh(a,b,c,d,x,s,t) {return cm(b^c^d,a,b,x,s,t);}
    function ii(a,b,c,d,x,s,t) {return cm(c^(b|(~d)),a,b,x,s,t);}
    function sb(x) {var i;var nblk=((x.length+8)>>6)+1;var blks=new Array(nblk*16);for(i=0;i<nblk*16;i++) blks[i]=0;for(i=0;i<x.length;i++) blks[i>>2]|=x.charCodeAt(i)<<((i%4)*8);blks[i>>2]|=0x80<<((i%4)*8);blks[nblk*16-2]=x.length*8;return blks;}
    function str2binb(str) {var bin=Array();var mask=(1<<8)-1;for(var i=0;i<str.length*8;i+=8) {bin[i>>5]|=(str.charCodeAt(i/8)&mask)<<(i%32);}return bin;}
    var x=str2binb(inputString), a=1732584193, b=-271733879, c=-1732584194, d=271733878;
    for(var i=0;i<x.length;i+=16) {
        var olda=a, oldb=b, oldc=c, oldd=d;
        a=ff(a,b,c,d,x[i+ 0],7,-680876936); d=ff(d,a,b,c,x[i+ 1],12,-389564586);
        c=ff(c,d,a,b,x[i+ 2],17, 606105819); b=ff(b,c,d,a,x[i+ 3],22,-1044525330);
        a=ff(a,b,c,d,x[i+ 4],7,-176418897); d=ff(d,a,b,c,x[i+ 5],12, 1200080426);
        c=ff(c,d,a,b,x[i+ 6],17,-1473231341); b=ff(b,c,d,a,x[i+ 7],22, -45705983);
        a=ff(a,b,c,d,x[i+ 8],7, 1770035416); d=ff(d,a,b,c,x[i+ 9],12,-1958414417);
        c=ff(c,d,a,b,x[i+10],17,    -42063); b=ff(b,c,d,a,x[i+11],22,-1990404162);
        a=ff(a,b,c,d,x[i+12],7, 1804603682); d=ff(d,a,b,c,x[i+13],12, -40341101);
        c=ff(c,d,a,b,x[i+14],17,-1502002290); b=ff(b,c,d,a,x[i+15],22, 1236535329);
        a=gg(a,b,c,d,x[i+ 1],5,-165796510); d=gg(d,a,b,c,x[i+ 6],9,-1069501632);
        c=gg(c,d,a,b,x[i+11],14, 643717713); b=gg(b,c,d,a,x[i+ 0],20,-373897302);
        a=gg(a,b,c,d,x[i+ 5],5,-701558691); d=gg(d,a,b,c,x[i+10],9,  38016083);
        c=gg(c,d,a,b,x[i+15],14,-660478335); b=gg(b,c,d,a,x[i+ 4],20,-405537848);
        a=gg(a,b,c,d,x[i+ 9],5, 568446438); d=gg(d,a,b,c,x[i+14],9,-1019803690);
        c=gg(c,d,a,b,x[i+ 3],14,-187363961); b=gg(b,c,d,a,x[i+ 8],20, 1163531501);
        a=gg(a,b,c,d,x[i+13],5,-1444681467); d=gg(d,a,b,c,x[i+ 2],9, -51403784);
        c=gg(c,d,a,b,x[i+ 7],14, 1735328473); b=gg(b,c,d,a,x[i+12],20,-1926607734);
        a=hh(a,b,c,d,x[i+ 5],4,-378558); d=hh(d,a,b,c,x[i+ 8],11,-2022574463);
        c=hh(c,d,a,b,x[i+11],16, 1839030562); b=hh(b,c,d,a,x[i+14],23, -35309556);
        a=hh(a,b,c,d,x[i+ 1],4,-1530992060); d=hh(d,a,b,c,x[i+ 4],11, 1272893353);
        c=hh(c,d,a,b,x[i+ 7],16,-155497632); b=hh(b,c,d,a,x[i+10],23,-1094730640);
        a=hh(a,b,c,d,x[i+13],4,  681279174); d=hh(d,a,b,c,x[i+ 0],11, -358537222);
        c=hh(c,d,a,b,x[i+ 3],16, -722521979); b=hh(b,c,d,a,x[i+ 6],23,  76029189);
        a=hh(a,b,c,d,x[i+ 9],4, -640364487); d=hh(d,a,b,c,x[i+12],11, -421815835);
        c=hh(c,d,a,b,x[i+15],16, 530742520); b=hh(b,c,d,a,x[i+ 2],23, -995338651);
        a=ii(a,b,c,d,x[i+ 0],6,-198630844); d=ii(d,a,b,c,x[i+ 7],10, 1126891415);
        c=ii(c,d,a,b,x[i+14],15,-1416354905); b=ii(b,c,d,a,x[i+ 5],21, -57434055);
        a=ii(a,b,c,d,x[i+12],6, 1700485571); d=ii(d,a,b,c,x[i+ 3],10,-1894986606);
        c=ii(c,d,a,b,x[i+10],15,   -1051523); b=ii(b,c,d,a,x[i+ 1],21,-2054922799);
        a=ii(a,b,c,d,x[i+ 8],6, 1873313359); d=ii(d,a,b,c,x[i+15],10, -30611744);
        c=ii(c,d,a,b,x[i+ 6],15,-1560198380); b=ii(b,c,d,a,x[i+13],21, 1309151649);
        a=ii(a,b,c,d,x[i+ 4],6,-145523070); d=ii(d,a,b,c,x[i+11],10,-1120210379);
        c=ii(c,d,a,b,x[i+ 2],15,  718787259); b=ii(b,c,d,a,x[i+ 9],21,-343485551);
        a=ad(a,olda); b=ad(b,oldb); c=ad(c,oldc); d=ad(d,oldd);
    }
    return rh(a)+rh(b)+rh(c)+rh(d);
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
        // Exact string without modifying case
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

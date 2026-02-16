import express from "express";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ADMIN LOGIN
const ADMIN_USER = "raghav";
const ADMIN_PASS = "raghav2924r";

// DATABASE (in-memory)
let licenses = [];
let revoked = [];

// HOME
app.get("/", (req, res) => {
  res.send("RÆON Pro License Server 😈");
});

// ADMIN LOGIN PAGE
app.get("/admin", (req, res) => {
  res.send(`
  <h2>RÆON Admin Login</h2>
  <form action="/admin/login" method="post">
    <input name="user" placeholder="username"/><br>
    <input name="pass" type="password" placeholder="password"/><br>
    <button>Login</button>
  </form>
  `);
});

// LOGIN
app.post("/admin/login", (req, res) => {
  const { user, pass } = req.body;
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    res.redirect("/admin/panel");
  } else {
    res.send("Access Denied ☠");
  }
});

// ADMIN PANEL
app.get("/admin/panel", (req, res) => {

  let table = licenses.map(l => {
    const daysLeft = Math.ceil(
      (new Date(l.expiry) - new Date()) / (1000 * 60 * 60 * 24)
    );

    return `
    <tr>
      <td>${l.key}</td>
      <td>${l.expired ? "EXPIRED" : l.bound ? "BOUND" : "FREE"}</td>
      <td>${l.device || "-"}</td>
      <td>${l.firstUsed || "-"}</td>
      <td>${l.lastUsed || "-"}</td>
      <td>${l.uses}</td>
      <td>${l.ip || "-"}</td>
      <td>${l.expiry} (${daysLeft} days)</td>
      <td>${l.notes}</td>
    </tr>`;
  }).join("");

  res.send(`
  <h2>RÆON Pro Dashboard 😈</h2>

  <form action="/admin/generate" method="post">
    Expiry (days): 
    <input name="days" value="30"/>
    Notes:
    <input name="notes" placeholder="client name"/>
    <button>Generate Key</button>
  </form>

  <h3>Licenses</h3>
  <table border="1">
    <tr>
      <th>Key</th>
      <th>Status</th>
      <th>Device</th>
      <th>Activated</th>
      <th>Last Used</th>
      <th>Uses</th>
      <th>IP</th>
      <th>Expiry</th>
      <th>Notes</th>
    </tr>
    ${table}
  </table>

  <h3>Revoke Key</h3>
  <form action="/admin/revoke" method="post">
    <input name="key" placeholder="key"/>
    <button>Revoke</button>
  </form>

  <h3>Export</h3>
  <a href="/admin/export">Download CSV</a>
  `);
});

// GENERATE
app.post("/admin/generate", (req, res) => {
  const days = parseInt(req.body.days || 30);
  const notes = req.body.notes || "";

  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);

  const key = "RAON-" + Math.random().toString(36).substring(2, 10).toUpperCase();

  licenses.push({
    key,
    bound: false,
    device: null,
    ip: null,
    firstUsed: null,
    lastUsed: null,
    uses: 0,
    expiry: expiry.toISOString().split("T")[0],
    expired: false,
    notes
  });

  res.redirect("/admin/panel");
});

// REVOKE
app.post("/admin/revoke", (req, res) => {
  const { key } = req.body;
  const found = licenses.find(k => k.key === key);
  if (found) {
    licenses = licenses.filter(k => k.key !== key);
    revoked.push(found);
  }
  res.redirect("/admin/panel");
});

// EXPORT CSV
app.get("/admin/export", (req, res) => {
  let csv = "Key,Status,Device,Activated,LastUsed,Uses,IP,Expiry,Notes\n";

  licenses.forEach(l => {
    csv += `${l.key},${l.bound?"BOUND":"FREE"},${l.device},${l.firstUsed},${l.lastUsed},${l.uses},${l.ip},${l.expiry},${l.notes}\n`;
  });

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=licenses.csv");
  res.send(csv);
});

// VERIFY (APP SIDE)
app.post("/license/verify", (req, res) => {
  const { key, device } = req.body;
  const ip = req.ip;

  const license = licenses.find(k => k.key === key);
  if (!license) return res.json({ valid: false });

  if (new Date() > new Date(license.expiry)) {
    license.expired = true;
    return res.json({ valid: false, reason: "Expired" });
  }

  if (!license.bound) {
    license.bound = true;
    license.device = device;
    license.ip = ip;
    license.firstUsed = new Date().toISOString();
  }

  if (license.device !== device) {
    return res.json({ valid: false, reason: "Key already bound" });
  }

  license.lastUsed = new Date().toISOString();
  license.uses++;

  res.json({
    valid: true,
    expiry: license.expiry,
    status: "OK"
  });
});

// START
app.listen(3000, () => {
  console.log("RÆON Phase 5 Pro Server Running 😈");
});

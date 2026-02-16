import express from "express";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== ADMIN LOGIN =====
const ADMIN_USER = "raghav";
const ADMIN_PASS = "raghav2924r";

// ===== DATABASE (in memory) =====
let licenses = [];
let revoked = [];

// ===== HOME =====
app.get("/", (req, res) => {
  res.send("RÆON License Server Running 😈");
});

// ===== LOGIN PAGE =====
app.get("/admin", (req, res) => {
  res.send(`
    <h2>Admin Login</h2>
    <form action="/admin/login" method="post">
      <input name="user" placeholder="username"/><br>
      <input name="pass" type="password" placeholder="password"/><br>
      <button>Login</button>
    </form>
  `);
});

// ===== LOGIN CHECK =====
app.post("/admin/login", (req, res) => {
  const { user, pass } = req.body;

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    res.redirect("/admin/panel");
  } else {
    res.send("Wrong credentials ☠");
  }
});

// ===== ADMIN PANEL =====
app.get("/admin/panel", (req, res) => {
  res.send(`
    <h2>RÆON Admin Panel 😈</h2>

    <form action="/admin/generate" method="post">
      <button>Generate Key</button>
    </form>

    <h3>Active Keys</h3>
    <pre>${JSON.stringify(licenses, null, 2)}</pre>

    <h3>Revoked Keys</h3>
    <pre>${JSON.stringify(revoked, null, 2)}</pre>

    <form action="/admin/revoke" method="post">
      <input name="key" placeholder="key to revoke"/>
      <button>Revoke</button>
    </form>
  `);
});

// ===== GENERATE KEY =====
app.post("/admin/generate", (req, res) => {
  const key = "RAON-" + Math.random().toString(36).substring(2, 10).toUpperCase();
  licenses.push(key);
  res.redirect("/admin/panel");
});

// ===== REVOKE KEY =====
app.post("/admin/revoke", (req, res) => {
  const { key } = req.body;

  if (licenses.includes(key)) {
    licenses = licenses.filter(k => k !== key);
    revoked.push(key);
  }
  res.redirect("/admin/panel");
});

// ===== USER VERIFY API =====
app.post("/license/verify", (req, res) => {
  const { key } = req.body;

  if (licenses.includes(key)) {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});

// ===== START =====
app.listen(3000, () => {
  console.log("Server running on port 3000 😈");
});

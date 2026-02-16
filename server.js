import express from "express";
import session from "express-session";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: "RAON-SESSION-SECRET-999",
  resave: false,
  saveUninitialized: true
}));

// ADMIN LOGIN
const ADMIN_USER = "raghav";
const ADMIN_PASS = "raghav2924r";

// IN-MEMORY DATABASE
const activeLicenses = {};   // key -> deviceID

// HOME
app.get("/", (req, res) => {
  res.send("RÆON backend is alive 😈");
});

// LOGIN PAGE
app.get("/admin", (req, res) => {
  if (req.session.logged) return res.redirect("/admin/panel");

  res.send(`
    <h2>RÆON Admin Login</h2>
    <form method="POST" action="/admin/login">
      Username: <input name="user"/><br/><br/>
      Password: <input type="password" name="pass"/><br/><br/>
      <button type="submit">Login</button>
    </form>
  `);
});

// LOGIN CHECK
app.post("/admin/login", (req, res) => {
  const { user, pass } = req.body;

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    req.session.logged = true;
    res.redirect("/admin/panel");
  } else {
    res.send("Wrong credentials ☠");
  }
});

// ADMIN PANEL
app.get("/admin/panel", (req, res) => {
  if (!req.session.logged) return res.redirect("/admin");

  res.send(`
    <h2>Welcome Raghav 😈</h2>
    <form method="GET" action="/admin/gen">
      Type: <input name="type" placeholder="DEV / STUDENT / HACKER"/><br/><br/>
      <button type="submit">Generate Key</button>
    </form>
    <br/>
    <form method="GET" action="/admin/revoke">
      Revoke Key: <input name="key"/><br/><br/>
      <button type="submit">Revoke</button>
    </form>
    <br/>
    <a href="/admin/logout">Logout</a>
  `);
});

// GENERATE KEY
app.get("/admin/gen", (req, res) => {
  if (!req.session.logged) return res.redirect("/admin");

  const type = req.query.type || "TEST";
  const key =
    "RAON-" +
    type.toUpperCase() +
    "-" +
    Math.floor(1000 + Math.random() * 9000);

  res.send(`
    <h2>Generated Key</h2>
    <h1>${key}</h1>
    <a href="/admin/panel">Back</a>
  `);
});

// REVOKE KEY
app.get("/admin/revoke", (req, res) => {
  if (!req.session.logged) return res.redirect("/admin");

  const key = req.query.key;
  delete activeLicenses[key];

  res.send(`
    <h2>Key Revoked</h2>
    <p>${key}</p>
    <a href="/admin/panel">Back</a>
  `);
});

// LOGOUT
app.get("/admin/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin");
});

// LICENSE VERIFY (FOR JAVA APP)
app.post("/license/verify", (req, res) => {
  const { key, device } = req.body;

  // First time use
  if (!activeLicenses[key]) {
    activeLicenses[key] = device;
    return res.json({ valid: true, bound: true });
  }

  // Same device
  if (activeLicenses[key] === device) {
    return res.json({ valid: true, bound: false });
  }

  // Used on another PC
  return res.json({
    valid: false,
    reason: "KEY_ALREADY_USED_ON_ANOTHER_DEVICE"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("RÆON server running on port " + PORT);
});

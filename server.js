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

const ADMIN_USER = "raghav";
const ADMIN_PASS = "raghav2924r";

// DATABASE
const generatedKeys = [];        // all keys ever generated
const activeLicenses = {};       // key -> device

app.get("/", (req, res) => {
  res.send("RÆON backend is alive 😈");
});

// LOGIN
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
      Type: <input name="type"/><br/><br/>
      <button type="submit">Generate Key</button>
    </form>

    <br/>
    <a href="/admin/keys">View All Keys</a>
    <br/><br/>

    <form method="GET" action="/admin/revoke">
      Revoke Key: <input name="key"/><br/><br/>
      <button type="submit">Revoke</button>
    </form>

    <br/>
    <a href="/admin/logout">Logout</a>
  `);
});

// GENERATE
app.get("/admin/gen", (req, res) => {
  if (!req.session.logged) return res.redirect("/admin");

  const type = req.query.type || "TEST";
  const key =
    "RAON-" +
    type.toUpperCase() +
    "-" +
    Math.floor(1000 + Math.random() * 9000);

  generatedKeys.push(key);

  res.send(`
    <h2>Generated Key</h2>
    <h1>${key}</h1>
    <a href="/admin/panel">Back</a>
  `);
});

// VIEW ALL KEYS
app.get("/admin/keys", (req, res) => {
  if (!req.session.logged) return res.redirect("/admin");

  let list = generatedKeys.map(k => {
    const status = activeLicenses[k]
      ? "BOUND"
      : "UNUSED";
    return `<li>${k} - ${status}</li>`;
  }).join("");

  res.send(`
    <h2>All Keys</h2>
    <ul>${list}</ul>
    <a href="/admin/panel">Back</a>
  `);
});

// REVOKE
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

// VERIFY FOR JAVA
app.post("/license/verify", (req, res) => {
  const { key, device } = req.body;

  if (!generatedKeys.includes(key)) {
    return res.json({ valid: false, reason: "KEY_NOT_FOUND" });
  }

  if (!activeLicenses[key]) {
    activeLicenses[key] = device;
    return res.json({ valid: true, bound: true });
  }

  if (activeLicenses[key] === device) {
    return res.json({ valid: true, bound: false });
  }

  return res.json({
    valid: false,
    reason: "KEY_ALREADY_USED_ON_ANOTHER_DEVICE"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("RÆON server running");
});

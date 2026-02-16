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

app.get("/", (req, res) => {
  res.send("RÆON backend is alive 😈");
});

// Login page
app.get("/admin", (req, res) => {
  if (req.session.logged) {
    return res.redirect("/admin/panel");
  }

  res.send(`
    <h2>RÆON Admin Login</h2>
    <form method="POST" action="/admin/login">
      Username: <input name="user"/><br/><br/>
      Password: <input type="password" name="pass"/><br/><br/>
      <button type="submit">Login</button>
    </form>
  `);
});

// Login check
app.post("/admin/login", (req, res) => {
  const { user, pass } = req.body;

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    req.session.logged = true;
    res.redirect("/admin/panel");
  } else {
    res.send("Wrong credentials ☠");
  }
});

// Admin panel
app.get("/admin/panel", (req, res) => {
  if (!req.session.logged) {
    return res.redirect("/admin");
  }

  res.send(`
    <h2>Welcome Raghav 😈</h2>
    <form method="GET" action="/admin/gen">
      Type: <input name="type"/><br/><br/>
      <button type="submit">Generate Key</button>
    </form>
    <br/>
    <a href="/admin/logout">Logout</a>
  `);
});

// Generator (protected)
app.get("/admin/gen", (req, res) => {
  if (!req.session.logged) {
    return res.redirect("/admin");
  }

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

// Logout
app.get("/admin/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin");
});

// License API for your Java app
app.post("/license/verify", (req, res) => {
  const key = req.body.key;
  res.json({ valid: key.startsWith("RAON-") });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("RÆON server running");
});

import express from "express";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Hardcoded admin credentials
const ADMIN_USER = "raghav";
const ADMIN_PASS = "raghav2924r";

// Home
app.get("/", (req, res) => {
  res.send("RÆON backend is alive 😈");
});

// 1️⃣ Login page
app.get("/admin", (req, res) => {
  res.send(`
    <h2>RÆON Admin Login</h2>
    <form method="POST" action="/admin/login">
      Username: <input name="user"/><br/><br/>
      Password: <input type="password" name="pass"/><br/><br/>
      <button type="submit">Login</button>
    </form>
  `);
});

// 2️⃣ Login check
app.post("/admin/login", (req, res) => {
  const { user, pass } = req.body;

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    res.send(`
      <h2>Welcome Raghav 😈</h2>
      <form method="GET" action="/admin/gen">
        Type: <input name="type"/><br/><br/>
        <button type="submit">Generate Key</button>
      </form>
    `);
  } else {
    res.send("Wrong credentials ☠");
  }
});

// 3️⃣ Generator (only after login)
app.get("/admin/gen", (req, res) => {
  const type = req.query.type || "TEST";
  const key =
    "RAON-" +
    type.toUpperCase() +
    "-" +
    Math.floor(1000 + Math.random() * 9000);

  res.send(`
    <h2>Generated Key</h2>
    <h1>${key}</h1>
    <a href="/admin">Generate another</a>
  `);
});

// License API (for your Java app)
app.post("/license/verify", (req, res) => {
  const key = req.body.key;
  res.json({ valid: key.startsWith("RAON-") });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("RÆON server running");
});

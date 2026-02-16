import express from "express";
import session from "express-session";
import mongoose from "mongoose";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: "RAON-SESSION-SECRET-999",
  resave: false,
  saveUninitialized: true
}));

mongoose.connect("YOUR_MONGODB_URL_HERE");

// MODEL
const KeySchema = new mongoose.Schema({
  key: String,
  device: String,
  revoked: { type: Boolean, default: false }
});
const KeyModel = mongoose.model("Key", KeySchema);

// ADMIN
const ADMIN_USER = "raghav";
const ADMIN_PASS = "raghav2924r";

app.get("/", (req, res) => {
  res.send("RÆON backend is alive 😈");
});

// LOGIN
app.get("/admin", (req, res) => {
  if (req.session.logged) return res.redirect("/admin/panel");
  res.send(`
    <h2>RÆON Admin Login</h2>
    <form method="POST" action="/admin/login">
      Username: <input name="user"/><br/>
      Password: <input type="password" name="pass"/><br/>
      <button>Login</button>
    </form>
  `);
});

app.post("/admin/login", (req, res) => {
  const { user, pass } = req.body;
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    req.session.logged = true;
    res.redirect("/admin/panel");
  } else res.send("Wrong ☠");
});

// PANEL
app.get("/admin/panel", async (req, res) => {
  if (!req.session.logged) return res.redirect("/admin");

  const keys = await KeyModel.find();

  let list = keys.map(k =>
    `<li>${k.key} - ${
      k.revoked ? "REVOKED ☠" :
      k.device ? "BOUND" :
      "UNUSED"
    }</li>`
  ).join("");

  res.send(`
    <h2>RÆON Admin Panel 😈</h2>
    <form action="/admin/gen">
      Type: <input name="type"/>
      <button>Generate</button>
    </form>
    <ul>${list}</ul>

    <form action="/admin/revoke">
      Revoke key: <input name="key"/>
      <button>Revoke</button>
    </form>

    <a href="/admin/logout">Logout</a>
  `);
});

// GENERATE
app.get("/admin/gen", async (req, res) => {
  if (!req.session.logged) return res.redirect("/admin");

  const type = req.query.type || "TEST";
  const key = "RAON-" + type + "-" + Math.floor(1000 + Math.random()*9000);

  await KeyModel.create({ key });

  res.redirect("/admin/panel");
});

// REVOKE (REAL)
app.get("/admin/revoke", async (req, res) => {
  if (!req.session.logged) return res.redirect("/admin");

  const key = req.query.key;
  await KeyModel.updateOne(
    { key },
    { revoked: true }
  );

  res.redirect("/admin/panel");
});

// VERIFY (REAL LOGIC)
app.post("/license/verify", async (req, res) => {
  const { key, device } = req.body;
  const row = await KeyModel.findOne({ key });

  if (!row) return res.json({ valid:false });

  if (row.revoked)
    return res.json({ valid:false, reason:"REVOKED" });

  if (!row.device) {
    row.device = device;
    await row.save();
    return res.json({ valid:true, bound:true });
  }

  if (row.device === device)
    return res.json({ valid:true });

  res.json({ valid:false, reason:"USED" });
});

// LOGOUT
app.get("/admin/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("RÆON running"));

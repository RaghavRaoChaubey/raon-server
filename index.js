import express from "express";

const app = express();
app.use(express.json());

const validKeys = [
  "RAON-DEV-9999",
  "RAON-ALPHA-1234"
];

app.get("/", (req, res) => {
  res.send("RÆON SERVER ONLINE 😈");
});

app.post("/license/verify", (req, res) => {
  const { key } = req.body;

  if (validKeys.includes(key)) {
    res.json({ status: "ok", plan: "hacker" });
  } else {
    res.json({ status: "invalid" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});

import express from "express";

const app = express();
app.use(express.json());

const licenses = [
  "RAON-DEV-9999",
  "RAON-STUDENT-1234",
  "RAON-HACKER-0001"
];

app.get("/", (req, res) => {
  res.send("RÆON backend is alive 😈");
});

app.post("/license/verify", (req, res) => {
  const key = req.body.key;
  res.json({ valid: licenses.includes(key) });
});

app.get("/admin/gen", (req, res) => {
  const type = req.query.type || "TEST";
  const key =
    "RAON-" +
    type.toUpperCase() +
    "-" +
    Math.floor(1000 + Math.random() * 9000);

  res.json({ generatedKey: key });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

import express from "express";
const app = express();
app.use(express.json());

// fake database
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

  if (licenses.includes(key)) {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});

app.listen(3000, () => {
  console.log("RÆON server running on port 3000");
});

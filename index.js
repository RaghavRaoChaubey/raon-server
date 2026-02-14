import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("RÆON SERVER ONLINE 😈");
});

app.get("/ping", (req, res) => {
  res.send("RÆON SERVER ONLINE 😈");
});

// IMPORTANT PART
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

import "./server.js";

import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("RÆON backend is alive 😈");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
app.get("/", (req, res) => {
  res.send("RÆON SERVER ONLINE");
});

app.get("/ping", (req, res) => {
  res.send("RÆON SERVER ONLINE");
});


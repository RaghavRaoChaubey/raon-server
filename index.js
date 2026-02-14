import express from "express";

const app = express();
app.use(express.json());

// TEMP DATABASE (we'll upgrade later)
const licenses = {
  "RAON-DEV-9999": null   // null = not used yet
};

// Health check
app.get("/", (req, res) => {
  res.send("RÆON backend is alive 😈");
});

// License verify
app.post("/license/verify", (req, res) => {
  const { key, device } = req.body;

  if (!licenses[key]) {
    return res.json({ valid: false });
  }

  // First activation
  if (licenses[key] === null) {
    licenses[key] = device;
    return res.json({ valid: true });
  }

  // Already activated on same device
  if (licenses[key] === device) {
    return res.json({ valid: true });
  }

  // Used on another device
  return res.json({ valid: false });
});

app.listen(3000, () => {
  console.log("RÆON server running on port 3000");
});

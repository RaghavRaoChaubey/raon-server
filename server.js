import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());

// Load licenses from file
let licenses = {};
if (fs.existsSync("licenses.json")) {
  licenses = JSON.parse(fs.readFileSync("licenses.json"));
}

// Save to file
function save() {
  fs.writeFileSync("licenses.json", JSON.stringify(licenses, null, 2));
}

// Home
app.get("/", (req, res) => {
  res.send("RÆON Server Online 😈");
});

// Generate key (admin only)
app.get("/generate", (req, res) => {
  const key = "RAEON-" + Math.random().toString(36).substr(2, 8).toUpperCase();
  licenses[key] = { device: null };
  save();
  res.json({ key });
});

// Verify key
app.post("/verify", (req, res) => {
  const { key, device } = req.body;

  if (!licenses[key]) {
    return res.json({ success: false });
  }

  // First time use → bind device
  if (licenses[key].device === null) {
    licenses[key].device = device;
    save();
    return res.json({ success: true, message: "Bound to device" });
  }

  // Already bound
  if (licenses[key].device === device) {
    return res.json({ success: true, message: "Welcome back" });
  }

  // Different device
  res.json({ success: false, message: "Key already used on another device" });
});

// Revoke key
app.post("/revoke", (req, res) => {
  const { key } = req.body;
  delete licenses[key];
  save();
  res.json({ revoked: true });
});

app.listen(3000, () => {
  console.log("RÆON server running on port 3000");
});

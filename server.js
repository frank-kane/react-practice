const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const FILE_PATH = "./data/tree.json";

// GET /tree - return tree data
app.get("/tree", (req, res) => {
  
  fs.readFile(FILE_PATH, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Failed to read tree.json");
    }
    res.json(JSON.parse(data));
  });
});

// POST /tree - save tree data
app.post("/tree", (req, res) => {
  fs.writeFile(FILE_PATH, JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return res.status(500).send("Failed to write tree.json");
    }
    res.send("Tree saved successfully.");
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

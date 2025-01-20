const express = require("express");

const app = express();

console.log("Starting the app...");

app.get("/", (req, res) => {
  console.log("Root route hit");
  res.send("Express on Vercel");
});

// Use dynamic port
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Running on port ${port}.`);
});

// Export the Express API
module.exports = app;

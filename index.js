const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "vitalnest-db.c8xsiy4wm0fu.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "myroot1234",
  database: "vitalnest-db"
});

db.connect(err => {
  if (err) {
    console.error("❌ DB Connection Failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});

// POST route for form submission
app.post("/subscribe", (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  const query = "INSERT INTO subscriptions (fullName, email) VALUES (?, ?)";

  db.query(query, [fullName, email], (err, result) => {
    if (err) {
      console.error("❌ Error inserting into DB:", err.message);
      return res.status(500).json({ error: "Database error." });
    }

    console.log("✅ New subscription saved");
    res.status(200).json({ message: "Subscription successful!" });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

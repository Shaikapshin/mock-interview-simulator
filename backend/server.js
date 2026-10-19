
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175"
  ]
}));

app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Mock Interview Simulator Backend is Running!");
});

// Test backend and database connection
app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");

    res.json({
      server: "Running",
      database: "MySQL Connected"
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      server: "Running",
      database: "Connection Failed"
    });
  }
});

// API routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/results", require("./routes/results"));

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await db.query("SELECT 1");
    console.log("MySQL connected successfully!");

    app.listen(PORT, () => {
      console.log(`Backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MySQL connection error:", error.message);
  }
}

startServer();

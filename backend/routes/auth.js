const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

function createToken(userId) {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const [existing] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [cleanEmail]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name.trim(), cleanEmail, hashedPassword]
    );

    const user = {
      id: result.insertId,
      name: name.trim(),
      email: cleanEmail,
    };

    res.status(201).json({
      message: "Registration successful",
      token: createToken(user.id),
      user,
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({
      message: "Registration failed",
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const [rows] = await db.execute(
      "SELECT id, name, email, password FROM users WHERE email = ?",
      [email.trim().toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const account = rows[0];
    const passwordMatch = await bcrypt.compare(
      password,
      account.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = {
      id: account.id,
      name: account.name,
      email: account.email,
    };

    res.json({
      message: "Login successful",
      token: createToken(user.id),
      user,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      message: "Login failed",
    });
  }
});

// GET CURRENT USER
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, name, email FROM users WHERE id = ?",
      [req.userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({ user: rows[0] });
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch user",
    });
  }
});

module.exports = router;
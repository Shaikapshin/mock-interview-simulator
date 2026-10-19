const express = require("express");
const db = require("../db");
const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

router.use(authMiddleware);

// GET ALL RESULTS FOR LOGGED-IN USER
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT id, category, language, subject, difficulty,
              test_type AS testType, score, total, writing,
              created_at AS createdAt
       FROM results
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.userId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Fetch results error:", error.message);
    res.status(500).json({
      message: "Unable to fetch results",
    });
  }
});

// SAVE A TEST RESULT
router.post("/", async (req, res) => {
  try {
    const {
      category,
      language = null,
      subject = null,
      difficulty,
      testType,
      score = null,
      total = 0,
      writing = null,
    } = req.body;

    if (!["Technical", "HR", "Aptitude"].includes(category)) {
      return res.status(400).json({
        message: "Invalid category",
      });
    }

    if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
      return res.status(400).json({
        message: "Invalid difficulty",
      });
    }

    if (!["MCQ", "Writing"].includes(testType)) {
      return res.status(400).json({
        message: "Invalid test type",
      });
    }

    if (testType === "MCQ") {
      if (
        !Number.isInteger(score) ||
        !Number.isInteger(total) ||
        total <= 0 ||
        score < 0 ||
        score > total
      ) {
        return res.status(400).json({
          message: "Invalid score or total",
        });
      }
    }

    if (testType === "Writing" && typeof writing !== "string") {
      return res.status(400).json({
        message: "Writing response is required",
      });
    }

    const [result] = await db.execute(
      `INSERT INTO results
       (user_id, category, language, subject, difficulty,
        test_type, score, total, writing)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.userId,
        category,
        language,
        subject,
        difficulty,
        testType,
        testType === "MCQ" ? score : null,
        testType === "MCQ" ? total : 0,
        testType === "Writing" ? writing : null,
      ]
    );

    res.status(201).json({
      message: "Result saved successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Save result error:", error.message);
    res.status(500).json({
      message: "Unable to save result",
    });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// Search courses by title
router.get("/title", async (req, res) => {
  const { query } = req.query;
  try {
    const courses = await Course.find({
      title: { $regex: query, $options: "i" },
    });
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

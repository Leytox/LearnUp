const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Quiz = require("../models/Quiz");
const Enrollment = require("../models/Enrollment");

// Add a quiz to a course (only instructors and admins)
router.post("/", auth, async (req, res) => {
  const { course, title, questions } = req.body;
  try {
    const quiz = new Quiz({ course, title, questions });
    await quiz.save();
    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get quizzes for a specific course (only enrolled users)
router.get("/:courseId", auth, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      course: req.params.courseId,
      student: req.user.id,
    });
    if (!enrollment)
      return res.status(403).json({ msg: "Not enrolled in this course" });
    const quizzes = await Quiz.find({ course: req.params.courseId });
    res.json(quizzes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

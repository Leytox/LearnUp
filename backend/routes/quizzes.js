const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Quiz = require("../models/Quiz");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// Middleware to check if the user is enrolled or is the creator
const checkEnrollmentOrCreator = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    const enrollment = await Enrollment.findOne({
      course: course._id,
      student: req.user.id,
    });

    if (!enrollment && req.user.id !== course.creator.toString())
      return res.status(403).json({ msg: "Not authorized" });

    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

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

// Get quizzes for a specific course (only enrolled users or creators)
router.get(
  "/quizz/:quizzId",
  auth,
  checkEnrollmentOrCreator,
  async (req, res) => {
    try {
      const quizzes = await Quiz.find({ course: req.params.courseId });
      res.json(quizzes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
);

router.get("/:courseId", async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId }).select(
      "title",
    );
    res.json(quizzes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

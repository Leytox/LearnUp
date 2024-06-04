const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Lesson = require("../models/Lesson");
const Enrollment = require("../models/Enrollment");

// Add a lesson to a course (only instructors and admins)
router.post("/", auth, async (req, res) => {
  const { course, title, content, videoUrl } = req.body;
  try {
    const lesson = new Lesson({ course, title, content, videoUrl });
    await lesson.save();
    res.json(lesson);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get lessons for a specific course (only enrolled users)
router.get("/:courseId", auth, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      course: req.params.courseId,
      student: req.user.id,
    });
    if (!enrollment)
      return res.status(403).json({ msg: "Not enrolled in this course" });
    const lessons = await Lesson.find({ course: req.params.courseId });
    res.json(lessons);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

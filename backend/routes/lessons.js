const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

const checkEnrollmentOrCreator = async (req, res, next) => {
  try {
    if (req.user.role === "admin") return next();
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return res.status(404).json({ msg: "Lesson not found" });
    const course = await Course.findById(lesson.course);
    if (!course) return res.status(404).json({ msg: "Course not found" });
    const enrollment = await Enrollment.findOne({
      course: course._id,
      student: req.user.id,
    });
    if (!enrollment && req.user.id !== course.instructor.toString())
      return res.status(403).json({ msg: "Not authorized" });
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Add a lesson to a course (only instructors and admins)
router.post("/", auth, async (req, res) => {
  const { course, title, description, content } = req.body;
  try {
    const lesson = new Lesson({ course, title, description, content });
    await lesson.save();
    res.json(lesson);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Update a lesson (only instructors and admins)
router.put("/:lessonId", auth, async (req, res) => {
  const { title, description, content } = req.body;
  try {
    let lesson = await Lesson.findById(req.params.lessonId).populate(
      "course",
      "instructor",
    );
    if (!lesson) return res.status(404).json({ msg: "Lesson not found" });
    console.log(lesson);
    // Check user permission
    if (
      lesson.course.instructor.toString() !== req.user.id &&
      req.user.role !== "admin"
    )
      return res.status(401).json({ msg: "User not authorized" });

    lesson = await Lesson.findByIdAndUpdate(req.params.lessonId, {
      title,
      description,
      content,
      updatedAt: Date.now(),
    });

    res.json(lesson);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get lesson by id (only enrolled students or creators)
router.get(
  "/details/:lessonId",
  auth,
  checkEnrollmentOrCreator,
  async (req, res) => {
    try {
      const lesson = await Lesson.findById(req.params.lessonId).populate(
        "course",
        "instructor",
      );
      if (!lesson) return res.status(404).json({ msg: "Lesson not found" });
      return res.status(200).json(lesson);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
);

router.get("/:courseId", async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId }).select(
      "-content",
    );
    res.json(lessons);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// Enroll in a course
router.post("/", auth, async (req, res) => {
  const { courseId } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: "Course not found" });
    const enrollment = new Enrollment({
      course: courseId,
      student: req.user.id,
    });
    await enrollment.save();
    res.json(enrollment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Return true if enrolled for a course
router.get("/enrolled/:course", auth, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      course: req.params.course,
      student: req.user.id,
    });
    res.json(!!enrollment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all enrolled courses for a student
router.get("/my-courses", auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user.id,
    }).populate("course");
    res.json(enrollments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all enrollments for a course
router.get("/course/:courseId", async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      course: req.params.courseId,
    }).populate("student", ["name", "email"]);
    res.json(enrollments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

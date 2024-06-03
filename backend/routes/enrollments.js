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

// Get all enrollments for a student
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
router.get("/course/:courseId", auth, async (req, res) => {
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

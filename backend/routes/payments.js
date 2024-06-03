const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// Simulate payment
router.post("/simulate-payment", auth, async (req, res) => {
  const { courseId } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    // Simulate successful payment
    const enrollment = new Enrollment({
      course: courseId,
      student: req.user.id,
    });
    await enrollment.save();

    res.json({ msg: "Payment successful", enrollment });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

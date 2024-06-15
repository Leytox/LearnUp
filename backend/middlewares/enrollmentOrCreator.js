const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
module.exports = async function checkEnrollmentOrCreator(req, res, next) {
  try {
    if (req.user.role === "admin") return next();
    const lesson = await Lesson.findById(
      req.body.lesson || req.params.lessonId,
    );
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

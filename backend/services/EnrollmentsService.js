import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

async function enrollInCourse(req, res) {
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
}

async function checkEnrollment(req, res) {
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
}

async function checkEnrollmentsById(req, res) {
  try {
    const enrollments = await Enrollment.find({
      student: req.user.id,
    }).populate("course");
    res.json(enrollments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function getAllEnrollmentsById(req, res) {
  try {
    const enrollments = await Enrollment.find({
      course: req.params.courseId,
    }).populate("student", ["name", "email"]);
    res.json(enrollments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

export default {
  enrollInCourse,
  checkEnrollment,
  checkEnrollmentsById,
  getAllEnrollmentsById,
};

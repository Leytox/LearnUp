const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const EnrollmentsService = require("../services/EnrollmentsService");

// Enroll in a course
router.post("/", auth, EnrollmentsService.enrollInCourse);

// Return true if enrolled for a course
router.get("/enrolled/:course", auth, EnrollmentsService.checkEnrollment);

// Get all enrolled courses for a student
router.get("/my-courses", auth, EnrollmentsService.checkEnrollmentsById);

// Get all enrollments for a course
router.get("/course/:courseId", auth, EnrollmentsService.getAllEnrollmentsById);

module.exports = router;

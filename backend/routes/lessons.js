const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const checkEnrollmentOrCreator = require("../middlewares/enrollmentOrCreator");
const LessonsService = require("../services/LessonsService");

// Add a lesson to a course (only instructors and admins)
router.post("/", auth, LessonsService.createLesson);

// Update a lesson (only instructors and admins)
router.put("/:lessonId", auth, LessonsService.updateLesson);

// Get lesson by id (only enrolled students or creators)
router.get(
  "/details/:lessonId",
  auth,
  checkEnrollmentOrCreator,
  LessonsService.getLessonById,
);

// Get all lessons of a course
router.get("/:courseId", LessonsService.getLessonsForCourse);

module.exports = router;

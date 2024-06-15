const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const CoursesService = require("../services/CoursesService");

// Create a new course
router.post(
  "/",
  auth,
  upload("uploads/courses").single("file"),
  CoursesService.createCourse,
);

router.get("/search", CoursesService.searchCourses);

// Get a specific course
router.get("/:id", CoursesService.getCourseById);

// Update a course
router.put(
  "/:id",
  auth,
  upload("uploads/courses").single("file"),
  CoursesService.updateCourse,
);

// Delete a course
router.delete("/:id", auth, CoursesService.deleteCourse);

// Get all courses
router.get("/", CoursesService.getAllCourses);

// Get courses of specific instructor
router.get("/instructor/:id", CoursesService.getCoursesByInstructorId);

module.exports = router;

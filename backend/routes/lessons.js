import { Router } from "express";
const router = Router();
import auth from "../middlewares/auth.js";
import checkEnrollmentOrCreator from "../middlewares/enrollmentOrCreator.js";
import LessonsService from "../services/LessonsService.js";

// Add a lesson to a course (only instructors and admins)
router.post("/", auth, LessonsService.createLesson);

// Update a lesson (only instructors and admins)
router.put("/:lessonId", auth, LessonsService.updateLesson);

// Get lesson by id (only enrolled students or creators)
router.get(
  "/details/:lessonId",
  auth,
  checkEnrollmentOrCreator,
  LessonsService.getLessonById
);

// Get all lessons of a course
router.get("/:courseId", LessonsService.getLessonsForCourse);

export default router;

import { Router } from "express";
const router = Router();
import auth from "../middlewares/auth.js";
import checkEnrollmentOrCreator from "../middlewares/enrollmentOrCreator.js";
import QuizzesService from "../services/QuizzesService.js";

// Get quizzes for a specific course
router.get("/:courseId", QuizzesService.getQuizzesForCourse);

// Add a quiz to a course (only instructors and admins)
router.post("/", auth, checkEnrollmentOrCreator, QuizzesService.addQuiz);

router.put(
  "/course/:courseId/quizz/:quizzId",
  auth,
  checkEnrollmentOrCreator,
  QuizzesService.updateQuiz
);
// Get quiz for a specific course (only enrolled users or creators)
router.get(
  "/course/:courseId/lesson/:lessonId/quizz/:quizzId",
  auth,
  checkEnrollmentOrCreator,
  QuizzesService.getQuiz
);

export default router;

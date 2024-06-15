const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const checkEnrollmentOrCreator = require("../middlewares/enrollmentOrCreator");
const QuizzesService = require("../services/QuizzesService");
const { checkEnrollment } = require("../services/EnrollmentsService");

// Get quizzes for a specific course
router.get("/:courseId", QuizzesService.getQuizzesForCourse);

// Add a quiz to a course (only instructors and admins)
router.post("/", auth, checkEnrollmentOrCreator, QuizzesService.addQuiz);

router.put(
  "/course/:courseId/quizz/:quizzId",
  auth,
  checkEnrollmentOrCreator,
  QuizzesService.updateQuiz,
);
// Get quiz for a specific course (only enrolled users or creators)
router.get(
  "/course/:courseId/lesson/:lessonId/quizz/:quizzId",
  auth,
  checkEnrollmentOrCreator,
  QuizzesService.getQuiz,
);

module.exports = router;

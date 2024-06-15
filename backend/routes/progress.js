const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const ProgressService = require("../services/ProgressService");

// Complete quiz and possibly generate certificate
router.post("/complete-quiz", auth, ProgressService.completeQuiz);

// Get certificate
router.get(
  "/certificate/:userId/:courseId",
  auth,
  ProgressService.getCertificate,
);

// Get progress
router.get("/user/:userId/course/:courseId", auth, ProgressService.getProgress);

module.exports = router;

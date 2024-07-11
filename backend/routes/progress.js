import { Router } from "express";
const router = Router();
import auth from "../middlewares/auth.js";
import ProgressService from "../services/ProgressService.js";

// Complete quiz and possibly generate certificate
router.post("/complete-quiz", auth, ProgressService.completeQuiz);

// Get certificate
router.get(
  "/certificate/:userId/:courseId",
  auth,
  ProgressService.getCertificate
);

// Get progress
router.get("/user/:userId/course/:courseId", auth, ProgressService.getProgress);

export default router;

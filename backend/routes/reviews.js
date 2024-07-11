import { Router } from "express";
const router = Router();
import auth from "../middlewares/auth.js";
import ReviewService from "../services/ReviewService.js";

// Create a review
router.post("/", auth, ReviewService.createReview);

// Get reviews for a course
router.get("/:courseId", ReviewService.getReviewsForCourse);

export default router;

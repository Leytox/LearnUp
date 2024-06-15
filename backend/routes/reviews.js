const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const ReviewService = require("../services/ReviewService");

// Create a review
router.post("/", auth, ReviewService.createReview);

// Get reviews for a course
router.get("/:courseId", ReviewService.getReviewsForCourse);

module.exports = router;

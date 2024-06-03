const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Review = require("../models/Review");

// Create a review
router.post("/", auth, async (req, res) => {
  const { courseId, rating, comment } = req.body;
  try {
    const review = new Review({
      user: req.user.id,
      course: courseId,
      rating,
      comment,
    });
    await review.save();
    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get reviews for a course
router.get("/:courseId", async (req, res) => {
  const { courseId } = req.params;
  try {
    const reviews = await Review.find({ course: courseId }).populate("user", [
      "name",
      "email",
    ]);
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Add routes for updating and deleting reviews if needed

module.exports = router;

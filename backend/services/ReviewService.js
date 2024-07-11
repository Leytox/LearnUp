import Review from "../models/Review.js";

async function createReview(req, res) {
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
}

async function getReviewsForCourse(req, res) {
  const { courseId } = req.params;
  try {
    const reviews = await Review.find({ course: courseId }).populate("user", [
      "-password",
    ]);
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

export default { createReview, getReviewsForCourse };

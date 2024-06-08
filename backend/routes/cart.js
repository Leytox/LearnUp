const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Cart = require("../models/Cart");
const Enrollment = require("../models/Enrollment");

// Get cart for the current user
router.get("/", auth, async (req, res) => {
  try {
    const cart = await Cart.find({ user: req.user.id }).populate(
      "courses.course",
    );
    if (!cart) return res.status(404).json({ msg: "Cart not found" });
    res.status(200).json(cart[0].courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Add a course to the cart
router.post("/add", auth, async (req, res) => {
  const { courseId } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart)
      cart = new Cart({ user: req.user.id, courses: [{ course: courseId }] });
    else {
      // Check if the course is already in the cart
      const courseExists = cart.courses.some(
        (courseItem) => courseItem.course.toString() === courseId,
      );
      // Check if user already enrolled in the course
      const enrollment = await Enrollment.findOne({
        student: req.user.id,
        course: courseId,
      });
      if (enrollment)
        return res.status(400).json({ msg: "Course already enrolled" });
      if (courseExists)
        return res.status(400).json({ msg: "Course already in cart" });
      cart.courses.push({ course: courseId });
    }
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Remove a course from the cart
router.post("/remove", auth, async (req, res) => {
  const { courseId } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }
    cart.courses = cart.courses.filter(
      (courseItem) => courseItem.course.toString() !== courseId,
    );
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

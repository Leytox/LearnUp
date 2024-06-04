const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Cart = require("../models/Cart");
const Enrollment = require("../models/Enrollment");

// Get cart for the current user
router.get("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "courses.course",
    );
    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }
    res.json(cart);
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
    if (!cart) {
      cart = new Cart({ user: req.user.id, courses: [{ course: courseId }] });
    } else {
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

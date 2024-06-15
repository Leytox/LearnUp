const Cart = require("../models/Cart");
const Enrollment = require("../models/Enrollment");

async function processPayment(req, res) {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart || cart.courses.length === 0) {
      return res.status(400).json({ msg: "Cart is empty" });
    }
    const enrollments = cart.courses.map((courseItem) => ({
      course: courseItem.course,
      student: req.user.id,
      enrolledAt: new Date(),
    }));
    await Enrollment.insertMany(enrollments);

    // Clear the cart after successful payment
    cart.courses = [];
    await cart.save();

    res.json({ msg: "Payment successful, enrolled in courses" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

module.exports = { processPayment };

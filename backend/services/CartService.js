import Cart from "../models/Cart.js";
import Enrollment from "../models/Enrollment.js";

async function getCartItems(req, res) {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ msg: "Cart not found" });
    else
      cart = await Cart.find({ user: req.user.id }).populate("courses.course");
    res.status(200).json(cart[0].courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function addToCart(req, res) {
  const { courseId } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart)
      cart = new Cart({ user: req.user.id, courses: [{ course: courseId }] });
    else {
      // Check if the course is already in the cart
      const courseExists = cart.courses.some(
        (courseItem) => courseItem.course.toString() === courseId
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
}

async function removeFromCart(req, res) {
  const { courseId } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }
    cart.courses = cart.courses.filter(
      (courseItem) => courseItem.course.toString() !== courseId
    );
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

export default { getCartItems, addToCart, removeFromCart };

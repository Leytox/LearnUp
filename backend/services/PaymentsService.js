import Cart from "../models/Cart.js";
import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";
import transporter from "../utils/email.js";

async function processPayment(req, res) {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate(
      "courses.course"
    );
    if (!cart || cart.courses.length === 0)
      return res.status(400).json({ msg: "Cart is empty" });
    const enrollments = cart.courses.map((courseItem) => ({
      course: courseItem.course._id,
      student: req.user.id,
      enrolledAt: new Date(),
    }));
    await Enrollment.insertMany(enrollments);

    // Get the titles of the courses
    const courseTitles = cart.courses
      .map((courseItem) => courseItem.course.title)
      .join(", ");

    // Clear the cart after successful payment
    cart.courses = [];
    await cart.save();
    const user = await User.findById(req.user.id);
    const mailOptions = {
      from: process.env.OUTLOOK_EMAIL,
      to: user.email,
      subject: "Enrolled in courses",
      text: `You have successfully enrolled in the following courses: ${courseTitles}`,
    };
    await transporter.sendMail(mailOptions);
    res.json({ msg: "Payment successful, enrolled in courses" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}
export default { processPayment };

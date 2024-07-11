import User from "../models/User.js";
import Course from "../models/Course.js";

async function getAllUsers(req, res) {
  try {
    if (!req.user || req.user.role !== "admin")
      return res.status(403).json({ msg: "Unauthorized" });
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function getAllCourses(req, res) {
  try {
    if (!req.user || req.user.role !== "admin")
      return res.status(403).json({ msg: "Unauthorized" });
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

export default { getAllUsers, getAllCourses };

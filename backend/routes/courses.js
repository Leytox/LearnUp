const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Course = require("../models/Course");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { extname } = require("node:path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/courses");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
// Create a new course
router.post("/", auth, upload.single("file"), async (req, res) => {
  const { title, description, category, price } = req.body;
  console.log(req.file);
  try {
    const course = new Course({
      title,
      description,
      instructor: req.user.id,
      category,
      price,
      available: false,
      picture: req.file.path,
    });
    await course.save();
    res.status(200).json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", [
      "name",
      "email",
    ]);
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get courses of specific instructor
router.get("/instructor/:id", async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.params.id });
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get a specific course
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("instructor", [
      "name",
      "email",
    ]);
    if (!course) return res.status(404).json({ msg: "Course not found" });
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/search", async (req, res) => {
  const { query } = req.query;
  try {
    const courses = await Course.find({
      $text: { $search: query },
    });

    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Update a course
router.put("/:id", auth, async (req, res) => {
  const { title, description, price } = req.body;
  try {
    let course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: "Course not found" });
    if (course.instructor.toString() !== req.user.id)
      return res.status(401).json({ msg: "User not authorized" });
    course.title = title || course.title;
    course.description = description || course.description;
    course.price = price || course.price;
    await course.updateOne();
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Delete a course
router.delete("/:id", auth, async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: "Course not found" });
    if (course.instructor.toString() !== req.user.id)
      return res.status(401).json({ msg: "User not authorized" });
    await course.deleteOne();
    res.json({ msg: "Course removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

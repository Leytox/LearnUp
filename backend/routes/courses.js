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
  const { title, description, category, difficulty, price } = req.body;
  try {
    const course = new Course({
      title,
      description,
      instructor: req.user.id,
      category,
      price,
      difficulty,
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

router.get("/search", async (req, res) => {
  try {
    const {
      query,
      minPrice,
      maxPrice,
      category,
      difficulty,
      sortOrder,
      page,
      limit,
    } = req.query;

    let queryObj = Course.find();

    if (query && query !== "all") {
      queryObj = queryObj.find({ $text: { $search: query } });
    }

    // Add price range filters
    if (minPrice) {
      queryObj = queryObj.where("price").gte(minPrice);
    }

    if (maxPrice) {
      queryObj = queryObj.where("price").lte(maxPrice);
    }

    // Add category filter
    if (category) {
      queryObj = queryObj.where("category").equals(category);
    }

    if (difficulty) {
      queryObj = queryObj.where("difficulty").equals(difficulty);
    }

    // Add sorting
    if (sortOrder) {
      queryObj = queryObj.sort({
        createdAt: sortOrder === "newest" ? -1 : 1,
      });
    }

    const totalItems = await Course.countDocuments(queryObj);

    // Add pagination
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 10;
    const skip = (parsedPage - 1) * parsedLimit;
    queryObj = queryObj.skip(skip).limit(parsedLimit);

    // Execute the query and get the results
    const results = await queryObj.exec();

    res.json({ items: results, totalItems });
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

// Update a course
router.put("/:id", auth, upload.single("file"), async (req, res) => {
  const { title, description, category, difficulty, price } = req.body;
  try {
    let course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: "Course not found" });
    if (
      course.instructor.toString() !== req.user.id &&
      req.user.role !== "admin"
    )
      return res.status(401).json({ msg: "User not authorized" });
    course.title = title || course.title;
    course.description = description || course.description;
    course.category = category || course.category;
    course.difficulty = difficulty || course.difficulty;
    course.price = price || course.price;
    if (req.file) {
      fs.unlinkSync(course.picture);
      course.picture = req.file.path;
    }
    await course.save();
    res.status(200).json(course);
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

    if (req.user.role !== "admin")
      return res.status(401).json({ msg: "User not authorized" });

    await course.deleteOne();
    res.json({ msg: "Course removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

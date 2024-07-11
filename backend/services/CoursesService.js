import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import { unlinkSync } from "fs";

async function createCourse(req, res) {
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
}

async function updateCourse(req, res) {
  const { title, description, category, difficulty, price, available } =
    req.body;
  try {
    let course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: "Course not found" });
    if (
      course.instructor.toString() !== req.user.id &&
      req.user.role !== "admin"
    )
      return res.status(401).json({ msg: "User not authorized" });
    const enrollments = await Enrollment.find({ course: req.params.id });
    if (enrollments.length > 0 && available === "false")
      return res.status(400).json({
        msg: "Cannot make course unavailable. There are students enrolled",
      });
    course.title = title || course.title;
    course.description = description || course.description;
    course.category = category || course.category;
    course.difficulty = difficulty || course.difficulty;
    course.price = price || course.price;
    course.available = available || course.available;
    if (req.file) {
      unlinkSync(course.picture);
      course.picture = req.file.path;
    }
    await course.save();
    res.status(200).json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function deleteCourse(req, res) {
  try {
    if (req.user.role !== "admin")
      return res.status(401).json({ msg: "User not authorized" });
    let course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: "Course not found" });
    await course.deleteOne();
    res.json({ msg: "Course removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function getAllCourses(req, res) {
  try {
    const courses = await find().populate("instructor", ["name", "email"]);
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function getCourseById(req, res) {
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
}

async function getCoursesByInstructorId(req, res) {
  try {
    let courses = [];
    if (req.headers.instructorId === req.params.id)
      courses = await Course.find({ instructor: req.params.id })
        .where("available")
        .equals(true);
    else courses = await Course.find({ instructor: req.params.id });
    return res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function searchCourses(req, res) {
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

    if (query && query !== "all")
      queryObj = queryObj.find({ $text: { $search: query } });

    // Add price range filters
    if (minPrice) queryObj = queryObj.where("price").gte(minPrice);

    if (maxPrice) queryObj = queryObj.where("price").lte(maxPrice);

    // Add category filter
    if (category) queryObj = queryObj.where("category").equals(category);

    if (difficulty) queryObj = queryObj.where("difficulty").equals(difficulty);

    // Add sorting
    if (sortOrder)
      queryObj = queryObj.sort({
        createdAt: sortOrder === "newest" ? -1 : 1,
      });

    queryObj = queryObj.where("available").equals(true);

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
    console.log(req.query);
    res.status(500).send("Server error");
  }
}

export default {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getCoursesByInstructorId,
  searchCourses,
};

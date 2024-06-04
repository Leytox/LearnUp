// backend/routes/categories.js

const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Category = require("../models/Category");

// Create a category (only admins)
router.post("/", auth, async (req, res) => {
  const { name, description, role } = req.body;
  try {
    if (role !== "admin")
      return res
        .status(401)
        .json({ msg: "You are not authorized to create a category" });
    const category = new Category({ name, description });
    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

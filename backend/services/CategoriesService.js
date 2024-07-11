import Category from "../models/Category.js";
import { unlinkSync } from "fs";

async function createCategory(req, res) {
  const { name } = req.body;
  try {
    if (req.user.role !== "admin")
      return res
        .status(401)
        .json({ msg: "You are not authorized to create a category" });
    const category = new Category({ name, picture: req.file.path });
    await category.save();
    res.status(200).json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function editCategory(req, res) {
  const { name, role } = req.body;
  try {
    if (req.user.role !== "admin")
      return res
        .status(401)
        .json({ msg: "You are not authorized to edit a category" });
    const category = await findById(req.params.id);
    if (!category) return res.status(404).json({ msg: "Category not found" });
    if (req.file) {
      unlinkSync(category.picture);
      category.picture = req.file.path;
    }
    category.name = name;
    await category.save();
    res.status(200).json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function getAllCategories(req, res) {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function getCategoryById(req, res) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ msg: "Category not found" });
    res.status(200).json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

export default {
  createCategory,
  editCategory,
  getAllCategories,
  getCategoryById,
};

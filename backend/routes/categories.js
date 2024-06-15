const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const CategoriesService = require("../services/CategoriesService");

// Create a category (only admins)
router.post(
  "/",
  auth,
  upload("uploads/categories").single("file"),
  CategoriesService.createCategory,
);

// Edit a category by id (only admins)
router.put(
  "/:id",
  auth,
  upload("uploads/categories").single("file"),
  CategoriesService.editCategory,
);

// Get all categories
router.get("/", CategoriesService.getAllCategories);

// Get a category by id
router.get("/:id", CategoriesService.getCategoryById);

module.exports = router;

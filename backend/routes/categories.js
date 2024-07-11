import { Router } from "express";
const router = Router();
import auth from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";
import CategoriesService from "../services/CategoriesService.js";

// Create a category (only admins)
router.post(
  "/",
  auth,
  upload("uploads/categories").single("file"),
  CategoriesService.createCategory
);

// Edit a category by id (only admins)
router.put(
  "/:id",
  auth,
  upload("uploads/categories").single("file"),
  CategoriesService.editCategory
);

// Get all categories
router.get("/", CategoriesService.getAllCategories);

// Get a category by id
router.get("/:id", CategoriesService.getCategoryById);

export default router;

import { Router } from "express";
const router = Router();
import auth from "../middlewares/auth.js";
import AdminService from "../services/AdminService.js";

// Get all users
router.get("/users", auth, AdminService.getAllUsers);

// Get all courses
router.get("/courses", auth, AdminService.getAllCourses);

export default router;

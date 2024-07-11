import { Router } from "express";
import auth from "../middlewares/auth.js";
import EnrollmentsService from "../services/EnrollmentsService.js";

const router = Router();

// Enroll in a course
router.post("/", auth, EnrollmentsService.enrollInCourse);

// Return true if enrolled for a course
router.get("/enrolled/:course", auth, EnrollmentsService.checkEnrollment);

// Get all enrolled courses for a student
router.get("/my-courses", auth, EnrollmentsService.checkEnrollmentsById);

// Get all enrollments for a course
router.get("/course/:courseId", auth, EnrollmentsService.getAllEnrollmentsById);

export default router;

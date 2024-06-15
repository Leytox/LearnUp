const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const AdminService = require("../services/AdminService");
const User = require("../models/User");

// Get all users
router.get("/users", auth, AdminService.getAllUsers);

// Get all courses
router.get("/courses", auth, AdminService.getAllCourses);

module.exports = router;

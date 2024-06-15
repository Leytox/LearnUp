const express = require("express");
const router = express.Router();
const AuthService = require("../services/AuthService");

// Register
router.post("/register", AuthService.Register);

// Login
router.post("/login", AuthService.Login);

module.exports = router;

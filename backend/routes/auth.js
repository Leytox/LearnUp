const express = require("express");
const router = express.Router();
const AuthService = require("../services/AuthService");

// Register
router.post("/register", AuthService.Register);

// Verify Account
router.post("/verify", AuthService.VerifyAccount);

// Forgot Password
router.post("/forgot-password", AuthService.ForgotPassword);

// Reset Password
router.post("/reset-password/:token", AuthService.ResetPassword);

// Login
router.post("/login", AuthService.Login);

module.exports = router;

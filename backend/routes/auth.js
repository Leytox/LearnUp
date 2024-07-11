import { Router } from "express";
const router = Router();
import AuthService from "../services/AuthService.js";

// Register
router.post("/register", AuthService.Register);

// Verify Account
router.post("/verify", AuthService.VerifyAccount);

// Verify via email
router.post("/verify-via-email", AuthService.VerifyViaEmail);

// Forgot Password
router.post("/forgot-password", AuthService.ForgotPassword);

// Reset Password
router.post("/reset-password/:token", AuthService.ResetPassword);

// Login
router.post("/login", AuthService.Login);

// OAuth
router.post("/google-oauth", AuthService.GoogleOAuth);

export default router;

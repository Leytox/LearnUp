import { Router } from "express";
const router = Router();
import auth from "../middlewares/auth.js";
import PaymentService from "../services/PaymentsService.js";

// Simulate payment processing and enroll in courses
router.post("/process", auth, PaymentService.processPayment);

export default router;

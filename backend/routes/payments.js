const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const PaymentService = require("../services/PaymentsService");

// Simulate payment processing and enroll in courses
router.post("/process", auth, PaymentService.processPayment);

module.exports = router;

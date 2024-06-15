const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const CartService = require("../services/CartService");

// Get cart for the current user
router.get("/", auth, CartService.getCartItems);

// Add a course to the cart
router.post("/add", auth, CartService.addToCart);

// Remove a course from the cart
router.post("/remove", auth, CartService.removeFromCart);

module.exports = router;

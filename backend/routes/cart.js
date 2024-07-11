import { Router } from "express";
const router = Router();
import auth from "../middlewares/auth.js";
import CartService from "../services/CartService.js";

// Get cart for the current user
router.get("/", auth, CartService.getCartItems);

// Add a course to the cart
router.post("/add", auth, CartService.addToCart);

// Remove a course from the cart
router.post("/remove", auth, CartService.removeFromCart);

export default router;

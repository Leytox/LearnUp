const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const User = require("../models/User");

// Get all users (admin only)
router.get("/users", auth, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin")
      return res.status(403).json({ msg: "Unauthorized" });
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/users/:id", auth, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin")
      return res.status(403).json({ msg: "Unauthorized" });
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Update user role (admin only)
router.put("/users/:id", auth, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin")
      return res.status(403).json({ msg: "Unauthorized" });
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    user.role = role;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

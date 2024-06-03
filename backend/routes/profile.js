const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const User = require("../models/User");

// Get user profile
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Update user profile
router.put("/", auth, async (req, res) => {
  const { name, bio } = req.body;
  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    user.name = name || user.name;
    user.bio = bio || user.bio;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

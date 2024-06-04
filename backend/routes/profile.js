const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const User = require("../models/User");
const multer = require("multer");
const fs = require("node:fs");
const { v4: uuidv4 } = require("uuid");
const { extname } = require("node:path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
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

router.post(
  "/picture",
  auth,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ msg: "User not found" });

      // Delete the old profile picture file from the server
      if (user.profilePicture)
        fs.unlink(`${user.profilePicture}`, (err) => {
          if (err) console.error(err);
        });

      // Save the new profile picture
      user.profilePicture = req.file.path;
      await user.save();

      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
);

router.delete("/picture", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Delete the profile picture file from the server
    if (user.profilePicture) {
      fs.unlink(`${user.profilePicture}`, (err) => {
        if (err) console.error(err);
      });
    }
    user.profilePicture = "";
    await user.save();

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
    if (!user) return res.status(404).json({ msg: "User not found" });
    user.name = name || user.name;
    user.bio = bio || user.bio;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.delete("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (user.id !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });
    await User.findByIdAndDelete(req.user.id);
    if (user.profilePicture)
      fs.unlink(`${user.profilePicture}`, (err) => {
        if (err) console.error(err);
      });
    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

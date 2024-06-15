const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const ProfileService = require("../services/ProfileService");

// Get user profile
router.get("/:id", ProfileService.getUserProfileById);

// Update user profile
router.put("/", auth, ProfileService.updateUserProfile);

// Delete user profile
router.delete("/", auth, ProfileService.deleteUserProfile);

// Update user profile picture
router.post(
  "/picture",
  auth,
  upload("uploads/profile").single("profilePicture"),
  ProfileService.updateProfilePicture,
);

// Delete user profile picture
router.delete("/picture", auth, ProfileService.deleteProfilePicture);

module.exports = router;

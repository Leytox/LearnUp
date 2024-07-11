import { Router } from "express";
const router = Router();
import auth from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";
import ProfileService from "../services/ProfileService.js";
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
  upload("../uploads/profile/").single("profilePicture"),
  ProfileService.updateProfilePicture
);

// Update password
router.put("/password", auth, ProfileService.updatePassword);

// Delete user profile picture
router.delete("/picture", auth, ProfileService.deleteProfilePicture);

export default router;

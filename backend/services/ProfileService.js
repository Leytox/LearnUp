const User = require("../models/User");
const fs = require("node:fs");

async function getUserProfileById(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

async function updateUserProfile(req, res) {
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
}

async function deleteUserProfile(req, res) {
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
}

async function updateProfilePicture(req, res) {
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
}

async function deleteProfilePicture(req, res) {
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
}

module.exports = {
  getUserProfileById,
  updateUserProfile,
  deleteUserProfile,
  updateProfilePicture,
  deleteProfilePicture,
};

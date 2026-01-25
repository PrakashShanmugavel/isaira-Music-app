import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Playlist from "../models/Playlist.js";
import cloudinary from "../utils/cloudinary.js";

/* ================= UPDATE PROFILE ================= */
export const updateProfile = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (username) user.username = username;

    if (password) {
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error("❌ UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Profile update failed" });
  }
};

/* ================= PROFILE STATS ================= */
export const getProfileStats = async (req, res) => {
  try {
    const likedCount = req.user.likes?.length || 0;

    const playlistsCount = await Playlist.countDocuments({
      owner: req.user.id
    });

    res.json({
      likedSongs: likedCount,
      playlists: playlistsCount
    });
  } catch (err) {
    console.error("❌ PROFILE STATS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch profile stats" });
  }
};

/* ================= RECENT ANALYTICS ================= */
export const getRecentAnalytics = async (req, res) => {
  try {
    const recent = req.user.recentlyPlayed || [];

    const analytics = recent.reduce((acc, songId) => {
      acc[songId] = (acc[songId] || 0) + 1;
      return acc;
    }, {});

    res.json(analytics);
  } catch (err) {
    console.error("❌ RECENT ANALYTICS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};

/* ================= UPLOAD AVATAR ================= */
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🔥 Delete old avatar from Cloudinary
    if (user.avatar) {
      const publicId = user.avatar.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    user.avatar = req.file.path;
    await user.save();

    res.json({
      message: "Avatar updated successfully",
      avatar: user.avatar
    });
  } catch (err) {
    console.error("❌ AVATAR UPLOAD ERROR:", err);
    res.status(500).json({ message: "Avatar upload failed" });
  }
};

/* ================= DELETE ACCOUNT ================= */
export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // 🔥 Delete avatar from Cloudinary
    if (user.avatar) {
      const publicId = user.avatar.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await User.findByIdAndDelete(req.user.id);

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("❌ DELETE ACCOUNT ERROR:", err);
    res.status(500).json({ message: "Account deletion failed" });
  }
};

/* ================= GET USER INFO ================= */
export const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("❌ USER INFO ERROR:", err);
    res.status(500).json({ message: "Failed to fetch user info" });
  }
};

/* ================= GET ALL USERS (ADMIN) ================= */
export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("❌ GET USERS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

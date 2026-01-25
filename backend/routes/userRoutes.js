import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  updateProfile,
  getProfileStats,
  getRecentAnalytics,
  uploadAvatar,
  deleteAccount,
  getUserInfo
} from "../controllers/userController.js";

import upload from "../middleware/upload.js"; // ✅ FIXED

const router = express.Router();

// Get profile stats
router.get("/stats", protect, getProfileStats);

// Recent activity
router.get("/recent-analytics", protect, getRecentAnalytics);

// User info
router.get("/me", protect, getUserInfo);

// Update profile
router.put("/profile", protect, updateProfile);

// Upload avatar
router.post(
  "/avatar",
  protect,
  upload.single("avatar"),
  uploadAvatar
);

// Delete account
router.delete("/delete", protect, deleteAccount);

export default router;

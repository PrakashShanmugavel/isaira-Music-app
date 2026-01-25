import express from "express";
import {
  addSong,
  getSongs,
  likeSong,
  unlikeSong,
  addRecent,
} from "../controllers/songController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js"; // ✅ FIXED

const router = express.Router();

/* ================= PUBLIC ROUTES ================= */

// Get all songs
router.get("/", getSongs);

/* ================= ADMIN ROUTES ================= */

// Upload song (Admin only)
router.post(
  "/add",
  protect,
  adminOnly,
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  addSong
);

/* ================= USER ROUTES ================= */

// Like song
router.post("/:id/like", protect, likeSong);

// Unlike song
router.post("/:id/unlike", protect, unlikeSong);

// Add to recently played
router.post("/:id/recent", protect, addRecent);

export default router;

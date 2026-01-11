import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addToPlaylist, createPlaylist, getUserPlaylists } from "../controllers/playlistController.js";

const router = express.Router();

router.post("/", protect, createPlaylist);
router.post("/:id/add", protect, addToPlaylist);
router.get("/", protect, getUserPlaylists);



export default router;

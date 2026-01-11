import Song from "../models/Song.js";
import User from "../models/User.js";

/* ================= ADD SONG ================= */
export const addSong = async (req, res) => {
  try {
    // ✅ Admin check
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    // ✅ File validation
    if (!req.files?.audio || !req.files?.image) {
      return res.status(400).json({
        message: "Audio and Image files are required",
      });
    }

    const audioFile = req.files.audio[0];
    const imageFile = req.files.image[0];

    // ✅ Cloudinary gives `.path`
    const song = await Song.create({
      title: req.body.title,
      artist: req.body.artist,
      audioUrl: audioFile.path,
      imageUrl: imageFile.path,
    });

    return res.status(201).json({
      success: true,
      message: "Song uploaded successfully",
      song,
    });

  } catch (err) {
    console.error("❌ ADD SONG ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Song upload failed",
      error: err.message,
    });
  }
};

/* ================= GET ALL SONGS ================= */
export const getSongs = async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.status(200).json(songs);
  } catch (err) {
    console.error("❌ FETCH SONGS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= LIKE SONG ================= */
export const likeSong = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.likes.includes(req.params.id)) {
      user.likes.push(req.params.id);
      await user.save();
    }

    res.json({
      message: "Song liked",
      likes: user.likes,
    });
  } catch (err) {
    console.error("❌ LIKE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= UNLIKE SONG ================= */
export const unlikeSong = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.likes = user.likes.filter(
      (id) => id.toString() !== req.params.id
    );

    await user.save();

    res.json({
      message: "Song unliked",
      likes: user.likes,
    });
  } catch (err) {
    console.error("❌ UNLIKE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= RECENTLY PLAYED ================= */
export const addRecent = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.recentlyPlayed = user.recentlyPlayed.filter(
      (id) => id.toString() !== req.params.id
    );

    user.recentlyPlayed.unshift(req.params.id);
    user.recentlyPlayed = user.recentlyPlayed.slice(0, 10);

    await user.save();

    res.json({ message: "Added to recently played" });
  } catch (err) {
    console.error("❌ RECENT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

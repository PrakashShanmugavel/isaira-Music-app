import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: String,
    audioUrl: { type: String, required: true },
    imageUrl: String,
    duration: String,
  },
  { timestamps: true }
);

export default mongoose.model("Song", songSchema);

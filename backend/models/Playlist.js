import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
  name: String,
  userId: mongoose.Schema.Types.ObjectId,
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
});


export default mongoose.model("Playlist", playlistSchema);

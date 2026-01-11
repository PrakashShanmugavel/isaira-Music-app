import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    avatar: {
        type: String,
        default: ""
    },
    username: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
    recentlyPlayed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }]
});

export default mongoose.model("User", userSchema);

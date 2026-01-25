import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isAudio = file.mimetype.startsWith("audio");

    return {
      folder: isAudio ? "spotify/songs" : "spotify/images",
      resource_type: "auto", // REQUIRED for audio
      format: isAudio ? "mp3" : undefined,
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max (important for Render)
  },
});

export default upload;

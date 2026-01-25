import multer from "multer";
import cloudinary from "../utils/cloudinary.js";
import CloudinaryStorage from 'multer-storage-cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Helper to determine folder based on file type
    const isAudio = file.mimetype.startsWith("audio");
    
    return {
      folder: isAudio ? "spotify/songs" : "spotify/images",
      resource_type: "auto", // Necessary for audio files
    };
  },
});

const upload = multer({ storage });

export default upload;
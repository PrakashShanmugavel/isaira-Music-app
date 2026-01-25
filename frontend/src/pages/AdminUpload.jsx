import { useState } from "react";
import api from "../api/api";

export default function AdminUpload() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audio, setAudio] = useState(null);
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  /* ================= IMAGE COMPRESSION ================= */
  const compressImage = (file) =>
    new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => (img.src = e.target.result);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const MAX_WIDTH = 500;
        const scale = MAX_WIDTH / img.width;

        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => resolve(blob),
          "image/jpeg",
          0.7
        );
      };

      reader.readAsDataURL(file);
    });

  /* ================= SUBMIT ================= */
  const submit = async (e) => {
    e.preventDefault();

    if (!title || !artist || !audio || !image) {
      setMessage("⚠️ Please fill all fields");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("❌ Please login first");
      return;
    }

    try {
      setLoading(true);
      setProgress(0);
      setMessage("");

      const compressedImage = await compressImage(image);

      const form = new FormData();
      form.append("title", title);
      form.append("artist", artist);
      form.append("audio", audio);
      form.append("image", compressedImage, "cover.jpg");

      await api.post("/songs/add", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (e) => {
          if (!e.total) return;
          const percent = Math.min(
            90,
            Math.round((e.loaded * 100) / e.total)
          );
          setProgress(percent);
        },
      });

      // Cloudinary finished
      setProgress(100);
      setMessage("✅ Song uploaded successfully!");

      // Reset
      setTitle("");
      setArtist("");
      setAudio(null);
      setImage(null);

      document.getElementById("audioInput").value = "";
      document.getElementById("imageInput").value = "";

    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "❌ Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        🎵 Admin Song Upload
      </h2>

      <form onSubmit={submit} className="space-y-5">
        {/* TITLE */}
        <div>
          <label className="text-sm text-gray-400">Song Title</label>
          <input
            className="w-full mt-1 px-4 py-3 rounded bg-neutral-800 text-white focus:ring-2 focus:ring-green-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter song title"
          />
        </div>

        {/* ARTIST */}
        <div>
          <label className="text-sm text-gray-400">Artist</label>
          <input
            className="w-full mt-1 px-4 py-3 rounded bg-neutral-800 text-white focus:ring-2 focus:ring-green-500"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Artist name"
          />
        </div>

        {/* AUDIO */}
        <div>
          <label className="text-sm text-gray-400">Audio File</label>
          <input
            id="audioInput"
            type="file"
            accept="audio/*"
            onChange={(e) => setAudio(e.target.files[0])}
            className="block mt-2 text-sm text-gray-300"
          />
        </div>

        {/* IMAGE */}
        <div>
          <label className="text-sm text-gray-400">Cover Image</label>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="block mt-2 text-sm text-gray-300"
          />

          {image && (
            <img
              src={URL.createObjectURL(image)}
              className="mt-3 w-28 h-28 rounded object-cover border border-neutral-700"
              alt="preview"
            />
          )}
        </div>

        {/* PROGRESS */}
        {loading && (
          <div className="w-full bg-neutral-800 rounded-full h-2">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full font-semibold py-3 rounded transition ${
            loading
              ? "bg-neutral-600 text-gray-300 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-400 text-black"
          }`}
        >
          {loading
            ? progress < 100
              ? `Uploading ${progress}%`
              : "Processing..."
            : "Upload Song"}
        </button>

        {message && (
          <p
            className={`text-center mt-3 ${
              message.includes("✅")
                ? "text-green-400"
                : "text-red-400"
            } animate-pulse`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

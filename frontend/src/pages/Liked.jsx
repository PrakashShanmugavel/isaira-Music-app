import { useEffect, useState } from "react";
import api from "../api/api";

export default function Liked() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    api.get("/songs/liked", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(res => setSongs(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">❤️ Liked Songs</h2>

      {songs.length === 0 && (
        <p className="text-gray-400">No liked songs yet</p>
      )}

      <div className="space-y-3">
        {songs.map(song => (
          <div key={song._id}
            className="flex justify-between bg-neutral-900 p-4 rounded hover:bg-neutral-800">
            <span>{song.title}</span>
            <span className="text-gray-400">{song.artist}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

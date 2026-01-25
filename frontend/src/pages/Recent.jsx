import { useEffect, useState } from "react";
import api from "../api/api";

export default function Recent() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    api.get("/songs/recent", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(res => setSongs(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">🕒 Recently Played</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {songs.map(song => (
          <div key={song._id} className="bg-neutral-900 p-4 rounded">
            <img src={song.imageUrl} className="rounded mb-2" />
            <p className="font-semibold">{song.title}</p>
            <p className="text-sm text-gray-400">{song.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

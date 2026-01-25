import { useEffect, useState } from "react";
import api from "../api/api";

export default function Playlists() {
  const [name, setName] = useState("");
  const [playlists, setPlaylists] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    api
      .get("/playlists", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPlaylists(res.data));
  }, []);

  const createPlaylist = async () => {
    if (!name.trim()) return;

    const res = await api.post(
      "/playlists",
      { name },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setPlaylists([...playlists, res.data]);
    setName("");
  };

  return (
    <div className="text-white">
      {/* HEADER */}
      <h2 className="text-3xl font-bold mb-6">📚 Your Playlists</h2>

      {/* CREATE PLAYLIST */}
      <div className="flex gap-3 mb-8 max-w-md">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New playlist name"
          className="flex-1 px-4 py-2 rounded bg-neutral-800 text-white outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={createPlaylist}
          className="bg-green-500 text-black px-4 py-2 rounded font-semibold hover:bg-green-400"
        >
          Create
        </button>
      </div>

      {/* PLAYLIST GRID */}
      {playlists.length === 0 && (
        <p className="text-gray-400">No playlists yet. Create one!</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((p) => (
          <div
            key={p._id}
            className="bg-neutral-900 rounded-lg p-4 hover:bg-neutral-800 transition"
          >
            <h4 className="font-semibold text-lg mb-3 truncate">
              🎵 {p.name}
            </h4>

            {/* SONG LIST */}
            {p.songs.length === 0 ? (
              <p className="text-sm text-gray-400">
                No songs in this playlist
              </p>
            ) : (
              <ul className="space-y-1 text-sm text-gray-300">
                {p.songs.map((song) => (
                  <li
                    key={song._id}
                    className="truncate hover:text-white"
                  >
                    • {song.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

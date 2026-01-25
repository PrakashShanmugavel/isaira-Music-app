import { useEffect, useState, useContext } from "react";
import api from "../api/api";
import { PlayerContext } from "../context/PlayerContext";

export default function Home() {
  const [songs, setSongs] = useState([]);
  const token = localStorage.getItem("token");

  const player = useContext(PlayerContext);
  const setCurrentSong = player?.setCurrentSong;

  const playSong = async (song) => {
    if (!setCurrentSong) return;

    setCurrentSong(song);

    if (!token) return;

    try {
      await api.post(
        `/songs/${song._id}/recent`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Recent song failed:", err.response?.status);
    }
  };

  const likeSong = async (songId) => {
    if (!token) {
      alert("Please login to like songs");
      return;
    }

    try {
      await api.post(
        `/songs/${songId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Like failed:", err.response?.status);
    }
  };

  useEffect(() => {
    api.get("/songs").then((res) => setSongs(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🎵 Songs</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {songs.map((song) => (
          <div
            key={song._id}
            className="bg-neutral-900 p-4 rounded-lg hover:bg-neutral-800 transition group"
          >
            <img
              src={song.imageUrl}
              alt={song.title}
              className="w-full h-40 object-cover rounded mb-3"
            />

            <p className="font-semibold truncate">{song.title}</p>
            <p className="text-sm text-gray-400 truncate">{song.artist}</p>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => playSong(song)}
                className="bg-green-500 text-black px-3 py-1 rounded-full text-sm font-semibold hover:bg-green-400"
              >
                ▶ Play
              </button>

              <button
                onClick={() => likeSong(song._id)}
                className="text-gray-400 hover:text-red-500 text-xl"
              >
                ❤️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState("");
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("");
  const [avatar, setAvatar] = useState(user.avatar || "");

  const token = localStorage.getItem("token");

  /* ================= LOAD STATS ================= */
  useEffect(() => {
    if (!token) return;

    api
      .get("/user/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, [token]);

  /* ================= UPDATE PROFILE ================= */
  const updateProfile = async () => {
    try {
      const payload = { username };
      if (password) payload.password = password;

      const res = await api.put("/user/profile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Update AuthContext + localStorage
      login(token, res.data.user);

      setPassword("");
      setMessage("Profile updated successfully");
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    }
  };

  /* ================= UPLOAD AVATAR ================= */
  const uploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await api.post("/user/avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAvatar(res.data.avatar);

      // ✅ Sync avatar to AuthContext
      login(token, { ...user, avatar: res.data.avatar });
    } catch {
      setMessage("Avatar upload failed");
    }
  };

  /* ================= DELETE ACCOUNT ================= */
  const deleteAccount = async () => {
    const ok = window.confirm(
      "This will permanently delete your account. Continue?"
    );
    if (!ok) return;

    await api.delete("/user/delete", {
      headers: { Authorization: `Bearer ${token}` },
    });

    logout();
    navigate("/");
  };

  return (
    <div className="max-w-3xl mx-auto px-6 mt-8 space-y-8">
      <h2 className="text-3xl font-bold text-white">👤 Profile</h2>

      {/* EDIT PROFILE */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">Edit Profile</h3>

        {/* AVATAR */}
        <div className="relative group w-24">
          <img
            src={avatar || "/avatar.png"}
            className="w-24 h-24 rounded-full object-cover"
          />
          <label className="absolute inset-0 bg-black/60 text-white text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer rounded-full">
            Change
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={uploadAvatar}
            />
          </label>
        </div>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 bg-neutral-800 rounded text-white"
          placeholder="Username"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-neutral-800 rounded text-white"
          placeholder="New password (optional)"
        />

        <button
          onClick={updateProfile}
          className="bg-green-500 text-black px-6 py-2 rounded font-semibold hover:bg-green-400"
        >
          Save Changes
        </button>

        {message && (
          <p className="text-sm text-green-400">{message}</p>
        )}
      </div>

      {/* STATS */}
      {stats && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-neutral-900 p-4 rounded">
            <p className="text-gray-400">Liked Songs</p>
            <p className="text-2xl font-bold text-white">
              {stats.likedSongs}
            </p>
          </div>

          <div className="bg-neutral-900 p-4 rounded">
            <p className="text-gray-400">Playlists</p>
            <p className="text-2xl font-bold text-white">
              {stats.playlists}
            </p>
          </div>
        </div>
      )}

      {/* DELETE */}
      <button
        onClick={deleteAccount}
        className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded font-semibold"
      >
        Delete Account
      </button>
    </div>
  );
}

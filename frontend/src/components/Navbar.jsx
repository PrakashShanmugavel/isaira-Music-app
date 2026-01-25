import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { UserCircle } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ✅ FIX: define logout handler
  const handleLogout = () => {
    logout();        // clears state + localStorage
    navigate("/");   // go to Register page
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-40 bg-neutral-900 border-b border-neutral-800"
    >
      <div className="h-16 px-6 flex items-center justify-between max-w-7xl mx-auto">

        {/* LEFT */}
        <div className="flex items-center gap-6">
          <span className="text-xl font-bold text-green-500">Spotify</span>

          <nav className="flex gap-3">
            <NavLink to="/home" className="nav-link">Home</NavLink>
            <NavLink to="/liked" className="nav-link">Liked</NavLink>
            <NavLink to="/recent" className="nav-link">Recent</NavLink>

            {/* ADMIN UPLOAD */}
            {user?.role === "admin" && (
              <NavLink
                to="/admin"
                className="text-green-400 hover:text-green-300 font-medium"
              >
                ⬆ Upload
              </NavLink>
            )}
          </nav>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* PROFILE */}
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition"
          >
            <UserCircle size={28} />
            <span className="text-sm hidden sm:block">
              {user?.username}
            </span>
          </button>

          {/* ADMIN BADGE */}
          {user?.role === "admin" && (
            <span className="text-xs bg-green-500 text-black px-2 py-0.5 rounded">
              ADMIN
            </span>
          )}

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-md text-sm transition"
          >
            Logout
          </button>
        </div>

      </div>
    </motion.header>
  );
}

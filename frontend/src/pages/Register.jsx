import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect logged-in users
  useEffect(() => {
    if (user) navigate("/home");
  }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username || !email || !password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/register", {
        username,
        email,
        password,
        role,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-neutral-900 rounded-xl shadow-lg p-8 border border-neutral-800"
      >
        {/* HEADER */}
        <h1 className="text-center text-3xl font-bold text-green-500 mb-2">
          Spotify
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Create your account
        </p>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 text-sm p-3 rounded mb-4">
            {error}
            {error.toLowerCase().includes("exists") && (
              <span className="ml-1">
                —{" "}
                <Link to="/login" className="underline">
                  Please login
                </Link>
              </span>
            )}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={submit} className="space-y-5">
          {/* USERNAME */}
          <div>
            <label className="text-sm text-gray-400 block mb-1">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name"
              required
              className="w-full px-4 py-3 rounded-md bg-neutral-800 text-white outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-400 block mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 rounded-md bg-neutral-800 text-white outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-gray-400 block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 pr-12 rounded-md bg-neutral-800 text-white outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>


          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-black py-3 rounded-md font-semibold hover:bg-green-400 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-green-500 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

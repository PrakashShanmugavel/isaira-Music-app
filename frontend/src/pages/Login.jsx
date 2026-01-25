import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState(
    localStorage.getItem("rememberEmail") || ""
  );
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(
    Boolean(localStorage.getItem("rememberEmail"))
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      login(res.data.token, res.data.user);

      if (remember) {
        localStorage.setItem("rememberEmail", email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
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
          Login to continue
        </p>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={submit} className="space-y-5">
          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-400 block mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {/* REMEMBER ME */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
              className="accent-green-500"
            />
            Remember me
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-black py-3 rounded-md font-semibold hover:bg-green-400 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-gray-400 mt-6 text-sm">
          New user?{" "}
          <Link to="/" className="text-green-500 hover:underline">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

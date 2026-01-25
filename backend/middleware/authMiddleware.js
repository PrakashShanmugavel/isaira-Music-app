import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  // 🔥 ALLOW CORS PREFLIGHT REQUESTS
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  const auth = req.headers.authorization;

  // Debug log (safe)
  console.log(
    "Middleware - Auth Header:",
    auth ? auth.substring(0, 20) + "..." : "Missing"
  );

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Not authorized: No token provided",
    });
  }

  try {
    const token = auth.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in environment variables!");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id || decoded._id || decoded.userId;

    if (!userId) {
      throw new Error("Invalid token payload");
    }

    req.user = await User.findById(userId).select("-password");

    if (!req.user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    next();
  } catch (error) {
    console.error("Middleware Error:", error.message);

    return res.status(401).json({
      message: "Not authorized",
      error: error.message,
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admin only.",
    });
  }
  next();
};

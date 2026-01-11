import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const auth = req.headers.authorization;

  // 1. Debug: Check if the header is even arriving
  console.log("Middleware - Auth Header:", auth ? auth.substring(0, 20) + "..." : "Missing");

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized: No Token provided" });
  }

  try {
    const token = auth.split(" ")[1];

    // 2. Debug: Check if JWT_SECRET is loaded
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in environment variables!");
    }

    // 3. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Middleware - Decoded ID:", decoded.id || decoded._id || decoded.userId);

    // 4. Find the user
    // Note: Ensure your token payload uses 'id', '_id', or 'userId' correctly
    req.user = await User.findById(decoded.id || decoded._id || decoded.userId).select("-password");

    if (!req.user) {
        console.log("Middleware - User not found in Database");
        return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    // 5. PRINT THE REAL ERROR
    console.error("Middleware Error:", error.message);
    
    res.status(401).json({ 
        message: "Not authorized", 
        error: error.message // Send specific error to frontend for debugging
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};
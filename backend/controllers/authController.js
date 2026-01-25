import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ================= REGISTER =================
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hash = await bcrypt.hash(password, 10);

  await User.create({
    username,
    email,
    password: hash,
    role: "user" // 🔒 FORCED
  });

  res.status(201).json({ message: "Registered successfully" });
};


// ================= LOGIN =================
// ================= LOGIN (DEBUG VERSION) =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`); // 1. Log entry

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(400).json({ message: "Wrong password" });
    }

    // DEBUG: Check if Secret exists
    if (!process.env.JWT_SECRET) {
      throw new Error("MISSING ENV VAR: JWT_SECRET is undefined!");
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Login successful, sending token.");

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    // 🔥 THIS IS THE IMPORTANT PART
    console.error("LOGIN CRASHED:", err.message); 
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
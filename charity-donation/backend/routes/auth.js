import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/User.js";
import { connectDB } from "../utils/connectDB.js";
import { authMiddleware } from "../utils/middleware.js";

dotenv.config();
connectDB();

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, aadhaar, mobile, password } = req.body;

    if (!name || !email || !aadhaar || !mobile || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(409).json({ error: "Email already in use" });

    const existingAadhaar = await User.findOne({ aadhaar });
    if (existingAadhaar) return res.status(409).json({ error: "Aadhaar already in use" });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, aadhaar, mobile, passwordHash });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Signup successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, aadhaar: user.aadhaar, mobile: user.mobile },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { aadhaar, email, password } = req.body;
    if (!aadhaar || !email || !password) {
      return res.status(400).json({ error: "Aadhaar, email and password are required" });
    }

    const user = await User.findOne({ email, aadhaar });
    if (!user) return res.status(404).json({ error: "User not found" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, aadhaar: user.aadhaar, mobile: user.mobile },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Example protected route
router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select("-passwordHash");
  res.json({ user });
});

export default router;

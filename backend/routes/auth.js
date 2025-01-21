const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticate = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/**
 * @route POST /login
 * @desc Login an existing user
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 3600000,
    });

    return res.json({
      message: "Login successful",
      user: { username: user.username, role: user.role },
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route POST /register
 * @desc Register a new user
 */
router.post("/register", async (req, res) => {
  const { username, password, role, email } = req.body;

  if (!username || !password || !role || !email) {
    return res.status(400).json({ error: "Please provide all fields" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const newUser = new User({ username, password, role, email });
    await newUser.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route GET /protected
 * @desc Access a protected route (requires authentication)
 */
router.get("/protected", authenticate, (req, res) => {
  res.status(200).json({
    message: "You have access to this protected route",
    user: req.user,
  });
});

/**
 * @route POST /logout
 * @desc Logout a user by clearing the token
 */
router.post("/logout", (req, res) => {
  console.log("Logout route hit");
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

/**
 * @route GET /users
 * @desc Get a list of all users (requires authentication and admin role)
 */
router.get("/users", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const users = await User.find({}, { password: 0 });
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route GET /profile
 * @desc Get user profile
 */
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id, { password: 0 });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route PUT /profile
 * @desc Update user profile
 */
router.put(
  "/profile",
  authenticate,
  upload.single("profilePicture"),
  async (req, res) => {
    const { email, bio } = req.body;
    const profilePicture = req.file;

    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.email = email || user.email;
      user.bio = bio || user.bio;
      if (profilePicture) {
        user.profilePicture = profilePicture.path;
      }

      await user.save();
      res.status(200).json({ message: "Profile updated successfully", user });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;

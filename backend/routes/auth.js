// Import dependencies
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticate = require("../middleware/authMiddleware");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Initialize router
const router = express.Router();

/**
 * @route POST /login
 * @desc Login an existing user
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set token in cookies with secure attributes
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 3600000
    });

    // Send response with token and user data
    return res.json({
      message: 'Login successful',
      user: { username: user.username, role: user.role },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route POST /register
 * @desc Register a new user
 */
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  // Validate required fields
  if (!username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Default role is 'user' if not provided
    const userRole = role || "user";

    // Create and save the new user with plain-text password
    const user = new User({
      username,
      password,  // Save plain-text password directly
      role: userRole,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route GET /protected
 * @desc Access a protected route (requires authentication)
 */
router.get("/protected", authenticate, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed",
    user: req.user,
  });
});

/**
 * @route GET /logout
 * @desc Logout a user by clearing the token
 */
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

// Export the router
module.exports = router;

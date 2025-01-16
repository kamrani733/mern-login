// Import dependencies
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticate = require("../middleware/authMiddleware");

// Initialize router
const router = express.Router();

/**
 * @route POST /register
 * @desc Register a new user
 */
// In the login route, add logs to track the process:
const jwt = require('jsonwebtoken');

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

    // Send the token as JSON response
    return res.json({
      message: 'Login successful',
      token,  // Include the token in the response
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
  console.log("Registration request body:", req.body);

  // Validate required fields
  if (!username || !password) {
    console.error("Registration failed: Missing fields");
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.error(`Registration failed: User ${username} already exists`);
      return res.status(400).json({ error: "User already exists" });
    }

    // Default role is 'user' if not provided
    const userRole = role || "user";

    // Create and save the new user with plain-text password
    const user = new User({
      username,
      password, // Save plain-text password directly
      role: userRole,
    });

    await user.save();
    console.log(`User ${username} registered successfully`);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});




/**
 * @route GET /protected
 * @desc Access a protected route (requires authentication)
 */
router.get("/protected", authenticate, (req, res) => {
  console.log("Accessing protected route:", req.user);
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
  console.log("User logged out");
  res.status(200).json({ message: "Logged out successfully" });
});

// Export the router
module.exports = router;

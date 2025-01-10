const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }
    const user = new User({ username, password });
    await user.save();
    res.status(201).send("User registered");
  } catch (err) {
    console.error("Registration error:", err);
    res.status(400).send("Error registering user");
  }
});
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  console.log("Request body:", req.body);

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  try {
    const user = await User.findOne({ username });
    console.log("User found:", user);

    if (!user) return res.status(400).send("User not found");

    console.log("Provided password:", password);
    console.log("Stored hashed password:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) return res.status(400).send("Invalid credentials");

    console.log("User ID:", user._id);
    console.log("JWT Secret:", process.env.JWT_SECRET);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("Generated token:", token);

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;

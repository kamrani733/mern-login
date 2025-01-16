const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();

// Middleware setup
app.use(express.json());  // Middleware to parse JSON bodies
app.use(cookieParser());  // Middleware to parse cookies

// CORS setup: Allow credentials and specify the frontend's origin
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true,  // Allow cookies to be sent with requests
  })
);

// MongoDB connection setup
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes); // Use the authentication routes

// Root route to confirm the server is running
app.get("/", (req, res) => {
  res.send("Welcome to the backend!");
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

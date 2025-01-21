const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
   email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  bio: {
    type: String,
    default: "",
  },
  profilePicture: {
    type: String,
    default: "default-profile.png",
  },
});

module.exports = mongoose.model("New", userSchema);
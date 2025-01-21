const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  bio: { type: String, default: "" },
  profilePicture: { type: String, default: "" },
});


module.exports = mongoose.model("New", userSchema);
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // Existing fields
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Profile fields
  age: { type: Number },
  degree: { type: String },
  major: { type: String },
  year: { type: String },
  college: { type: String },
  resume: { type: String }, // Resume URL or file link

  // Profile links
  github: { type: String },
  linkedin: { type: String },
  instagram: { type: String },
  leetcode: { type: String },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model("User", userSchema);

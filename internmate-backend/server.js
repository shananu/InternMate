//import dotenv from 'dotenv';
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("✅ InternMate Backend Running");
});

require("./models/User"); // Make sure this is above your routes

// Routes
const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected");
const dashboardRoutes = require("./routes/dashboard");
const plannerRoutes = require("./routes/planner");
const contestRoutes = require("./routes/contestRoutes");
const profileRoutes = require("./routes/profileRoutes");

app.use("/api/profile", profileRoutes); // Not /users
app.use("/api", contestRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/planner", plannerRoutes);
app.use("/uploads", express.static("uploads"));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT} & MongoDB connected`);
    });
  })
  .catch((err) => console.error("❌ DB Connection Error:", err));


// Catch unhandled errors
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection:", reason);
});

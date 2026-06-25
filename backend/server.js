const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const emergencyRoutes = require("./routes/emergencyRoutes");
const authRoutes = require("./routes/authRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const ambulanceRoutes = require("./routes/ambulanceRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

// Database Connect
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("🚑 SURAKSHA Backend Running Successfully");
});

// Routes
app.use("/api/emergency", emergencyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/ambulance", ambulanceRoutes);
app.use("/api/admin", adminRoutes);

// Server Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
});
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { connectDB } = require("./config/db");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const recordRoutes = require("./routes/records");
const qrRoutes = require("./routes/qr");
const doctorRoutes = require("./routes/doctor");
const auditRoutes = require("./routes/audit");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ success: true, message: "One-Record API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/audit", auditRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`One-Record backend listening on http://localhost:${PORT}`);
  });
});
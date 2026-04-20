const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const jobRoutes = require("./jobRoutes");
const applicationRoutes = require("./applicationRoutes");
const userRoutes = require("./userRoutes");
const adminRoutes = require('./adminRoutes');

// Route: /api/
router.use("/auth", authRoutes); 
router.use("/jobs", jobRoutes);
router.use("/applications", applicationRoutes); 
router.use("/users", userRoutes);
router.use("/admin",adminRoutes);

module.exports = router;
const express = require("express");
const router = express.Router();

// Import individual route files from your team
const authRoutes = require("./authRoutes");
const jobRoutes = require("./jobRoutes");
const applicationRoutes = require("./applicationRoutes");

// Define the namespaces
router.use("/auth", authRoutes);                // e.g., /api/auth/signup
router.use("/jobs", jobRoutes);                 // e.g., /api/jobs/all
router.use("/applications", applicationRoutes); // e.g., /api/applications/apply

module.exports = router;
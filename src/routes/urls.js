const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const jobRoutes = require("./jobRoutes");
const applicationRoutes = require("./applicationRoutes");
const userRoutes = require("./userRoutes");

// Mount the routes
router.use("/auth", authRoutes); 
router.use("/jobs", jobRoutes);
router.use("/applications", applicationRoutes); 
router.use("/users", userRoutes);

module.exports = router;
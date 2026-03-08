const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const jobRoutes = require("./jobRoutes");
const applicationRoutes = require("./applicationRoutes");

// Mount the routes
router.use("/auth", authRoutes); 
router.use("/jobs", jobRoutes);
router.use("/applications", applicationRoutes); 

module.exports = router;
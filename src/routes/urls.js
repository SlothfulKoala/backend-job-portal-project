const express = require("express");
const router = express.Router();


const authRoutes = require("./authRoutes");
const jobRoutes = require("./jobRoutes");
const applicationRoutes = require("./applicationRoutes");


router.use("/auth", authRoutes); 
router.use("/jobs", jobRoutes);
router.use("/applications", applicationRoutes); 

module.exports = router;
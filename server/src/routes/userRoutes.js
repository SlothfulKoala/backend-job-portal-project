const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { requireAuth } = require("../middlewares/auth");

// PATCH /api/users/profile
// Protect this route so only logged-in users can access it
router.patch("/profile", requireAuth, userController.updateProfile);

module.exports = router;
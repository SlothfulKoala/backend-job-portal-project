const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { requireAuth } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

// 1. "Me" Route MUST come before the ":id" route!
router.get("/me", requireAuth, userController.getMyProfile);

// 2. Profile Update Route
router.patch("/profile", requireAuth, upload.single('profilePic'), userController.updateProfile);

// 3. Public Profile Route (Requires login to view others' profiles)
router.get("/:id", requireAuth, userController.getUserProfile);

module.exports = router;
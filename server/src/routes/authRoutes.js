const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const upload = require('../middlewares/upload');

// POST /api/auth/signup
router.post('/signup', upload.single('profilePic'), authController.signup);
router.post('/login', authController.login);
router.post('/google', authController.googleAuth);

module.exports = router;
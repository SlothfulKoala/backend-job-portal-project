const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
// Assuming Member 1/2 created an auth middleware
const { requireAuth, isAdmin } = require('../middlewares/auth');

// Route: /api/admin/

// Apply protection: Only logged-in Admins should reach these
router.get('/users', requireAuth, isAdmin, adminController.getAllUsers);
router.get('/stats', requireAuth, isAdmin, adminController.getSystemStats);

module.exports = router;
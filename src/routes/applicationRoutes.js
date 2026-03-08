const express = require('express');
const applicationController = require('../controllers/applicationController');
const { requireAuth, authorizeRole } = require('../middlewares/auth');

const router = express.Router();

// Maps to: PATCH /api/applications/shortlist/:applicationId
router.patch('/shortlist/:applicationId', requireAuth, authorizeRole('employer'), applicationController.shortlistApplication);

module.exports = router;
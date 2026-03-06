const express = require('express');
const applicationController = require('../controllers/applicationController');
const { requireAuth } = require('../middlewares/auth'); 

const router = express.Router();

// Maps to: PATCH /api/applications/shortlist/:applicationId
router.patch('/shortlist/:applicationId', requireAuth, applicationController.shortlistApplication);

module.exports = router;
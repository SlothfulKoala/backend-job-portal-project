const express = require('express');
const applicationController = require('../controllers/applicationController');
const { requireAuth } = require('../middlewares/auth'); 

const router = express.Router();

// Maps to: PATCH /api/applications/shortlist
router.patch('/shortlist', requireAuth, applicationController.shortlistApplication);

module.exports = router;
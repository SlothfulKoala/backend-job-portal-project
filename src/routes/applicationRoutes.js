const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { requireAuth, authorizeRole } = require('../middlewares/auth');


// Maps to: PATCH /api/applications/shortlist/:applicationId
router.patch('/shortlist/:applicationId', requireAuth, authorizeRole('employer'), applicationController.shortlistApplication);
// Seeker route: Apply for a job
router.post('/apply/:jobId', requireAuth, authorizeRole('seeker'), applicationController.applyForJob);

module.exports = router;
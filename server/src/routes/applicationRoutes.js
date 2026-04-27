const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { requireAuth, authorizeRole } = require('../middlewares/auth');

// --- Employer Routes ---
router.patch('/shortlist/:applicationId', requireAuth, authorizeRole('employer'), applicationController.shortlistApplication);

// --- Seeker Routes ---
// 1. Apply for a job
router.post('/apply/:jobId', requireAuth, authorizeRole('seeker'), applicationController.applyForJob);

// 2. Just get IDs (Used for graying out buttons on Home page)
router.get('/applied-ids', requireAuth, authorizeRole('seeker'), applicationController.getMyAppliedJobIds);

// 3. Get full details (Used for the My Applications page)
router.get('/my-applications', requireAuth, authorizeRole('seeker'), applicationController.getSeekerApplications);

module.exports = router;
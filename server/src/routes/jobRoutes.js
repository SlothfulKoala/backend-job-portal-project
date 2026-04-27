const express = require('express');
const jobController = require('../controllers/jobController');
const { requireAuth, authorizeRole } = require('../middlewares/auth'); 
const router = express.Router();

// Get ALL jobs
router.get('/', jobController.getAllJobs); 

// Create a job 
router.post('/', requireAuth, authorizeRole('employer'), jobController.createJob); 

// Get specific employer's jobs 
router.get('/my-jobs', requireAuth, authorizeRole('employer'), jobController.getMyJobs); 

// Get all applicants for a specific job
router.get('/applicants/:jobId', requireAuth, authorizeRole('employer'), jobController.getJobApplicants);

// Update a specific job
router.patch('/:jobId', requireAuth, authorizeRole('employer'), jobController.updateJob);

// Delete a specific job
router.delete('/:jobId', requireAuth, authorizeRole('employer'), jobController.deleteJob);

module.exports = router;
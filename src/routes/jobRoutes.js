const express = require('express');
const jobController = require('../controllers/jobController');
const { requireAuth } = require('../middlewares/auth'); 

const router = express.Router();

// 1. Create a job 
router.post('/', requireAuth, jobController.createJob);           

// 2. Get ALL jobs (Public job board)
router.get('/', jobController.getAllJobs);                        

// 3. Get specific employer's jobs 
router.get('/my-jobs', requireAuth, jobController.getMyJobs);     

// 4. NEW: Get all applicants for a specific job
router.get('/applicants/:jobId', requireAuth, jobController.getJobApplicants);

// NEW: Delete a specific job
router.delete('/:jobId', requireAuth, jobController.deleteJob);

module.exports = router;
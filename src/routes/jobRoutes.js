const express = require('express');
const jobController = require('../controllers/jobController');
const { requireAuth } = require('../middlewares/auth'); 

const router = express.Router();

// The base path is already /api/jobs (handled by app.js and urls.js)
router.post('/', requireAuth, jobController.createJob);           // POST /api/jobs
router.get('/my-jobs', requireAuth, jobController.getMyJobs);     // GET /api/jobs/my-jobs

module.exports = router;
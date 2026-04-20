const { readData, writeData, generateId } = require('../utils/dataHandler');

const fs = require("fs");
const path = require("path"); // <-- This is the missing piece!

const getJobs = () => {
  const filePath = path.join(__dirname, "../../data/jobs.json");
  try {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (error) { return []; }
};

const getApplications = () => {
  const filePath = path.join(__dirname, "../../data/applications.json");
  try {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (error) { return []; }
};

const getUsers = () => {
  const filePath = path.join(__dirname, "../../data/users.json");
  try {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (error) { return []; }
};

// POST /jobs
exports.createJob = (req, res) => {
    try {
        const { 
            title, 
            type, 
            salary, 
            location, 
            category, 
            description, 
            requirements 
        } = req.body;
        
        // Assuming your auth middleware puts the logged-in user's ID here
        const postedBy = req.user.id; 

        // 1. Read existing jobs (notice we pass 'jobs', not 'jobs.json')
        const jobs = readData('jobs');

        // 2. Create the new job using your custom ID generator
        const newJob = {
            id: generateId('JOB'),
            title,
            type,
            salary,
            location,
            category,
            description,
            requirements,
            postedBy,
            postedAt: new Date().toISOString() // Automatically generates correct format
        };

        // 3. Save and respond
        jobs.push(newJob);
        writeData('jobs', jobs);

        res.status(201).json({ 
            message: 'Job created successfully', 
            job: newJob 
        });
    } catch (error) {
        console.error("Error creating job:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /jobs (Fetch all available jobs for applicants)
exports.getAllJobs = (req, res) => {
    try {
        const jobs = readData('jobs'); // Reads all jobs from jobs.json
        res.status(200).json({ jobs });
    } catch (error) {
        // Logs the error to your terminal so you can debug it
        console.error("Error fetching all jobs:", error);
        // Sends a safe 500 error back to the user/frontend
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /my-jobs
exports.getMyJobs = (req, res) => {
    try {
        const employerId = req.user.id;

        const jobs = readData('jobs');
        
        // Filter out jobs that don't belong to the logged-in employer
        const myJobs = jobs.filter(job => job.postedBy === employerId);

        res.status(200).json({ jobs: myJobs });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /:jobId/applicants
exports.getJobApplicants = (req, res) => {
  try {
    const { jobId } = req.params;
    const employerId = req.user.id; // From your Bouncer

    // Make sure you have your getJobs, getApplications, and getUsers helpers!
    const jobs = getJobs();
    const applications = getApplications();
    const users = getUsers(); // We need to read users.json to get the profiles!

    const job = jobs.find(j => j.id === jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Security Check
    if (job.postedBy !== employerId) {
      return res.status(403).json({ message: "Forbidden: You do not own this job." });
    }

    const jobApps = applications.filter(app => app.jobId === jobId);

    const applicantsData = jobApps.map(app => {
      const seeker = users.find(u => u.userId === app.seekerId);

      return {
        applicationId: app.id,
        status: app.status,
        appliedAt: app.appliedAt,
        coverLetterNotes: app.notes,
        // If we found the seeker, unpack their data. Otherwise, return {}
        applicantProfile: seeker ? {
          name: seeker.name,
          email: seeker.email,
          ...(seeker.profile || {}) // Attach the skills/resume if they exist
        } : {}
      };
    });

    res.json({
      jobTitle: job.title,
      totalApplicants: jobApps.length,
      applicants: applicantsData
    });

  } catch (error) {
    console.error("Get Applicants Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /jobs/:jobId (Delete a job posted by the employer)
exports.deleteJob = (req, res) => {
    try {
        const { jobId } = req.params;       // The ID from the URL
        const employerId = req.user.id;     // The logged-in employer

        const jobs = readData('jobs');
        
        // 1. Find the exact position (index) of the job in our array
        const jobIndex = jobs.findIndex(j => j.id === jobId);

        // 2. If it's not found, return a 404 error
        if (jobIndex === -1) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // 3. Security Check: Does this job actually belong to the person trying to delete it?
        if (jobs[jobIndex].postedBy !== employerId) {
            return res.status(403).json({ message: 'Unauthorized: You can only delete your own jobs' });
        }

        // 4. Remove the job from the array using splice
        jobs.splice(jobIndex, 1);

        // 5. Save the updated array back to jobs.json
        writeData('jobs', jobs);

        // Note: In a real database, you might also want to delete all applications 
        // linked to this job. For now, just deleting the job is perfect.

        res.status(200).json({ message: 'Job deleted successfully' });

    } catch (error) {
        console.error("Error deleting job:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
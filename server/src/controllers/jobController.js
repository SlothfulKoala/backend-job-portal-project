const Job = require('../models/job');
const Application = require('../models/application'); // Make sure you created this model earlier!
const User = require('../models/user');

// ================= POST /jobs =================
exports.createJob = async (req, res) => {
    try {
        const { 
            title, 
            type, 
            salary, 
            location, 
            companyName,   // ✅ Added from our recent update
            contactEmail,  // ✅ Added from our recent update
            skills, 
            description 
        } = req.body;
        
        const postedBy = req.user.id; // From your auth middleware

        // 1. Create the new job 
        const newJob = new Job({
            title,
            type,
            salary,
            location,
            companyName,
            contactEmail,
            skills,
            description,
            postedBy
        });

        // 2. Save directly to MongoDB
        await newJob.save();

        res.status(201).json({ 
            message: 'Job created successfully', 
            job: newJob 
        });
    } catch (error) {
        console.error("Error creating job:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// ================= GET /jobs (All Jobs for Seekers) =================
exports.getAllJobs = async (req, res) => {
    try {
        // Find all jobs, sort by newest first
        const jobs = await Job.find().sort({ createdAt: -1 }); 
        res.status(200).json({ jobs });
    } catch (error) {
        console.error("Error fetching all jobs:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// ================= GET /my-jobs =================
exports.getMyJobs = async (req, res) => {
    try {
        const employerId = req.user.id;
        
        // Find jobs where postedBy matches the logged-in employer
        const myJobs = await Job.find({ postedBy: employerId }).sort({ createdAt: -1 });

        res.status(200).json({ jobs: myJobs });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// ================= GET /:jobId/applicants =================
exports.getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;
    const employerId = req.user.id;

    // 1. Check if job exists and belongs to employer
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Convert ObjectId to string for comparison
    if (job.postedBy.toString() !== employerId) {
      return res.status(403).json({ message: "Forbidden: You do not own this job." });
    }

    // 2. Fetch applications AND "populate" the seeker data automatically!
    // This replaces having to manually read users.json and match IDs.
    const applications = await Application.find({ jobId })
      .populate('seekerId', 'name email profilePic profile'); // Grab specific fields from User

    // 3. Format the data for the frontend
    const applicantsData = applications.map(app => {
      const seeker = app.seekerId; // This is now a full user object thanks to .populate()

      return {
        applicationId: app._id,
        status: app.status,
        appliedAt: app.appliedAt,
        coverLetterNotes: app.notes,
        applicantProfile: seeker ? {
          name: seeker.name,
          email: seeker.email,
          profilePic: seeker.profilePic,
          ...(seeker.profile || {}) // Spreads resume, skills, bio if they exist
        } : {}
      };
    });

    res.json({
      jobTitle: job.title,
      totalApplicants: applications.length,
      applicants: applicantsData
    });

  } catch (error) {
    console.error("Get Applicants Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ================= DELETE /jobs/:jobId =================
exports.deleteJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const employerId = req.user.id;

        // 1. Find the job
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // 2. Security Check
        if (job.postedBy.toString() !== employerId) {
            return res.status(403).json({ message: 'Unauthorized: You can only delete your own jobs' });
        }

        // 3. Delete the job
        await job.deleteOne();

        // Bonus: Automatically clean up any applications that were attached to this deleted job
        await Application.deleteMany({ jobId });

        res.status(200).json({ message: 'Job deleted successfully' });

    } catch (error) {
        console.error("Error deleting job:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
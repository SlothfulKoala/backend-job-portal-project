const Job = require('../models/job'); // Ensure this matches your filename
const Application = require('../models/application'); 
const User = require('../models/User');

// ================= POST /jobs =================
exports.createJob = async (req, res) => {
    try {
        const { title, type, salary, location, companyName, contactEmail, skills, description } = req.body;
        const postedBy = req.user.id; 

        const newJob = new Job({
            title, type, salary, location, companyName, contactEmail, skills, description, postedBy
        });

        await newJob.save();
        res.status(201).json({ message: 'Job created successfully', job: newJob });
    } catch (error) {
        console.error("Error creating job:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// ================= GET /jobs (All Jobs for Seekers) =================
exports.getAllJobs = async (req, res) => {
    try {
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
        const myJobs = await Job.find({ postedBy: employerId }).sort({ createdAt: -1 });
        res.status(200).json({ jobs: myJobs });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// ================= GET /applicants/:jobId =================
exports.getJobApplicants = async (req, res) => {
    try {
      const { jobId } = req.params;
      const employerId = req.user.id;
  
      const job = await Job.findById(jobId);
      if (!job) return res.status(404).json({ message: "Job not found" });
  
      if (job.postedBy.toString() !== employerId) {
        return res.status(403).json({ message: "Forbidden: You do not own this job." });
      }
  
      const applications = await Application.find({ jobId }).populate('seekerId', 'name email profilePic profile'); 
  
      const applicantsData = applications.map(app => ({
          applicationId: app._id,
          status: app.status,
          createdAt: app.createdAt, 
          coverLetterNotes: app.notes,
          applicantProfile: app.seekerId ? {
            name: app.seekerId.name,
            email: app.seekerId.email,
            profilePic: app.seekerId.profilePic,
            ...(app.seekerId.profile || {})
          } : {}
      }));
  
      res.json({ jobTitle: job.title, totalApplicants: applications.length, applicants: applicantsData });
    } catch (error) {
      console.error("Get Applicants Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
};

// ================= PATCH /jobs/:jobId (UPDATE) =================
exports.updateJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const employerId = req.user.id;

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        // Security check
        if (job.postedBy.toString() !== employerId) {
            return res.status(403).json({ message: 'Unauthorized: You can only edit your own jobs' });
        }

        // Update with new data from req.body
        const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, { new: true });

        res.status(200).json({ message: 'Job updated successfully', job: updatedJob });
    } catch (error) {
        console.error("Error updating job:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// ================= DELETE /jobs/:jobId =================
exports.deleteJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const employerId = req.user.id;

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        if (job.postedBy.toString() !== employerId) {
            return res.status(403).json({ message: 'Unauthorized: You can only delete your own jobs' });
        }

        await Job.findByIdAndDelete(jobId);
        await Application.deleteMany({ jobId });

        res.status(200).json({ message: 'Job and its applications deleted successfully' });
    } catch (error) {
        console.error("Error deleting job:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
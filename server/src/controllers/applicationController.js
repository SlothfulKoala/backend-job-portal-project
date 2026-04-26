const Application = require('../models/application');
const Job = require('../models/job');

// ================= POST /apply/:jobId =================
exports.applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params; 
    const { notes } = req.body;   
    const seekerId = req.user.id; // From requireAuth middleware

    if (!jobId) {
      return res.status(400).json({ message: "jobId is required to apply." });
    }

    // 1. Check if the job actually exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found. It may have been deleted." });
    }

    // 2. Prevent duplicate applications
    const alreadyApplied = await Application.findOne({ 
      jobId: jobId, 
      seekerId: seekerId 
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: "You have already applied for this job." });
    }

    // 3. Create the application in MongoDB
    const newApplication = new Application({
      jobId,
      seekerId,
      notes: notes || "",
      // Note: 'status' defaults to 'pending' via your schema
      // 'createdAt' and 'updatedAt' are handled automatically by Mongoose timestamps!
    });

    await newApplication.save();

    res.status(201).json({
      message: "Application submitted successfully",
      application: newApplication
    });

  } catch (error) {
    console.error("Apply Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ================= PATCH /shortlist/:applicationId =================
exports.shortlistApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const employerId = req.user.id; // From the Bouncer middleware

    // 1. Find the application and magically pull in the linked Job data
    const application = await Application.findById(applicationId).populate('jobId');
    
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    // 2. Security Check: Does this employer actually own the job?
    // Because we used .populate('jobId'), application.jobId is now the full job object!
    if (!application.jobId || application.jobId.postedBy.toString() !== employerId) {
      return res.status(403).json({ 
        message: "Forbidden: You can only shortlist applicants for your own jobs." 
      });
    }

    // 3. Update the status
    // *Important Note*: In our schema, we set the allowed statuses to: 
    // ['pending', 'reviewed', 'interviewing', 'accepted', 'rejected']
    // So we will use 'reviewed' here instead of 'shortlisted' to match the database rules.
    application.status = "reviewed"; 
    
    await application.save();

    res.json({
      message: "Application successfully reviewed!",
      application
    });

  } catch (error) {
    console.error("Shortlist Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/applications/my-applications
exports.getMyAppliedJobIds = async (req, res) => {
    try {
        const seekerId = req.user.id;
        
        // Find all applications by this seeker, but only return the jobId field
        const applications = await Application.find({ seekerId }).select('jobId');
        
        // Extract just the IDs into a flat array: ["ID1", "ID2", ...]
        const appliedJobIds = applications.map(app => app.jobId.toString());

        res.status(200).json(appliedJobIds);
    } catch (error) {
        res.status(500).json({ message: "Error fetching application status" });
    }
};

// GET /api/applications/my-applications
exports.getSeekerApplications = async (req, res) => {
  try {
    const seekerId = req.user.id;

    // Find applications and pull in the Job details
    const applications = await Application.find({ seekerId })
      .populate('jobId', 'title companyName location')
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching seeker applications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
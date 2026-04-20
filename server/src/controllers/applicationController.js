const fs = require("fs");
const path = require("path");

const applicationsFile = path.join(__dirname, "../../data/applications.json");

// Helper to safely read applications
const getApplications = () => {
  try {
    if (!fs.existsSync(applicationsFile)) return [];
    const data = fs.readFileSync(applicationsFile, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

const saveApplications = (apps) => {
  fs.writeFileSync(applicationsFile, JSON.stringify(apps, null, 2));
};

// POST /apply
exports.applyForJob = (req, res) => {
  try {
    const { jobId } = req.params; 
    const { notes } = req.body;   
    
    const seekerId = req.user.id;

    if (!jobId) {
      return res.status(400).json({ message: "jobId is required to apply." });
    }

    const applications = getApplications();

    // Prevent duplicate applications
    const alreadyApplied = applications.find(
        app => app.jobId === jobId && app.seekerId === seekerId
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: "You have already applied for this job." });
    }

    // Create the exact format you requested
    const newApplication = {
      id: "APP-" + Date.now(),
      jobId,
      seekerId,
      status: "pending",
      appliedAt: new Date().toISOString(),
      notes: notes || ""
    };

    applications.push(newApplication);
    saveApplications(applications);

    res.status(201).json({
      message: "Application submitted successfully",
      application: newApplication
    });

  } catch (error) {
    console.error("Apply Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const jobsFile = path.join(__dirname, "../../data/jobs.json");
const getJobs = () => {
  try {
    if (!fs.existsSync(jobsFile)) return [];
    const data = fs.readFileSync(jobsFile, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

// PATCH /shortlist/:applicationId (Employer Only)
exports.shortlistApplication = (req, res) => {
  try {
    const { applicationId } = req.params;
    const employerId = req.user.id; // From the Bouncer

    const applications = getApplications();
    const jobs = getJobs();

    // 1. Find the specific application
    const appIndex = applications.findIndex(app => app.id === applicationId);
    if (appIndex === -1) {
      return res.status(404).json({ message: "Application not found." });
    }

    const application = applications[appIndex];

    // 2. Find the job this application belongs to
    const job = jobs.find(j => j.id === application.jobId);
    if (!job) {
      return res.status(404).json({ message: "The job for this application no longer exists." });
    }

    // 3. Security Check: Does this employer actually own this job?
    if (job.postedBy !== employerId) {
      return res.status(403).json({ 
        message: "Forbidden: You can only shortlist applicants for your own jobs." 
      });
    }

    // 4. Update the status
    applications[appIndex].status = "shortlisted";
    saveApplications(applications);

    res.json({
      message: "Application successfully shortlisted!",
      application: applications[appIndex]
    });

  } catch (error) {
    console.error("Shortlist Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
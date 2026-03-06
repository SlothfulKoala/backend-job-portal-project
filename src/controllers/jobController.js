const { readData, writeData, generateId } = require('../utils/dataHandler');

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
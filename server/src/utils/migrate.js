require('dotenv').config(); // Ensure your DB URI is loaded
const mongoose = require('mongoose');
const { readData } = require('./dataHandler');

// Import your brand new Mongoose models
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

const migrateData = async () => {
    try {
        // 1. Connect to MongoDB locally
        console.log('⏳ Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careervista');
        console.log('✅ Connected to MongoDB.');

        // 2. Clear out any existing database collections to prevent duplicates
        console.log('🧹 Wiping existing database collections...');
        await User.deleteMany();
        await Job.deleteMany();
        await Application.deleteMany();

        // 3. Read the old JSON data
        const oldUsers = readData('users');
        const oldJobs = readData('jobs');
        const oldApps = readData('applications');

        // 🧠 THE ID MAP: This dictionary translates old string IDs to new Mongoose ObjectIds
        const idMap = {};

        // --- STEP 1: MIGRATE USERS ---
        console.log(`🚀 Migrating ${oldUsers.length} Users...`);
        for (const user of oldUsers) {
            // Create a new Mongoose user instance
            const newUser = new User({
                name: user.name,
                email: user.email,
                password: user.password, // Assume it's already hashed from your old authController
                role: user.role,
                profilePic: user.profilePic || "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
                profile: user.profile || { bio: '', resume: '', skills: [] },
                companyDetails: user.companyDetails || { companyName: '', website: '', description: '' }
            });

            const savedUser = await newUser.save();
            
            // Save the mapping: 'USER-123' -> ObjectId('64b...')
            idMap[user.userId] = savedUser._id;
        }

        // --- STEP 2: MIGRATE JOBS ---
        console.log(`🚀 Migrating ${oldJobs.length} Jobs...`);
        for (const job of oldJobs) {
            const newJob = new Job({
                title: job.title,
                type: job.type || 'full-time', 
                category: job.category || 'Uncategorized',
                description: job.description,
                company: job.company || 'Unknown Company', // Fallback if missing
                location: job.location,
                salary: job.salary,
                // MAP THE EMPLOYER ID!
                postedBy: idMap[job.postedBy] 
            });

            const savedJob = await newJob.save();
            
            // Save the mapping: 'JOB-456' -> ObjectId('64c...')
            idMap[job.id] = savedJob._id;
        }

        // --- STEP 3: MIGRATE APPLICATIONS ---
        console.log(`🚀 Migrating ${oldApps.length} Applications...`);
        for (const app of oldApps) {
            // Only migrate if both the job and the seeker actually existed in the mapping
            if (idMap[app.jobId] && idMap[app.seekerId]) {
                const newApp = new Application({
                    job: idMap[app.jobId],
                    applicant: idMap[app.seekerId],
                    status: app.status,
                    notes: app.notes || ''
                });

                await newApp.save();
            } else {
                console.warn(`⚠️ Skipped orphaned application: ${app.id}`);
            }
        }

        console.log('🎉 Database migration complete! All IDs successfully translated.');
        process.exit(0); // Exit successfully

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1); // Exit with failure
    }
};

// Execute the function
migrateData();
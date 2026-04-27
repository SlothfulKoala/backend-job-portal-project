const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    // Links directly to the Job document
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    // Links directly to the User (Seeker) document
    seekerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Restricts the status to these specific words
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'interviewing', 'accepted', 'rejected'],
        default: 'pending'
    },
    // The cover letter or extra notes
    notes: {
        type: String,
        default: ""
    }
}, { 
    // Automatically adds `createdAt` and `updatedAt`
    timestamps: true 
});

// Make sure the export name matches exactly what your controller is looking for!
module.exports = mongoose.model('Application', applicationSchema);
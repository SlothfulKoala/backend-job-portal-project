const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    // Replaces the old string "jobId"
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    // Replaces the old string "seekerId"
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
    default: 'pending'
  },
  notes: {
    // What the applicant wrote to stand out
    type: String,
    default: ''
  }
}, { 
  timestamps: true // Automatically handles your old "appliedAt" logic
});

// Compound index to prevent a user from applying to the same job twice
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
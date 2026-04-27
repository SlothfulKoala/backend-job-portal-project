const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  // 1. Core Job Details
  title: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    required: true 
  }, // e.g., Full-time, Internship
  salary: { 
    type: String, 
    required: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  
  // 2. The dynamic fields we added for the Employer context
  companyName: { 
    type: String, 
    required: true 
  },
  contactEmail: { 
    type: String, 
    required: true 
  },

  // 3. Skills Array (Automatically parsed by your frontend!)
  skills: [{ 
    type: String 
  }], 
  
  // 4. Relational Data: Links this job permanently to the Employer
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

}, { 
  // Automatically adds `createdAt` and `updatedAt` timestamps
  timestamps: true 
});

module.exports = mongoose.model('Job', jobSchema);
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  // 1. Core Job Details
  title: { 
    type: String, 
    required: true,
    trim: true // Kept from your branch to prevent accidental spacing issues
  },
  type: { 
    type: String, 
    // ✅ Capitalized to match your React dropdowns!
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
    required: true
  },
  category: { 
    type: String, 
    required: true // Kept from your branch for categorization
  },
  location: { 
    type: String, 
    required: true 
  },
  salary: { 
    // Using String (from main) instead of your Number. 
    // This prevents crashes if your teammate's frontend sends ranges like "50,000 - 60,000"
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  
  // 2. Employer Context
  companyName: { 
    // Unified your "company" and their "companyName" into one field
    // to match what their frontend is likely expecting
    type: String, 
    required: true 
  },
  contactEmail: { 
    type: String, 
    required: true // Added by main
  },

  // 3. Skills Array
  skills: [{ 
    type: String // Added by main
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

// ✅ Change the bottom line to this:
module.exports = mongoose.models.Job || mongoose.model('Job', jobSchema);
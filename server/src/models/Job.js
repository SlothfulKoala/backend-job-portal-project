const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  type: { 
    type: String, 
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  company: { 
    type: String, 
    required: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  salary: { 
    type: Number, 
    required: true 
  },
  postedBy: { 
    // The true Mongoose relational link to the Employer
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { 
  timestamps: true // Automatically handles your old "postedAt" logic
});

module.exports = mongoose.model('Job', jobSchema);
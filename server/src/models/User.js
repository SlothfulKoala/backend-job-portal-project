const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Optional for Google Auth
  googleId: { type: String, required: false },
  role: { type: String, enum: ['seeker', 'employer'], required: true },
  profilePic: { type: String },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  
  // Flexible Links Array for both Seeker (GitHub/LeetCode) and Employer (Twitter/LinkedIn)
  links: [{
    name: { type: String, required: true }, // e.g., "GitHub"
    url: { type: String, required: true }   // e.g., "https://github.com/aditya"
  }],

  // Seeker specific profile
  profile: {
    resume: { type: String, default: '' },
    skills: [{ type: String }],
    bio: { type: String, default: '' }
  },

  // Employer specific profile
  companyDetails: {
    companyName: { type: String, default: '' },
    website: { type: String, default: '' },
    description: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
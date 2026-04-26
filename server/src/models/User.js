const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // false for Google Auth
  googleId: { type: String, required: false },
  role: { type: String, enum: ['seeker', 'employer'], required: true },
  profilePic: {
    type: String,
  },
  
  // 1. Add the seeker profile object
  profile: {
    resume: { type: String, default: '' },
    skills: [{ type: String }],
    bio: { type: String, default: '' }
  },

  // 2. Change companyDetails from String to an Object
  companyDetails: {
    companyName: { type: String, default: '' },
    website: { type: String, default: '' },
    description: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
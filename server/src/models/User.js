const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // Not required because Google login users won't have a password
    required: false, 
  },
  googleId: {
    type: String,
    // Stores the ID from Google to link accounts
    required: false,
  },
  role: {
    type: String,
    enum: ['seeker', 'employer'],
    required: true,
  },
  profilePic: {
    type: String,
    // This will hold either the Cloudinary URL or the Google Profile Pic URL
    default: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg' // You can replace this with a default avatar link
  },
  companyDetails: {
    type: String,
    required: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
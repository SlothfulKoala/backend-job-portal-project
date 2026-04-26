const User = require('../models/User');

// --- 1. Get Logged In User's Profile (For AuthContext) ---
exports.getMyProfile = async (req, res) => {
  try {
    // req.user._id is provided by the requireAuth middleware
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // AuthContext expects the raw user object
    res.status(200).json(user); 
  } catch (error) {
    console.error("Get My Profile Error:", error);
    res.status(500).json({ message: "Internal server error fetching profile" });
  }
};

// --- 2. Get Any User's Public Profile (By ID) ---
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error("Get Public Profile Error:", error);
    // If Mongoose fails to cast a weird string to an ObjectId, return 404
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({ message: "Internal server error fetching user" });
  }
};

// --- 3. Profile Update Route (Your existing code untouched) ---
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; 
    const updates = req.body;

    if (req.files) {
      if (req.files.profilePic) {
        updates.profilePic = req.files.profilePic[0].path;
      }
      if (req.files.resume) {
        updates['profile.resume'] = req.files.resume[0].path;
      }
    }

    if (typeof updates.links === 'string') {
      updates.links = JSON.parse(updates.links);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password'); // Good practice: strip password on update return too!

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
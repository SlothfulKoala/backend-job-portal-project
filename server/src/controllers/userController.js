const User = require('../models/User');

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Set by your auth middleware
    const updates = req.body;

    // 1. Handle File Uploads from Cloudinary
    if (req.files) {
      if (req.files.profilePic) {
        updates.profilePic = req.files.profilePic[0].path;
      }
      if (req.files.resume) {
        // Nested update for the seeker profile
        updates['profile.resume'] = req.files.resume[0].path;
      }
    }

    // 2. Parse Links (FormData sends arrays as strings or individual items)
    if (typeof updates.links === 'string') {
      updates.links = JSON.parse(updates.links);
    }

    // 3. Update User in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

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
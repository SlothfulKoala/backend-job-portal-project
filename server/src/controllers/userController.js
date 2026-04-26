const User = require('../models/user'); // Make sure the path matches your structure

// PATCH /api/user/profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;   // Extracted from the validated JWT
    const role = req.user.role;   // Extracted from the validated JWT
    const updates = req.body;     // The partial data sent in Thunder Client

    // 1. Find user directly in MongoDB
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (req.file && req.file.path) {
        user.profilePic = req.file.path; // Update the image URL
    }

    // 2. Update basic shared fields
    if (updates.name) user.name = updates.name;
    if (updates.email) user.email = updates.email;

    // 3. Seeker-specific updates (Merges old profile data with new updates)
    if (role === "seeker" && updates.profile) {
      user.profile = { 
        ...user.profile, 
        ...updates.profile 
      };
    }

    // 4. Employer-specific updates (Merges old company data with new updates)
    if (role === "employer" && updates.companyDetails) {
      user.companyDetails = { 
        ...user.companyDetails, 
        ...updates.companyDetails 
      };
    }

    // 5. Save the updated user back to MongoDB
    await user.save();

    // 6. Strip the hashed password before sending the response
    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({
      message: "Profile updated successfully",
      user: safeUser
    });

  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/user/me
// Purpose: Fetch the currently logged-in user's data
exports.getMyProfile = async (req, res) => {
  try {
    // req.user.id comes from your JWT Auth Middleware
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get My Profile Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// GET /api/user/:id
// Purpose: Fetch ANY user's profile by their MongoDB ID
exports.getUserProfile = async (req, res) => {
  try {
    // req.params.id comes from the URL (e.g., /api/user/65b2a1c...)
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    // If the ID is completely invalid/malformed, Mongoose throws a specific error
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: "User not found" });
    }
    console.error("Get User Profile Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
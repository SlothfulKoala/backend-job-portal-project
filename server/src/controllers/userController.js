const fs = require("fs");
const path = require("path");

const usersFile = path.join(__dirname, "../../data/users.json");

const getUsers = () => {
  try {
    if (!fs.existsSync(usersFile)) return [];
    const data = fs.readFileSync(usersFile, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

const saveUsers = (users) => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

// PATCH /profile
exports.updateProfile = (req, res) => {
  try {
    const userId = req.user.id;   // Extracted from the validated JWT
    const role = req.user.role;   // Extracted from the validated JWT
    const updates = req.body;     // The partial data sent in Thunder Client

    const users = getUsers();
    const userIndex = users.findIndex(u => u.userId === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found." });
    }

    let user = users[userIndex];

    // 1. Update basic shared fields
    if (updates.name) user.name = updates.name;
    if (updates.email) user.email = updates.email;

    // 2. Seeker-specific updates (Merges old profile data with new updates)
    if (role === "seeker" && updates.profile) {
      user.profile = { 
        ...user.profile, 
        ...updates.profile 
      };
    }

    // 3. Employer-specific updates (Merges old company data with new updates)
    if (role === "employer" && updates.companyDetails) {
      user.companyDetails = { 
        ...user.companyDetails, 
        ...updates.companyDetails 
      };
    }

    // 4. Save the updated user back to the array
    users[userIndex] = user;
    saveUsers(users);

    // 5. Strip the hashed password before sending the response
    const { password, ...safeUser } = user;

    res.json({
      message: "Profile updated successfully",
      user: safeUser
    });

  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
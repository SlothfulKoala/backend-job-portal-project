require('dotenv').config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// ================= SIGNUP =================
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, profile, companyDetails } = req.body;

    // 1. Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 2. Dynamic Avatar Logic
    // We default to initials, but allow Cloudinary or Google to overwrite it
    let finalProfilePic = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff&bold=true`;

    if (req.file && req.file.path) {
      finalProfilePic = req.file.path; 
    } else if (req.body.googlePictureUrl) {
      finalProfilePic = req.body.googlePictureUrl;
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create User
    // Using spread properties makes the conditional role-data much cleaner
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      profilePic: finalProfilePic,
      ...(role === "seeker" && { profile }),
      ...(role === "employer" && { companyDetails })
    });

    // 5. Security: Convert to object and strip the password before responding
    const safeUser = newUser.toObject();
    delete safeUser.password;
    
    // 6. Generate JWT
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role }, 
      process.env.JWT_SECRET || "BEE@JPP", 
      { expiresIn: "1h" }
    );
    
    res.status(201).json({
      message: "Account created successfully",
      token,
      user: safeUser
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Verify Password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Security: Strip the password
    const safeUser = user.toObject();
    delete safeUser.password;

    // 4. Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || "BEE@JPP", 
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: safeUser 
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
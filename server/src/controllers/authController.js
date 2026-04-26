const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 🚀 1. Mongoose Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, profile, companyDetails } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check MongoDB for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the new user in MongoDB
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      profilePic: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      // Safely attach role-specific data if provided during standard signup
      ...(role === "seeker" && profile ? { profile } : {}),
      ...(role === "employer" && companyDetails ? { companyDetails } : {})
    });

    // Generate JWT using the fresh Mongoose _id
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    // Strip password before sending to frontend
    const safeUser = newUser.toObject();
    delete safeUser.password;

    res.status(201).json({
      message: "Signup and login successful",
      token,
      user: safeUser
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 🚀 2. Mongoose Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find the user in MongoDB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT with the correct Mongoose _id
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || "BEE@JPP", 
      { expiresIn: "1h" }
    );

    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(200).json({
      message: "Login successful",
      token,
      user: safeUser
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
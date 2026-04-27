const User = require('../models/User'); // Ensure the casing matches your file name!
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ================= SIGNUP =================
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, profile, companyDetails } = req.body;

    // 1. Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check MongoDB for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 3. Dynamic Avatar Logic (Keeping Member 1's nice UI-Avatar fallback)
    let finalProfilePic = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff&bold=true`;

    if (req.file && req.file.path) {
      finalProfilePic = req.file.path; 
    } else if (req.body.googlePictureUrl) {
      finalProfilePic = req.body.googlePictureUrl;
    }

    // 4. Security: Hash Password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 5. Create User in MongoDB
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      profilePic: finalProfilePic,
      ...(role === "seeker" && profile ? { profile } : {}),
      ...(role === "employer" && companyDetails ? { companyDetails } : {})
    });

    // 6. Generate JWT using the fresh Mongoose _id
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role }, 
      process.env.JWT_SECRET || "BEE@JPP", 
      { expiresIn: "1h" }
    );

    // 7. Security: Strip password before sending to frontend
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

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 1. Find the user in MongoDB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Security: Strip password
    const safeUser = user.toObject();
    delete safeUser.password;

    // 4. Generate JWT with the correct Mongoose _id
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || "BEE@JPP", 
      { expiresIn: "1h" }
    );

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

exports.googleAuth = async (req, res) => {
  try {
    const { token, role } = req.body; // Frontend sends the Google token and chosen role

    // 1. Verify the Google Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "4769970276-vcl5qe8l07j75odehsefva53vctol33e.apps.googleusercontent.com", 
    });
    
    const { name, email, picture } = ticket.getPayload();

    // 2. Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // 3. If they don't exist, create a new account
      user = new User({
        name,
        email,
        profilePic: picture,
        role: role || 'seeker', // Default to seeker if none provided
        // Note: Google accounts don't use passwords in your DB
      });
      await user.save();
    }

    // 4. Generate your app's JWT token
    const jwtToken = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, // Make sure you have this in your .env
      { expiresIn: '1d' }
    );

    res.status(200).json({ token: jwtToken, user, message: "Google Login Successful" });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: "Failed to authenticate with Google" });
  }
};
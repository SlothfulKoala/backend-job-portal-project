// Keep imports consistent with your backend (using require)
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // <-- Don't forget to import your model!

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Assuming this is exported or attached to your router
exports.googleAuth = async (req, res) => {
  try {
    // 1. Extract both token AND role from Member 1's frontend
    const { token, role } = req.body; 

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const userData = {
      name: payload.name,
      email: payload.email,
      googleId: payload.sub, // <-- 2. Save Google's Unique ID
      role: role || 'seeker', // <-- 3. Pass the role so Mongoose validation passes!
      
      // PRIORITY LOGIC: Google Picture -> Global Default
      profilePic: payload.picture || "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    };

    // Upsert the user into the database
    const user = await User.findOneAndUpdate(
      { email: userData.email },
      { $setOnInsert: userData }, // Only set these if creating a NEW user
      { upsert: true, new: true, runValidators: true } // runValidators ensures the role enum is checked
    );

    // 4. Generate the JWT so AuthContext works
    const jwtToken = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || "BEE@JPP", 
      { expiresIn: "1h" }
    );

    // 5. Return the exact structure Member 1's AuthContext expects
    res.status(200).json({
      message: "Google auth successful",
      token: jwtToken,
      user: user
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ error: "Google auth failed" });
  }
};
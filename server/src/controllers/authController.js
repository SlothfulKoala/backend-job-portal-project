const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const filePath = path.join(__dirname, "../../data/users.json");

const getUsers = () => {
  try {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

const saveUsers = (users) => {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
};

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, profile, companyDetails } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const users = getUsers();
    const existingUser = users.find(u => u.email === email || u.name === name);

    if (existingUser) {
      return res.status(400).json({ message: "Name or Email already registered" });
    }

    // Restored to userId!
    const userId = "USER-" + Date.now();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { 
        userId, 
        name, 
        email, 
        password: hashedPassword, 
        role 
    };

    // Attach the extra data based on role
    if (role === "seeker" && profile) {
        newUser.profile = profile;
    } else if (role === "employer" && companyDetails) {
        newUser.companyDetails = companyDetails;
    }

    users.push(newUser);
    saveUsers(users);

    const { password: _, ...safeUser } = newUser;
    // 1. Generate the token exactly like you do in login
    const token = jwt.sign(
        { id: newUser.userId, role: newUser.role }, 
        "BEE@JPP",
        { expiresIn: "1h" }
    );
    // 2. Send the token back along with the success message
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

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // We keep 'id' here so your existing middleware (req.user.id) doesn't break
    const token = jwt.sign(
      { id: user.userId, role: user.role }, 
      "BEE@JPP", 
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { 
          userId: user.userId, // Restored to userId
          name: user.name, 
          email: user.email, 
          role: user.role,
          ...(user.profile && { profile: user.profile }),
          ...(user.companyDetails && { companyDetails: user.companyDetails })
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
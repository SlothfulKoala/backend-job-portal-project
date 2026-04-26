const jwt = require("jsonwebtoken");
const User = require("../models/User"); // We need the model to verify existence

exports.requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const token = authHeader.split(" ")[1];

        // 1. Use the same secret key used in authController
        // TIP: Moving this to process.env.JWT_SECRET is safer!
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 2. Fetch the user from MongoDB to ensure they actually exist
        // We map 'id' from the token to '_id' in MongoDB
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User no longer exists." });
        }

        // 3. Attach the REAL Mongoose user object to the request
        req.user = user;

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

// (Keep authorizeRole and isAdmin as they are, they will work fine now!)
exports.authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: "Forbidden: You do not have permission." 
            });
        }
        next();
    };
};

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Access denied: Admins permissions required" });
    }
};
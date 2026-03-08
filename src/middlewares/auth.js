const jwt = require("jsonwebtoken");

exports.requireAuth = (req, res, next) => {
    try {
        // 1. Look for the "Authorization" header
        const authHeader = req.headers.authorization;

        // 2. Check if it exists and starts with "Bearer "
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        // 3. Extract the actual token string (ignoring the word "Bearer ")
        const token = authHeader.split(" ")[1];

        // 4. Verify the token using your secret key
        const decoded = jwt.verify(token, "BEE@JPP");

        // 5. Attach the decoded payload { id, role } to the request!
        req.user = decoded;

        // 6. Let them through to the controller
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

//Checks if the logged-in user has the right role
exports.authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        // req.user was attached by the requireAuth middleware just before this
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: "Forbidden: You do not have permission to perform this action." 
            });
        }
        // If their role matches (e.g., they are an "employer"), let them through!
        next();
    };
    next(); 
};

// ensures that the user making the request is an admin
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // User is admin, let them through
    } else {
        res.status(403).json({ message: "Access denied: Admins permissions required" });
    }
};
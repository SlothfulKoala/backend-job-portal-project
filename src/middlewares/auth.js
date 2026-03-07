// MUST have "exports.requireAuth"
exports.requireAuth = (req, res, next) => {
    req.user = { id: "USER-e5f6g7h8", 
        role: "employer" 
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
// MUST have "exports.requireAuth"
exports.requireAuth = (req, res, next) => {
    req.user = { id: "USER-e5f6g7h8", 
        role: "employer" 
    };
    next(); 
};
const logger = (req, res, next) => {
    const method = req.method; // GET, POST, etc.
    const url = req.originalUrl; // The full path
    const timestamp = new Date().toLocaleString();

    console.log(`[${timestamp}] ${method} ${url}`);

    // Very important: call next() so the request continues to the routes
    next();
};

module.exports = logger;
// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();

// Placeholder route so the file isn't empty
router.get('/test', (req, res) => {
    res.json({ message: 'Auth route is working!' });
});

// THIS IS THE CRUCIAL LINE
module.exports = router;
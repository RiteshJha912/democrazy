const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');

// Get all polls
router.get('/', async (req, res) => {
    try {
        const polls = await Poll.find().sort({ createdAt: -1 });
        res.json(polls);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

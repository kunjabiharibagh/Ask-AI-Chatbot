const express = require('express');
const router = express.Router();
const Conversation = require('../model/Conversation');
const protect = require('../middleware/authMiddleware');

// CREATE a conversation (only logged-in users)
router.post('/', protect, async (req, res) => {
    try {
        const { title } = req.body;
        const conversation = await Conversation.create({ userId: req.userId, title });
        res.status(201).json(conversation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET only the logged-in user's conversations
router.get('/', protect, async (req, res) => {
    try {
        const conversations = await Conversation.find({ userId: req.userId });
        res.json(conversations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

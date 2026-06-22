const express = require('express');
const router = express.Router();
const axios = require('axios');
const Message = require('../model/Message');
const protect = require('../middleware/authMiddleware');

// CREATE a message + get bot reply
router.post('/', protect, async (req, res) => {
    try {
        const { conversation, text } = req.body;

        // 1. Save the user's message
        const userMessage = await Message.create({ conversation, sender: 'user', text });

        // 2. Call the Python ML service
        const mlResponse = await axios.post(process.env.ML_SERVICE_URL ||'http://localhost:8000/predict', { text });
        const botReply = mlResponse.data.reply;

        // 3. Save the bot's reply
        const botMessage = await Message.create({ conversation, sender: 'bot', text: botReply });

        res.status(201).json({ userMessage, botMessage });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all messages for one conversation
router.get('/:conversationId', protect, async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await Message.find({ conversation: conversationId }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
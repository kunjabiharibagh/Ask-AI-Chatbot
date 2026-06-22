const express = require('express');
const router = express.Router();
const axios = require('axios');
const Message = require('../model/Message');
const protect = require('../middleware/authMiddleware');

// CREATE a message + get bot reply
router.post('/', protect, async (req, res) => {
    try {
        const { conversation, text } = req.body;

        const userMessage = await Message.create({ conversation, sender: 'user', text });

        // Add this to debug
        console.log('Calling ML service:', process.env.ML_SERVICE_URL);
        console.log('Sending text:', text);

        const mlResponse = await axios.post(process.env.ML_SERVICE_URL || 'http://localhost:8000/predict', { text });
        
        console.log('ML Response:', mlResponse.data);
        
        const botReply = mlResponse.data.reply;

        const botMessage = await Message.create({ conversation, sender: 'bot', text: botReply });

        res.status(201).json({ userMessage, botMessage });
    } catch (err) {
        // More detailed error
        console.error('Full error:', err.response?.data || err.message);
        res.status(500).json({ 
            error: err.message,
            details: err.response?.data 
        });
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
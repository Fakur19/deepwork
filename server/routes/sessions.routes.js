
const express = require('express');
const router = express.Router();
const Session = require('../models/session.model');
const auth = require('../middleware/auth.middleware');

router.post('/', auth, async (req, res) => {
    const { task, duration } = req.body;
    try {
        const session = new Session({ user: req.user.id, task, duration });
        await session.save();
        res.status(201).json(session);
    } catch (error) {
        console.error("Error saving session:", error);
        res.status(400).json({ error: 'Failed to save session', details: error.message });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const sessions = await Session.find({ user: req.user.id }).sort({ date: -1 }).limit(5);
        res.json(sessions);
    } catch (error) {
        res.status(400).json({ error: 'Failed to get sessions' });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await Session.findByIdAndDelete(req.params.id);
        res.json({ message: 'Session deleted' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete session' });
    }
});

module.exports = router;

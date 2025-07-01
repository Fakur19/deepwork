const express = require('express');
const router = express.Router();
const Session = require('../models/session.model');
const User = require('../models/user.model');

router.get('/', async (req, res) => {
    try {
        const today = new Date();
        const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, etc.
        const startDate = new Date();
        startDate.setDate(today.getDate() - dayOfWeek);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 7);

        const leaderboard = await Session.aggregate([
            {
                $match: {
                    date: { $gte: startDate, $lt: endDate }
                }
            },
            {
                $group: {
                    _id: '$user',
                    totalDuration: { $sum: '$duration' }
                }
            },
            {
                $sort: { totalDuration: -1 }
            },
            {
                $lookup: {
                    from: User.collection.name,
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    _id: 0,
                    userId: '$user._id',
                    username: '$user.username',
                    profilePicture: '$user.profilePicture',
                    totalDuration: 1
                }
            }
        ]);

        res.json(leaderboard);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ error: 'Failed to fetch leaderboard data' });
    }
});

module.exports = router;

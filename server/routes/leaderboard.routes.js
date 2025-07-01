const express = require('express');
const router = express.Router();
const Session = require('../models/session.model');
const User = require('../models/user.model');

router.get('/', async (req, res) => {
    try {
        const { filter } = req.query;
        let startDate;
        let endDate = new Date(); // Default end date is now

        switch (filter) {
            case 'today':
                startDate = new Date();
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'week':
                startDate = new Date();
                startDate.setDate(endDate.getDate() - endDate.getDay()); // Start of current week (Sunday)
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'month':
                startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1); // Start of current month
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'all':
            default:
                // No date filter for 'all time'
                startDate = null;
                endDate = null;
                break;
        }

        const matchStage = {};
        if (startDate && endDate) {
            matchStage.date = { $gte: startDate, $lt: endDate };
        } else if (startDate) { // For 'today', 'week', 'month' where endDate is current time
            matchStage.date = { $gte: startDate };
        }

        const leaderboard = await Session.aggregate([
            {
                $match: matchStage
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

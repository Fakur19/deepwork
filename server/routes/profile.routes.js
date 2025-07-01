const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const auth = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');

// Set up storage for profile pictures
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb){
      cb(null, 'profile-' + req.user.id + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000}, // 1MB limit
}).single('profilePicture');

// Get user profile
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user profile' });
    }
});

// Update user bio
router.put('/bio', auth, async (req, res) => {
    try {
        const { bio } = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, { bio }, { new: true });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update bio' });
    }
});

// Update profile picture from link
router.put('/picture-link', auth, async (req, res) => {
    try {
        const { profilePicture } = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, { profilePicture }, { new: true });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile picture' });
    }
});

// Upload profile picture
router.post('/picture-upload', auth, (req, res) => {
    upload(req, res, async (err) => {
        if(err){
            res.status(400).json({ error: err.message });
        } else {
            if(req.file == undefined){
                res.status(400).json({ error: 'No file selected!' });
            } else {
                try {
                    const user = await User.findByIdAndUpdate(req.user.id, { profilePicture: `/uploads/${req.file.filename}` }, { new: true });
                    res.json(user);
                } catch (error) {
                    res.status(500).json({ error: 'Failed to upload profile picture' });
                }
            }
        }
    });
});

// Get public user profile by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;

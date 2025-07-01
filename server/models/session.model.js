
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    task: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;

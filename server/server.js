
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// More specific CORS configuration
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000'
}));
app.use(express.json());

const uri = process.env.MONGO_URI;
// Removed deprecated options
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const authRoutes = require('./routes/auth.routes');
const sessionRoutes = require('./routes/sessions.routes');
const leaderboardRoutes = require('./routes/leaderboard.routes');
const profileRoutes = require('./routes/profile.routes');

app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/profile', profileRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

app.get('/api/ping', (req, res) => {
  console.log('Server pinged to stay awake.');
  res.status(200).send('OK');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

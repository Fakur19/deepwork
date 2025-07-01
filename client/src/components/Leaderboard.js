import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/leaderboard`);
                setLeaderboard(res.data);
            } catch (err) {
                setError('Could not fetch leaderboard data.');
            }
        };
        fetchLeaderboard();
    }, []);

    const formatDuration = (seconds) => {
        if (seconds < 60) {
            return `${seconds} seconds`;
        }
        const minutes = Math.round(seconds / 60);
        if (minutes < 60) {
            return `${minutes} minute${minutes > 1 ? 's' : ''}`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (remainingMinutes === 0) {
            return `${hours} hour${hours > 1 ? 's' : ''}`;
        }
        return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
    };

    return (
        <div className="card">
            <h2 className="text-center">Weekly Leaderboard</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <ul className="leaderboard-list">
                {leaderboard.map((user, index) => (
                    <li key={index} className="leaderboard-item">
                        <div className="rank">{index + 1}</div>
                        <div className="user-info">
                            <img 
                                src={user.profilePicture && user.profilePicture.startsWith('http') ? user.profilePicture : `${process.env.REACT_APP_API_URL}${user.profilePicture || '/uploads/default.png'}`} 
                                alt={user.username} 
                            />
                            <Link to={`/users/${user.userId}`} style={{ color: '#e0e0e0', textDecoration: 'none' }}>
                                {user.username}
                            </Link>
                        </div>
                        <div className="duration">{formatDuration(user.totalDuration)}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;

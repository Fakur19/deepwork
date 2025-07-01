import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('week'); // Default to 'week'

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/leaderboard?filter=${filter}`);
                setLeaderboard(res.data);
            } catch (err) {
                setError('Could not fetch leaderboard data.');
            }
        };
        fetchLeaderboard();
    }, [filter]);

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
            <h2 className="text-center">Leaderboard</h2>
            <div className="d-flex flex-wrap justify-content-center mb-3">
                <button className={`btn btn-sm mx-1 my-1 ${filter === 'today' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('today')}>Today</button>
                <button className={`btn btn-sm mx-1 my-1 ${filter === 'week' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('week')}>This Week</button>
                <button className={`btn btn-sm mx-1 my-1 ${filter === 'month' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('month')}>This Month</button>
                <button className={`btn btn-sm mx-1 my-1 ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter('all')}>All Time</button>
            </div>
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

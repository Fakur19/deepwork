import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PublicProfile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const { id } = useParams(); // Get user ID from URL

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/profile/${id}`, config);
                setUser(res.data);
            } catch (err) {
                setError('Could not fetch user data.');
            }
        };
        fetchUser();
    }, [id]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="card">
            <h2 className="text-center">{user.username}'s Profile</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row">
                <div className="col-md-4 text-center">
                    <img src={user.profilePicture.startsWith('http') ? user.profilePicture : `${process.env.REACT_APP_API_URL}${user.profilePicture}`} alt="Profile" className="img-fluid rounded-circle profile-img mb-3" />
                    <h3>{user.username}</h3>
                    <p className="text-muted" color='blue'>{user.email}</p>
                </div>
                <div className="col-md-8">
                    <h4>Bio:</h4>
                    <p color='white'>{user.bio || 'No bio available.'}</p>
                </div>
            </div>
        </div>
    );
};

export default PublicProfile;
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    // Define token and config at the top level
    const token = localStorage.getItem('token');
    const config = { headers: { 'x-auth-token': token } };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/profile`, config);
                setUser(res.data);
                setBio(res.data.bio);
                setProfilePicture(res.data.profilePicture);
            } catch (err) {
                setError('Could not fetch user data.');
            }
        };
        fetchUser();
    }, [config]); // config is a dependency here

    const handleBioUpdate = useCallback(async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/profile/bio`, { bio }, config);
            setUser(res.data);
        } catch (err) {
            setError('Could not update bio.');
        }
    }, [bio, config]); // bio and config are dependencies

    const handlePictureLinkUpdate = useCallback(async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/profile/picture-link`, { profilePicture }, config);
            setUser(res.data);
        } catch (err) {
            setError('Could not update profile picture.');
        }
    }, [profilePicture, config]); // profilePicture and config are dependencies

    const handlePictureUpload = useCallback(async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('profilePicture', file);
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/profile/picture-upload`, formData, {
                ...config,
                headers: { ...config.headers, 'Content-Type': 'multipart/form-data' }
            });
            setUser(res.data);
        } catch (err) {
            setError('Could not upload profile picture.');
        }
    }, [file, config]); // file and config are dependencies

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="card">
            <h2 className="text-center">Profile</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row">
                <div className="col-12 col-md-4 text-center text-md-start mb-3 mb-md-0">
                    <img src={user.profilePicture.startsWith('http') ? user.profilePicture : `${process.env.REACT_APP_API_URL}${user.profilePicture}`} alt="Profile" className="img-fluid rounded-circle profile-img mb-3" />
                    <h3>{user.username}</h3>
                    <p className="text-muted">{user.email}</p>
                </div>
                <div className="col-12 col-md-8">
                    <form onSubmit={handleBioUpdate}>
                        <div className="form-group">
                            <label>Bio</label>
                            <textarea className="form-control" value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Update Bio</button>
                    </form>
                    <hr />
                    <form onSubmit={handlePictureLinkUpdate}>
                        <div className="form-group">
                            <label>Profile Picture URL</label>
                            <input type="text" className="form-control" value={profilePicture} onChange={(e) => setProfilePicture(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary">Update from Link</button>
                    </form>
                    <hr />
                    <form onSubmit={handlePictureUpload}>
                        <div className="form-group">
                            <label>Upload Profile Picture</label>
                            <input type="file" className="form-control-file" onChange={(e) => setFile(e.target.files[0])} />
                        </div>
                        <button type="submit" className="btn btn-primary">Upload</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;

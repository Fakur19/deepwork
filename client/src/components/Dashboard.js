import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { TimerContext } from '../context/TimerContext';

const Dashboard = () => {
    const [sessions, setSessions] = useState([]);
    const [newTask, setNewTask] = useState('');
    const { startTimer, sessionSaved } = useContext(TimerContext);

    const fetchSessions = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/sessions`, {
            headers: { 'x-auth-token': token }
        });
        setSessions(res.data);
    };

    // Fetch sessions on component mount and when a new session is saved
    useEffect(() => {
        fetchSessions();
    }, [sessionSaved]);

    const handleStart = () => {
        if (newTask.trim()) {
            startTimer(newTask);
            setNewTask(''); // Clear input after starting
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-12 col-md-8">
                <div className="card text-center">
                    <h2>Start a New Focus Session</h2>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="What do you want to work on?"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={handleStart} disabled={!newTask.trim()}>
                        Start New Session
                    </button>
                </div>
                <div className="card">
                    <h3>Session History</h3>
                    <ul className="session-list">
                        {sessions.map(session => (
                            <li key={session._id} className="session-item">
                                <div>
                                    <div className="task">{session.task}</div>
                                    <div className="details">{new Date(session.date).toLocaleDateString()}</div>
                                </div>
                                <div className="duration">{new Date(session.duration * 1000).toISOString().substr(11, 8)}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
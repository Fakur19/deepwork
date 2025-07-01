import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';
import PublicProfile from './components/PublicProfile';
import { TimerProvider } from './context/TimerContext';
import GlobalTimer from './components/GlobalTimer';
import './App.css';


function App() {
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <TimerProvider>
            <Router>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container">
                        <Link className="navbar-brand" to="/dashboard">WeWok DeTok</Link>
                        <div className="collapse navbar-collapse">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/leaderboard">Leaderboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">Profile</Link>
                                </li>
                            </ul>
                            <ul className="navbar-nav ml-auto">
                                {localStorage.getItem('token') ? (
                                    <li className="nav-item">
                                        <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                                    </li>
                                ) : (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/login">Login</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/register">Register</Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="container mt-4 pb-5">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<PrivateRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                        </Route>
                        <Route path="/leaderboard" element={<PrivateRoute />}>
                            <Route path="/leaderboard" element={<Leaderboard />} />
                        </Route>
                        <Route path="/profile" element={<PrivateRoute />}>
                            <Route path="/profile" element={<Profile />} />
                        </Route>
                        <Route path="/" element={<Login />} />
                        <Route path="/users/:id" element={<PrivateRoute />}>
                            <Route path="/users/:id" element={<PublicProfile />} />
                        </Route>
                    </Routes>
                </div>
                <GlobalTimer />
            </Router>
        </TimerProvider>
    );
}

export default App;

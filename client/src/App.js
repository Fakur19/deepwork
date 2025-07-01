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

    const handleNavLinkClick = () => {
        const navbarCollapse = document.getElementById('navbarNav');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
        }
    };

    return (
        <TimerProvider>
            <Router basename="/">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container">
                        <Link className="navbar-brand" to="/dashboard" onClick={handleNavLinkClick}>WeWok DeTok</Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/leaderboard" onClick={handleNavLinkClick}>Leaderboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile" onClick={handleNavLinkClick}>Profile</Link>
                                </li>
                            </ul>
                            <ul className="navbar-nav ms-auto">
                                {localStorage.getItem('token') ? (
                                    <li className="nav-item">
                                        <button className="btn btn-danger" onClick={() => { handleLogout(); handleNavLinkClick(); }}>Logout</button>
                                    </li>
                                ) : (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/login" onClick={handleNavLinkClick}>Login</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/register" onClick={handleNavLinkClick}>Register</Link>
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

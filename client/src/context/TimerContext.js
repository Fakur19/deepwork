import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
    const [task, setTask] = useState('');
    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [sessionSaved, setSessionSaved] = useState(false);

    // The core timer logic
    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const startTimer = (currentTask) => {
        setTask(currentTask);
        setIsActive(true);
    };

    const pauseTimer = () => {
        setIsActive(false);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTime(0);
        setTask('');
    };

    const saveSession = useCallback(async () => {
        if (time > 0 && task) {
            try {
                const token = localStorage.getItem('token');
                await axios.post('http://localhost:5000/api/sessions', { task, duration: time }, {
                    headers: { 'x-auth-token': token }
                });
                resetTimer();
                setSessionSaved(true); // Signal that a session was saved
            } catch (error) {
                console.error('Failed to save session', error);
            }
        }
    }, [task, time]);

    // Used to reset the session saved signal
    useEffect(() => {
        if (sessionSaved) {
            setSessionSaved(false);
        }
    }, [sessionSaved]);

    const value = {
        time,
        task,
        isActive,
        sessionSaved,
        setTask,
        startTimer,
        pauseTimer,
        resetTimer,
        saveSession
    };

    return (
        <TimerContext.Provider value={value}>
            {children}
        </TimerContext.Provider>
    );
};

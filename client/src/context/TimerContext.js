import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
    // Stopwatch State
    const [stopwatchTask, setStopwatchTask] = useState('');
    const [stopwatchTime, setStopwatchTime] = useState(0);
    const [isStopwatchActive, setIsStopwatchActive] = useState(false);

    // Pomodoro State
    const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
    const [pomodoroSeconds, setPomodoroSeconds] = useState(0);
    const [isPomodoroActive, setIsPomodoroActive] = useState(false);
    const [pomodoroPhase, setPomodoroPhase] = useState('work'); // 'work', 'shortBreak', 'longBreak'
    const [pomodoroCount, setPomodoroCount] = useState(0);
    const [pomodoroTask, setPomodoroTask] = useState('');

    const [sessionSaved, setSessionSaved] = useState(false);

    const WORK_TIME = 25 * 60; // 25 minutes in seconds
    const SHORT_BREAK_TIME = 5 * 60; // 5 minutes in seconds
    const LONG_BREAK_TIME = 15 * 60; // 15 minutes in seconds

    const stopwatchIntervalRef = useRef(null);
    const pomodoroIntervalRef = useRef(null);

    // Function Definitions (moved to top and converted to function declarations for hoisting)
    const saveSession = useCallback(async (taskToSave, durationToSave) => {
        console.log('saveSession called', { taskToSave, durationToSave });
        if (durationToSave > 0 && taskToSave) {
            try {
                const token = localStorage.getItem('token');
                await axios.post(`${process.env.REACT_APP_API_URL}/api/sessions`, { task: taskToSave, duration: durationToSave }, {
                    headers: { 'x-auth-token': token }
                });
                console.log('Session saved successfully. Calling resetStopwatch...');
                resetStopwatch(); // Reset the stopwatch after saving
                setSessionSaved(true); // Signal that a session was saved
            } catch (error) {
                console.error('Failed to save session', error);
            }
        }
    }, []);

    function resetStopwatch() {
        console.log('resetStopwatch called. Current interval ref:', stopwatchIntervalRef.current);
        setIsStopwatchActive(false);
        clearInterval(stopwatchIntervalRef.current);
        setStopwatchTime(0);
        setStopwatchTask('');
        console.log('Stopwatch reset: isStopwatchActive=', false, 'time=', 0);
    }

    function resetPomodoro(newPhase = 'work') {
        setIsPomodoroActive(false);
        clearInterval(pomodoroIntervalRef.current); // Ensure interval is cleared if reset is called externally
        switch (newPhase) {
            case 'work':
                setPomodoroMinutes(Math.floor(WORK_TIME / 60));
                setPomodoroSeconds(WORK_TIME % 60);
                break;
            case 'shortBreak':
                setPomodoroMinutes(Math.floor(SHORT_BREAK_TIME / 60));
                setPomodoroSeconds(SHORT_BREAK_TIME % 60);
                break;
            case 'longBreak':
                setPomodoroMinutes(Math.floor(LONG_BREAK_TIME / 60));
                setPomodoroSeconds(LONG_BREAK_TIME % 60);
                break;
            default:
                setPomodoroMinutes(25);
                setPomodoroSeconds(0);
                break;
        }
        setPomodoroPhase(newPhase);
        setPomodoroTask('');
    }

    function startStopwatch(currentTask) {
        setStopwatchTask(currentTask);
        setIsStopwatchActive(true);
        setIsPomodoroActive(false); // Pause pomodoro if stopwatch starts
    }

    function pauseStopwatch() {
        setIsStopwatchActive(false);
    }

    function startPomodoro(currentTask) {
        setPomodoroTask(currentTask);
        setIsPomodoroActive(true);
        setIsStopwatchActive(false); // Pause stopwatch if pomodoro starts
    }

    function pausePomodoro() {
        setIsPomodoroActive(false);
    }

    // Stopwatch Logic (useEffect)
    useEffect(() => {
        if (isStopwatchActive) {
            stopwatchIntervalRef.current = setInterval(() => {
                setStopwatchTime(prevTime => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(stopwatchIntervalRef.current);
        }
        return () => clearInterval(stopwatchIntervalRef.current);
    }, [isStopwatchActive]);

    // Pomodoro Logic (useEffect)
    useEffect(() => {
        if (isPomodoroActive) {
            pomodoroIntervalRef.current = setInterval(() => {
                if (pomodoroSeconds === 0) {
                    if (pomodoroMinutes === 0) {
                        // Time's up for current phase
                        clearInterval(pomodoroIntervalRef.current);
                        setIsPomodoroActive(false);

                        if (pomodoroPhase === 'work') {
                            // Save the work session
                            if (pomodoroTask.trim()) {
                                saveSession(pomodoroTask, WORK_TIME); // Save the full work duration
                            }
                            setPomodoroCount(prev => prev + 1);
                            if ((pomodoroCount + 1) % 4 === 0) {
                                resetPomodoro('longBreak');
                            } else {
                                resetPomodoro('shortBreak');
                            }
                        } else { // Break phase ends
                            resetPomodoro('work');
                        }
                    } else {
                        setPomodoroMinutes(prev => prev - 1);
                        setPomodoroSeconds(59);
                    }
                } else {
                    setPomodoroSeconds(prev => prev - 1);
                }
            }, 1000);
        }

        return () => clearInterval(pomodoroIntervalRef.current);
    }, [isPomodoroActive, pomodoroMinutes, pomodoroSeconds, pomodoroPhase, pomodoroCount, pomodoroTask, resetPomodoro, saveSession, WORK_TIME]);

    // Used to reset the session saved signal
    useEffect(() => {
        if (sessionSaved) {
            setSessionSaved(false);
        }
    }, [sessionSaved]);

    const value = {
        // Stopwatch
        stopwatchTime,
        stopwatchTask,
        setStopwatchTask,
        isStopwatchActive,
        startStopwatch,
        pauseStopwatch,
        resetStopwatch,

        // Pomodoro
        pomodoroMinutes,
        pomodoroSeconds,
        isPomodoroActive,
        pomodoroPhase,
        pomodoroCount,
        pomodoroTask,
        setPomodoroTask,
        startPomodoro,
        pausePomodoro,
        resetPomodoro,

        // General
        sessionSaved,
        saveSession,
        WORK_TIME
    };

    return (
        <TimerContext.Provider value={value}>
            {children}
        </TimerContext.Provider>
    );
};

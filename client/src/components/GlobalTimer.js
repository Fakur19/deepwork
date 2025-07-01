import React, { useContext } from 'react';
import { TimerContext } from '../context/TimerContext';
import './GlobalTimer.css';

const GlobalTimer = () => {
    const { time, task, isActive, pauseTimer, resetTimer, saveSession } = useContext(TimerContext);

    if (!isActive && time === 0) {
        return null; // Don't show if the timer has never started
    }

    return (
        <div className="global-timer-bar">
            <div className="task-name">
                <strong>Task:</strong> {task || 'No active task'}
            </div>
            <div className="time-display">
                {new Date(time * 1000).toISOString().substr(11, 8)}
            </div>
            <div className="controls">
                <button className="btn btn-sm btn-warning" onClick={pauseTimer} disabled={!isActive}>
                    Pause
                </button>
                <button className="btn btn-sm btn-danger" onClick={resetTimer}>
                    Reset
                </button>
                <button className="btn btn-sm btn-success" onClick={saveSession} disabled={time === 0}>
                    Save & End
                </button>
            </div>
        </div>
    );
};

export default GlobalTimer;

import React, { useContext } from 'react';
import { TimerContext } from '../context/TimerContext';
import './GlobalTimer.css';

const GlobalTimer = () => {
    const { stopwatchTime, stopwatchTask, isStopwatchActive, pauseStopwatch, resetStopwatch, saveSession } = useContext(TimerContext);

    if (!isStopwatchActive && stopwatchTime === 0) {
        return null; // Don't show if the timer has never started
    }

    return (
        <div className="global-timer-bar">
            <div className="task-name">
                <strong>Task:</strong> {stopwatchTask || 'No active task'}
            </div>
            <div className="time-display">
                {new Date(stopwatchTime * 1000).toISOString().substr(11, 8)}
            </div>
            <div className="controls">
                <button className="btn btn-sm btn-warning" onClick={pauseStopwatch} disabled={!isStopwatchActive}>
                    Pause
                </button>
                <button className="btn btn-sm btn-danger" onClick={resetStopwatch}>
                    Reset
                </button>
                <button className="btn btn-sm btn-success" onClick={() => saveSession(stopwatchTask, stopwatchTime)} disabled={stopwatchTime === 0}>
                    Save & End
                </button>
            </div>
        </div>
    );
};

export default GlobalTimer;

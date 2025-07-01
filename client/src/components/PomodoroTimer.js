import React, { useContext } from 'react';
import { TimerContext } from '../context/TimerContext';

const PomodoroTimer = () => {
    const {
        pomodoroMinutes,
        pomodoroSeconds,
        isPomodoroActive,
        pomodoroPhase,
        pomodoroCount,
        setPomodoroCount,
        pomodoroTask,
        setPomodoroTask,
        startPomodoro,
        pausePomodoro,
        resetPomodoro
    } = useContext(TimerContext);

    const toggleTimer = () => {
        if (pomodoroTask.trim() || pomodoroPhase !== 'work') {
            if (isPomodoroActive) {
                pausePomodoro();
            } else {
                startPomodoro(pomodoroTask);
            }
        } else {
            alert('Please enter a task for your work session.');
        }
    };

    const handleReset = () => {
        resetPomodoro('work');
        setPomodoroCount(0);
        setPomodoroTask('');
    };

    const displayTime = `${pomodoroMinutes < 10 ? '0' : ''}${pomodoroMinutes}:${pomodoroSeconds < 10 ? '0' : ''}${pomodoroSeconds}`;

    return (
        <div className="card text-center">
            <h2>Pomodoro Timer</h2>
            <div className="form-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="What are you working on? (Pomodoro)"
                    value={pomodoroTask}
                    onChange={(e) => setPomodoroTask(e.target.value)}
                    disabled={isPomodoroActive && pomodoroPhase === 'work'}
                />
            </div>
            <h3 className="timer">{displayTime}</h3>
            <p className="text-muted">Phase: {pomodoroPhase === 'work' ? 'Work' : pomodoroPhase === 'shortBreak' ? 'Short Break' : 'Long Break'}</p>
            <p className="text-muted">Pomodoros Completed: {pomodoroCount}</p>
            <div className="d-flex justify-content-center mt-3">
                <button className="btn btn-primary mx-1" onClick={toggleTimer}>
                    {isPomodoroActive ? 'Pause' : 'Start'}
                </button>
                <button className="btn btn-secondary mx-1" onClick={handleReset}>
                    Reset
                </button>
            </div>
        </div>
    );
};

export default PomodoroTimer;

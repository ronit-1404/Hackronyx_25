import React, { useState, useEffect } from 'react';

const FocusTimer = () => {
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(1500); // 25 minutes in seconds

    useEffect(() => {
        let timer;
        if (isActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            alert("Time's up! Take a break.");
        }
        return () => clearInterval(timer);
    }, [isActive, timeLeft]);

    const handleStart = () => {
        setIsActive(true);
    };

    const handlePause = () => {
        setIsActive(false);
    };

    const handleReset = () => {
        setIsActive(false);
        setTimeLeft(1500);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h2 className="text-xl font-semibold">Focus Timer</h2>
            <div className="text-4xl font-mono">{formatTime(timeLeft)}</div>
            <div className="flex space-x-4 mt-4">
                <button onClick={handleStart} className="bg-blue-500 text-white px-4 py-2 rounded">Start</button>
                <button onClick={handlePause} className="bg-yellow-500 text-white px-4 py-2 rounded">Pause</button>
                <button onClick={handleReset} className="bg-red-500 text-white px-4 py-2 rounded">Reset</button>
            </div>
        </div>
    );
};

export default FocusTimer;
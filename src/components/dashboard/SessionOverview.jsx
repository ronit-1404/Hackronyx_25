import React from 'react';

const SessionOverview = () => {
    const [focusStreak, setFocusStreak] = React.useState(0);
    const [focusTime, setFocusTime] = React.useState(0);
    const [goal, setGoal] = React.useState(0);
    const [peakFocusHours, setPeakFocusHours] = React.useState([]);

    // Logic to calculate focus streak, time, and peak hours can be added here

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Session Overview</h2>
            <div className="flex flex-col space-y-4">
                <div className="flex justify-between">
                    <span className="font-medium">Focus Streak:</span>
                    <span className="font-bold">{focusStreak} days</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Focus Time:</span>
                    <span className="font-bold">{focusTime} minutes</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Goal:</span>
                    <span className="font-bold">{goal} minutes</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Peak Focus Hours:</span>
                    <span className="font-bold">{peakFocusHours.join(', ')}</span>
                </div>
            </div>
        </div>
    );
};

export default SessionOverview;
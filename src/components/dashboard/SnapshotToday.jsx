import React from 'react';

const SnapshotToday = () => {
    // Placeholder data
    const hoursFocused = 5; // Example data
    const goal = 8; // Example goal
    const peakFocusHours = [
        { hour: '10 AM', focused: 1 },
        { hour: '11 AM', focused: 2 },
        { hour: '2 PM', focused: 1 },
        { hour: '3 PM', focused: 1 },
    ];

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Today's Focus Snapshot</h2>
            <div className="mb-4">
                <h3 className="text-lg">Hours Focused: {hoursFocused} / {goal}</h3>
            </div>
            <div>
                <h3 className="text-lg">Peak Focus Hours</h3>
                <ul className="list-disc pl-5">
                    {peakFocusHours.map((item, index) => (
                        <li key={index}>
                            {item.hour}: {item.focused} hour(s) focused
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SnapshotToday;
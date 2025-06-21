import React from 'react';

const QuickStats = () => {
    // Placeholder data
    const totalStudents = 150;
    const avgConfusionRate = 0.25; // 25%
    const mostUsedAIIntervention = "Take a break";

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-lg font-semibold">Total Students</h2>
                <p className="text-2xl">{totalStudents}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-lg font-semibold">Average Confusion Rate</h2>
                <p className="text-2xl">{(avgConfusionRate * 100).toFixed(0)}%</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-lg font-semibold">Most Used AI Intervention</h2>
                <p className="text-2xl">{mostUsedAIIntervention}</p>
            </div>
        </div>
    );
};

export default QuickStats;
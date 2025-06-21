import React from 'react';

const LiveSnapshot = () => {
    // Placeholder data
    const activeClasses = [
        { name: 'Math 101', code: 'MTH101', enrolled: 25 },
        { name: 'Science 202', code: 'SCI202', enrolled: 30 },
        { name: 'History 303', code: 'HIS303', enrolled: 20 },
    ];

    const enrolledStudents = [
        { name: 'John Doe', engagementScore: 85 },
        { name: 'Jane Smith', engagementScore: 90 },
        { name: 'Alice Johnson', engagementScore: 78 },
    ];

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Live Snapshot</h2>
            <div className="mb-6">
                <h3 className="text-lg font-semibold">Active Classes</h3>
                <ul className="list-disc pl-5">
                    {activeClasses.map((classItem) => (
                        <li key={classItem.code}>
                            {classItem.name} ({classItem.code}) - Enrolled: {classItem.enrolled}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3 className="text-lg font-semibold">Currently Enrolled Students</h3>
                <ul className="list-disc pl-5">
                    {enrolledStudents.map((student) => (
                        <li key={student.name}>
                            {student.name} - Engagement Score: {student.engagementScore}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default LiveSnapshot;
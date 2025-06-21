import React from 'react';

const ClassCard = ({ 
  className, 
  classCode, 
  enrolledCount, 
  avgEngagementScore, 
  activeAlerts 
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold">{className}</h2>
      <p className="text-gray-600">Class Code: {classCode}</p>
      <p className="text-gray-600">Enrolled Students: {enrolledCount}</p>
      <p className="text-gray-600">Average Engagement Score: {avgEngagementScore}</p>
      {activeAlerts.length > 0 && (
        <div className="mt-2">
          <h3 className="font-semibold">Active Alerts:</h3>
          <ul className="list-disc list-inside">
            {activeAlerts.map((alert, index) => (
              <li key={index} className="text-red-500">{alert}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClassCard;

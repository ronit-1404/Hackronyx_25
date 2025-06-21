import React from "react";

// Placeholder data
const childSummary = [
  {
    name: "Aarav Sharma",
    engagement: 92,
    lastSession: "Quiz",
    focusHours: 3.5,
  },
  {
    name: "Priya Singh",
    engagement: 85,
    lastSession: "Video",
    focusHours: 2.8,
  },
];

const ParentDashboard = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Parent Dashboard</h1>
    {/* Child Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {childSummary.map((child) => (
        <div key={child.name} className="bg-white p-4 rounded shadow border">
          <div className="text-lg font-semibold mb-1">{child.name}</div>
          <div>Engagement Score: <span className="font-bold">{child.engagement}</span></div>
          <div>Last Session: <span className="font-bold">{child.lastSession}</span></div>
          <div>Today's Focus: <span className="font-bold">{child.focusHours} hrs</span></div>
        </div>
      ))}
    </div>
    {/* Weekly Overview Placeholder */}
    <div className="bg-blue-50 p-4 rounded shadow mb-4">
      <div className="font-semibold mb-1">Weekly Overview</div>
      <div className="text-gray-700">[Charts and trends about your child's engagement and focus will appear here]</div>
    </div>
    {/* Alerts Placeholder */}
    <div className="bg-yellow-50 p-4 rounded shadow">
      <div className="font-semibold mb-1">Alerts & Suggestions</div>
      <div className="text-gray-700">[Personalized alerts and suggestions for your child will appear here]</div>
    </div>
  </div>
);

export default ParentDashboard;
// Compare this snippet from client/src/pages/ParentDashboard.jsx:
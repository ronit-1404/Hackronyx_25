import React from "react";
import { Users } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const Demographics = () => {
  const demographics = [
    { group: "Grade 10", count: 40, color: "#F67280", engagement: 78 },
    { group: "Grade 11", count: 35, color: "#10B981", engagement: 82 },
    { group: "Grade 12", count: 25, color: "#F59E0B", engagement: 85 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Users className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Demographics</h2>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={demographics}
            cx="50%"
            cy="50%"
            outerRadius={70}
            fill="#8884d8"
            dataKey="count"
            label={({ group, count }) => `${group}: ${count}`}
          >
            {demographics.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-3 mt-4">
        {demographics.map((demo) => (
          <div key={demo.group} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: demo.color }}
              ></div>
              <span className="text-sm font-medium text-gray-700">
                {demo.group}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">
                {demo.count} students
              </p>
              <p className="text-xs text-gray-500">
                {demo.engagement}% engaged
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Demographics;
import React from "react";
import { AlertTriangle, TrendingDown } from "lucide-react";

const BottomPerformer = () => {
  const bottomPerformers = [
    {
      name: "Rohan Patel",
      score: 60,
      class: "Math X A",
      decline: "-2%",
      missedTests: 3,
      avatar: "RP",
      subjects: ["Mathematics"],
      needsHelp: ["Algebra", "Geometry"],
      lastActive: "2 days ago",
    },
    {
      name: "Sneha Verma",
      score: 58,
      class: "Physics XI B",
      decline: "-5%",
      missedTests: 5,
      avatar: "SV",
      subjects: ["Physics"],
      needsHelp: ["Mechanics", "Waves"],
      lastActive: "3 days ago",
    },
    {
      name: "Karan Singh",
      score: 55,
      class: "Chem XI A",
      decline: "-3%",
      missedTests: 4,
      avatar: "KS",
      subjects: ["Chemistry"],
      needsHelp: ["Organic Chemistry"],
      lastActive: "1 day ago",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Bottom Performers
          </h2>
        </div>
        <TrendingDown className="w-5 h-5 text-red-600" />
      </div>
      <div className="space-y-4">
        {bottomPerformers.map((student) => (
          <div
            key={student.name}
            className="flex items-center space-x-4 p-3 rounded-lg bg-gradient-to-r from-red-50 to-pink-50 border border-red-200"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                {student.avatar}
              </div>
              {student.missedTests > 2 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  !
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{student.name}</h3>
              <p className="text-sm text-gray-600">{student.class}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                  {student.decline}
                </span>
                <span className="text-xs text-gray-500">
                  {student.missedTests} missed
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Needs help: {student.needsHelp.join(", ")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-red-600">{student.score}%</p>
              <p className="text-xs text-gray-500">{student.lastActive}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomPerformer;
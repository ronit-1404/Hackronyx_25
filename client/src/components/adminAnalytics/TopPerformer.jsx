import React from "react";
import { Crown, TrendingUp } from "lucide-react";

const TopPerformer = () => {
     const topPerformers = [
    { 
      name: "Aarav Sharma", 
      score: 98, 
      class: "Math XII A", 
      improvement: "+5%", 
      streak: 15,
      avatar: "AS",
      subjects: ["Mathematics", "Physics"],
      totalTests: 24,
      rank: 1
    },
    { 
      name: "Priya Singh", 
      score: 95, 
      class: "Physics XI B", 
      improvement: "+8%", 
      streak: 12,
      avatar: "PS",
      subjects: ["Physics", "Chemistry"],
      totalTests: 22,
      rank: 2
    },
    { 
      name: "Arjun Kumar", 
      score: 94, 
      class: "Chem XII C", 
      improvement: "+3%", 
      streak: 10,
      avatar: "AK",
      subjects: ["Chemistry", "Biology"],
      totalTests: 20,
      rank: 3
    },
    { 
      name: "Ananya Patel", 
      score: 92, 
      class: "Bio XII A", 
      improvement: "+12%", 
      streak: 8,
      avatar: "AP",
      subjects: ["Biology", "Chemistry"],
      totalTests: 25,
      rank: 4
    }
  ];
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Crown className="w-6 h-6 text-yellow-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Top Performers
          </h2>
        </div>
        <TrendingUp className="w-5 h-5 text-green-600" />
      </div>
      <div className="space-y-4">
        {topPerformers.map((student, index) => (
          <div
            key={student.name}
            className="flex items-center space-x-4 p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                {student.avatar}
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-white">
                {student.rank}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{student.name}</h3>
              <p className="text-sm text-gray-600">{student.class}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {student.improvement}
                </span>
                <span className="text-xs text-gray-500">
                  {student.streak} day streak
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-green-600">
                {student.score}%
              </p>
              <p className="text-xs text-gray-500">
                {student.totalTests} tests
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPerformer;

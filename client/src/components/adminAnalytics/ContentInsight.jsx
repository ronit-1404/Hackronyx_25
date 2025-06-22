import React from "react";
import { Lightbulb } from "lucide-react";

const ContentInsight = () => {
  const contentInsights = [
    {
      lecture: "Algebra Basics",
      effectiveness: "Low",
      score: 65,
      views: 120,
      completionRate: 68,
      avgWatchTime: "12 min",
      difficulty: "Medium",
      feedback: 3.2,
    },
    {
      lecture: "Calculus I",
      effectiveness: "High",
      score: 89,
      views: 95,
      completionRate: 92,
      avgWatchTime: "18 min",
      difficulty: "Hard",
      feedback: 4.6,
    },
    {
      lecture: "Physics Mechanics",
      effectiveness: "Medium",
      score: 76,
      views: 110,
      completionRate: 78,
      avgWatchTime: "15 min",
      difficulty: "Medium",
      feedback: 4.1,
    },
    {
      lecture: "Organic Chemistry",
      effectiveness: "High",
      score: 91,
      views: 88,
      completionRate: 89,
      avgWatchTime: "20 min",
      difficulty: "Hard",
      feedback: 4.5,
    },
  ];
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Lightbulb className="w-6 h-6 text-amber-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Content Effectiveness
        </h2>
      </div>
      <div className="space-y-4">
        {contentInsights.map((content) => (
          <div
            key={content.lecture}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {content.lecture}
                </h3>
                <p className="text-sm text-gray-600">
                  Difficulty: {content.difficulty}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  content.effectiveness === "High"
                    ? "bg-green-100 text-green-800"
                    : content.effectiveness === "Medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {content.effectiveness}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">
                  Score:{" "}
                  <span className="font-bold text-gray-900">
                    {content.score}%
                  </span>
                </p>
                <p className="text-gray-600">
                  Views:{" "}
                  <span className="font-bold text-gray-900">
                    {content.views}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-gray-600">
                  Completion:{" "}
                  <span className="font-bold text-gray-900">
                    {content.completionRate}%
                  </span>
                </p>
                <p className="text-gray-600">
                  Rating:{" "}
                  <span className="font-bold text-gray-900">
                    {content.feedback}/5
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    content.effectiveness === "High"
                      ? "bg-green-500"
                      : content.effectiveness === "Medium"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${content.score}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentInsight;

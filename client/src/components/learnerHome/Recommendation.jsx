import React from "react";
import { Brain, Coffee, BookOpen, Headphones } from "lucide-react";

const Recommendation = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <Brain className="w-6 h-6 mr-3" style={{ color: "#F67280" }} />
        <h2 className="text-xl font-semibold text-gray-900">
          AI-Powered Recommendations
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-all">
          <div className="absolute top-4 right-4">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-green-100">
              <Coffee className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-800 text-lg mb-2">
                Take a Break
              </h3>
              <p className="text-green-700 text-sm leading-relaxed">
                You've been focused for 2 hours. A 15-minute break will help
                maintain your productivity momentum.
              </p>
              <div className="mt-4">
                <span className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  High Priority
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-all">
          <div className="absolute top-4 right-4">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-blue-100">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-800 text-lg mb-2">
                Review Session
              </h3>
              <p className="text-blue-700 text-sm leading-relaxed">
                Confusion patterns suggest reviewing Chapter 3 concepts before
                proceeding to new material.
              </p>
              <div className="mt-4">
                <span className="text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  Medium Priority
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="relative bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200 hover:shadow-lg transition-all">
          <div className="absolute top-4 right-4">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-purple-100">
              <Headphones className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-purple-800 text-lg mb-2">
                Focus Enhancement
              </h3>
              <p className="text-purple-700 text-sm leading-relaxed">
                Try ambient soundscapes to improve concentration during complex
                problem-solving tasks.
              </p>
              <div className="mt-4">
                <span className="text-xs text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                  Suggestion
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendation;

import React from "react";
import { Brain, AlertCircle, TrendingUp, Award } from "lucide-react";

const SystemRecomendation = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <Brain className="w-6 h-6 mr-3" style={{ color: "#F67280" }} />
        <h2 className="text-xl font-semibold text-gray-900">
          System Recommendations
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="relative bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-200 hover:shadow-lg transition-all">
          <div className="absolute top-4 right-4">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-red-100">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 text-lg mb-2">
                High Confusion Alert
              </h3>
              <p className="text-red-700 text-sm leading-relaxed">
                Advanced Calculus course showing 28% confusion rate. Recommend
                additional TA support.
              </p>
              <div className="mt-4">
                <span className="text-xs text-red-600 bg-red-100 px-3 py-1 rounded-full">
                  Urgent
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
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-800 text-lg mb-2">
                Engagement Boost
              </h3>
              <p className="text-blue-700 text-sm leading-relaxed">
                Data Structures course engagement up 15%. Consider replicating
                teaching methods.
              </p>
              <div className="mt-4">
                <span className="text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  Opportunity
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-all">
          <div className="absolute top-4 right-4">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-green-100">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-800 text-lg mb-2">
                System Optimization
              </h3>
              <p className="text-green-700 text-sm leading-relaxed">
                AI intervention success rate at 84%. System performing optimally
                across all metrics.
              </p>
              <div className="mt-4">
                <span className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  Excellent
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemRecomendation;

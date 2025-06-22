import React, { useState, useEffect } from "react";
import { BarChart3 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PerformanceGraph = () => {
  const [animationKey, setAnimationKey] = useState(0);

  // Sample performance data
  const performanceData = [
    {
      month: "Jan",
      topAvg: 92,
      bottomAvg: 45,
      overall: 73,
    },
    {
      month: "Feb",
      topAvg: 89,
      bottomAvg: 48,
      overall: 71,
    },
    {
      month: "Mar",
      topAvg: 94,
      bottomAvg: 52,
      overall: 76,
    },
    {
      month: "Apr",
      topAvg: 96,
      bottomAvg: 47,
      overall: 74,
    },
    {
      month: "May",
      topAvg: 91,
      bottomAvg: 55,
      overall: 78,
    },
    {
      month: "Jun",
      topAvg: 98,
      bottomAvg: 58,
      overall: 82,
    },
    {
      month: "Jul",
      topAvg: 95,
      bottomAvg: 53,
      overall: 79,
    },
    {
      month: "Aug",
      topAvg: 93,
      bottomAvg: 49,
      overall: 75,
    },
    {
      month: "Sep",
      topAvg: 97,
      bottomAvg: 56,
      overall: 81,
    },
    {
      month: "Oct",
      topAvg: 99,
      bottomAvg: 61,
      overall: 84,
    },
    {
      month: "Nov",
      topAvg: 94,
      bottomAvg: 54,
      overall: 77,
    },
    {
      month: "Dec",
      topAvg: 96,
      bottomAvg: 59,
      overall: 83,
    },
  ];

  // Trigger animation on component mount
  useEffect(() => {
    setAnimationKey(1);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-6 h-6" style={{ color: "#F67280" }} />
          <h2 className="text-xl font-semibold text-gray-900">
            Performance Trends
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-600">Top Performers</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-600">Bottom Performers</span>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#F67280" }}
            ></div>
            <span className="text-sm text-gray-600">Overall Average</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300} key={animationKey}>
        <LineChart data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Line
            type="monotone"
            dataKey="topAvg"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ fill: "#10B981", strokeWidth: 2, r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="bottomAvg"
            stroke="#EF4444"
            strokeWidth={3}
            dot={{ fill: "#EF4444", strokeWidth: 2, r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="overall"
            stroke="#F67280"
            strokeWidth={3}
            dot={{ fill: "#F67280", strokeWidth: 2, r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceGraph;
import React from 'react';
import { Users, BookOpen, Activity, MessageCircle } from 'lucide-react';

export default function StatsCards() {
  // Sample data - replace with actual data from props or state
  const summary = {
    totalStudents: 1248,
    activeCourses: 24,
    avgEngagement: 87,
    unansweredQueries: 5
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {/* Total Students */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#000000' }}>
            <Users className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900">{summary.totalStudents}</p>
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-xs text-gray-500 mt-1">Enrolled across all classes</p>
        </div>
      </div>

      {/* Active Courses */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Active</span>
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900">{summary.activeCourses}</p>
          <p className="text-sm text-gray-600">Active Courses</p>
          <p className="text-xs text-gray-500 mt-1">Currently running</p>
        </div>
      </div>

      {/* Average Engagement */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">↑8%</span>
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900">{summary.avgEngagement}%</p>
          <p className="text-sm text-gray-600">Avg Engagement</p>
          <p className="text-xs text-gray-500 mt-1">Across all classes</p>
        </div>
      </div>

      {/* Pending Queries */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${summary.unansweredQueries > 0 ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'}`}>
            {summary.unansweredQueries > 0 ? 'Needs Attention' : 'All Clear'}
          </span>
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900">{summary.unansweredQueries}</p>
          <p className="text-sm text-gray-600">Pending Queries</p>
          <p className="text-xs text-gray-500 mt-1">Requiring response</p>
        </div>
      </div>
    </div>
  );
}
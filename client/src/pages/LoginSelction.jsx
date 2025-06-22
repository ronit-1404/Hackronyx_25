import React from "react";
import { Users, Settings } from "lucide-react";

function LoginSelection({ onSelect }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5EFE6' }}>
      <div className="w-full max-w-4xl p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">Learning Engagement Tracker</h1>
          <p className="text-xl text-gray-600">Select your role to continue</p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          
          {/* Student Card */}
          <div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 cursor-pointer hover:shadow-lg transition-all duration-300 group"
            onClick={() => {
              console.log("Student card clicked"); // Debug log
              onSelect("student");
            }}
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#F67280' }}>
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Student</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Access your courses, track your learning progress, and engage with interactive content designed to enhance your educational experience.
              </p>
              <div className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300 group-hover:scale-105" style={{ backgroundColor: '#F67280', color: 'white' }}>
                Access Student Portal
              </div>
            </div>
          </div>

          {/* Admin Card */}
          <div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 cursor-pointer hover:shadow-lg transition-all duration-300 group"
            onClick={() => {
              console.log("Admin card clicked"); // Debug log
              onSelect("admin");
            }}
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Settings className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Administrator</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Manage system settings, monitor student engagement, view analytics, and oversee the entire learning platform ecosystem.
              </p>
              <div className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg font-medium transition-all duration-300 group-hover:scale-105">
                Access Admin Portal
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Powered by AI-driven learning analytics and engagement tracking
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginSelection;
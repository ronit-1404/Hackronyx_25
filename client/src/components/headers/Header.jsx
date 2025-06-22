import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import {
  FileText,
  Settings,
  LogOut,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Brain,
  Zap,
  Activity,
  BarChart2,
  LucideHome
} from "lucide-react";

const Header = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("today");
  const navigate = useNavigate();
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Learning Analytics Dashboard
        </h2>
        <p className="text-sm text-gray-600">
          Real-time insights and performance tracking
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <select
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F67280] focus:border-transparent"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
        <button 
              onClick={() => navigate('/learner/analytics')}
              className="flex items-center space-x-2 py-2 px-4 rounded-lg text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
              style={{ backgroundColor: '#F67280' }}
            >
              <BarChart2 className="w-5 h-5" />
              <span>Advance Analytics</span>
            </button>

            <button 
              className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 hover:border-blue-300 transition-all duration-300 group relative transform hover:scale-110 hover:rotate-3 shadow-sm hover:shadow-lg"
              onClick={() => navigate('/analysis')}
              title="Analytics Home"
            >
              <LucideHome className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
            </button>

            <button 
              className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 hover:border-blue-300 transition-all duration-300 group relative transform hover:scale-110 hover:rotate-3 shadow-sm hover:shadow-lg"
              onClick={() => navigate('/learner/home')}
              title="Home"
            >
              <LucideHome className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
            </button>

            <button 
              className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 hover:border-blue-300 transition-all duration-300 group relative transform hover:scale-110 hover:rotate-3 shadow-sm hover:shadow-lg"
              onClick={() => navigate('/learner/resources')}
              title="Learning Resources"
            >
              <FileText className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
            </button>
            <button 
              className="p-3 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 border border-orange-200 hover:border-orange-300 transition-all duration-300 group relative transform hover:scale-110 hover:-rotate-3 shadow-sm hover:shadow-lg"
              onClick={() => navigate('/learner/settings')}
              title="System Settings & Configuration"
            >
              <Settings className="w-5 h-5 text-orange-600 group-hover:text-orange-700 transition-colors duration-300" />
            </button>
            <button 
              className="p-3 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 border border-orange-200 hover:border-orange-300 transition-all duration-300 group relative transform hover:scale-110 hover:-rotate-3 shadow-sm hover:shadow-lg"
              onClick={() => navigate('/signout')}
              title="Sign Out"
            >
              <LogOut className="w-5 h-5 text-orange-600 group-hover:text-orange-700 transition-colors duration-300" />
            </button>
      </div>
    </div>
  );
};

export default Header;

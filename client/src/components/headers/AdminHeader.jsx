import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Clock,
  Target,
  Activity,
  Smile,
  AlertCircle,
  Coffee,
  Monitor,
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Timer,
  BarChart2,
  Settings,
  User,
  Bell,
  Eye,
  Brain,
  Zap,
  Globe,
  Calendar,
  MessageSquare,
  HelpCircle,
  CheckCircle,
  XCircle,
  School,
  Award,
  TrendingDown,
    Download,
    LucideHome
} from "lucide-react";

const AdminHeader = () => {
  // State for time range selection
  const [selectedTimeRange, setSelectedTimeRange] = useState("today");
  
  // Navigation hook
  const navigate = useNavigate();

  // Handle time range change
  const handleTimeRangeChange = (e) => {
    const newTimeRange = e.target.value;
    setSelectedTimeRange(newTimeRange);
    
    // Optional: You can emit an event or call a callback to update dashboard data
    // based on the selected time range
    console.log(`Time range changed to: ${newTimeRange}`);
    
    // If you need to trigger a data refresh in parent component,
    // you can accept an onTimeRangeChange prop and call it here
    // onTimeRangeChange?.(newTimeRange);
  };

  // Navigation handlers
//   const handleAnalyticsNavigation = () => {
//     navigate("/admin/analytics");
//   };

//   const handleClassesNavigation = () => {
//     navigate("/admin/classes");
//   };

//   const handleSettingsNavigation = () => {
//     navigate("/admin/settings");
//   };

//   const handleStudentsNavigation = () => {
//     navigate("/admin/students");
//   };

  // Optional: Handle notifications (if you want to add notification functionality)
  const handleNotifications = () => {
    // You can implement notification logic here
    console.log("Notifications clicked");
  };

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Comprehensive performance insights and system analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F67280] focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            
            <button 
              onClick={() => navigate('/admin/analytics')}
              className="flex items-center space-x-2 py-2 px-4 rounded-lg text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
              style={{ backgroundColor: '#F67280' }}
            >
              <BarChart2 className="w-5 h-5" />
              <span>Advance Analytics</span>
            </button>

            <button 
              className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 hover:border-blue-300 transition-all duration-300 group relative transform hover:scale-110 hover:rotate-3 shadow-sm hover:shadow-lg"
              onClick={() => navigate('/admin/dashboard')}
              title="Manage Classes & Curriculum"
            >
              <LucideHome className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
            </button>

            <button 
              className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 hover:border-blue-300 transition-all duration-300 group relative transform hover:scale-110 hover:rotate-3 shadow-sm hover:shadow-lg"
              onClick={() => navigate('/admin/classes')}
              title="Manage Classes & Curriculum"
            >
              <GraduationCap className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
            </button>
            
            <button 
              className="p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 hover:border-green-300 transition-all duration-300 group relative transform hover:scale-110 hover:-rotate-3 shadow-sm hover:shadow-lg"
              onClick={() => navigate('/admin/students')}
              title="Student Management & Analytics"
            >
              <User className="w-5 h-5 text-green-600 group-hover:text-green-700 transition-colors duration-300" />
            </button>
            
            <button 
              className="p-3 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 border border-purple-200 hover:border-purple-300 transition-all duration-300 group relative transform hover:scale-110 hover:rotate-3 shadow-sm hover:shadow-lg"
              title="Download Reports & Export Data"
            >
              <Download className="w-5 h-5 text-purple-600 group-hover:text-purple-700 transition-colors duration-300" />
            </button>
            
            <button 
              className="p-3 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 border border-orange-200 hover:border-orange-300 transition-all duration-300 group relative transform hover:scale-110 hover:-rotate-3 shadow-sm hover:shadow-lg"
              onClick={() => navigate('/admin/settings')}
              title="System Settings & Configuration"
            >
              <Settings className="w-5 h-5 text-orange-600 group-hover:text-orange-700 transition-colors duration-300" />
            </button>
          </div>
        </div>
      </div>
  );
};

export default AdminHeader;
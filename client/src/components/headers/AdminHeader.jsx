import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  TrendingDown,  Download,
  LucideHome,
  Menu,
  X,
  LogOut
} from "lucide-react";

const AdminHeader = () => {
  // State for time range selection
  const [selectedTimeRange, setSelectedTimeRange] = useState("today");
  
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  
  // Navigation hook
  const navigate = useNavigate();
  
  // Effect for handling clicks outside sidebar to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
              className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            
            <button 
              onClick={() => navigate('/admin/analytics')}
              className="flex items-center space-x-2 py-2 px-4 rounded-lg text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
              style={{ backgroundColor: '#000000' }}
            >
              <BarChart2 className="w-5 h-5" />
              <span>Advance Analytics</span>
            </button>
            
            {/* Hamburger Menu Button */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all duration-300 group transform hover:scale-110 shadow-sm hover:shadow-lg"
              title="Menu"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
        
        {/* Sidebar for navigation */}
        <div 
          ref={sidebarRef}
          className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transition-transform duration-300 transform z-50 ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Admin Menu</h2>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            
            <div className="flex flex-col space-y-3">              <Link
                to="/admin/dashboard"
                onClick={() => setIsSidebarOpen(false)}
                className="w-full flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 transition-all duration-300 group"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <LucideHome className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                </div>
                <span className="font-medium text-gray-700">Dashboard</span>
              </Link>
                <Link
                to="/admin/classes"
                onClick={() => setIsSidebarOpen(false)}
                className="w-full flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 transition-all duration-300 group"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <GraduationCap className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                </div>
                <span className="font-medium text-gray-700">Classes</span>
              </Link>
                <Link
                to="/admin/students"
                onClick={() => setIsSidebarOpen(false)}
                className="w-full flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 transition-all duration-300 group"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <User className="w-5 h-5 text-green-600 group-hover:text-green-700" />
                </div>
                <span className="font-medium text-gray-700">Students</span>
              </Link>
                <Link
                to="/admin/analytics"
                onClick={() => setIsSidebarOpen(false)}
                className="w-full flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 border border-purple-200 transition-all duration-300 group"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <BarChart2 className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
                </div>
                <span className="font-medium text-gray-700">Advanced Analytics</span>
              </Link>
                <Link
                to="/admin/reports"
                onClick={() => setIsSidebarOpen(false)}
                className="w-full flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 border border-purple-200 transition-all duration-300 group"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Download className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
                </div>
                <span className="font-medium text-gray-700">Reports</span>
              </Link>
                <Link
                to="/admin/settings"
                onClick={() => setIsSidebarOpen(false)}
                className="w-full flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 border border-orange-200 transition-all duration-300 group"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Settings className="w-5 h-5 text-orange-600 group-hover:text-orange-700" />
                </div>
                <span className="font-medium text-gray-700">Settings</span>
              </Link>
                <Link
                to="/signout"
                onClick={() => setIsSidebarOpen(false)}
                className="w-full flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 border border-red-200 transition-all duration-300 group mt-8"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <LogOut className="w-5 h-5 text-red-600 group-hover:text-red-700" />
                </div>
                <span className="font-medium text-gray-700">Sign Out</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AdminHeader;
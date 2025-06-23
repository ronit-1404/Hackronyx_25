import React from "react";
import { useState, useEffect, useRef } from "react";
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
  LucideHome,
  FileChartPie,
  Menu,
  X
} from "lucide-react";

const Header = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("today");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  // Close sidebar when clicking outside, but only if it's not the menu button being clicked
  useEffect(() => {
    function handleClickOutside(event) {
      const menuButton = document.querySelector('[aria-label="Toggle Navigation Menu"]');
      if (
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target) && 
        !menuButton?.contains(event.target) &&
        sidebarOpen
      ) {
        setSidebarOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);
  // We're no longer preventing main screen scrolling when sidebar is open
  // This allows users to continue interacting with the main content

  // Navigation links for the sidebar
  const navLinks = [

    { 
      title: "Home", 
      path: "/learner/home", 
      icon: <LucideHome className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />, 
      color: "from-blue-50 to-indigo-50" 
    },
  

    { 
      title: "Analytics Panel", 
      path: "/ana", 
      icon: <FileChartPie className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />, 
      color: "from-blue-50 to-indigo-50" 
    },
    
    { 
      title: "Learning Resources", 
      path: "/learner/resources", 
      icon: <FileText className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />, 
      color: "from-blue-50 to-indigo-50" 
    },
    {
      title:"Reports",
      path:"/learner/reports",
      icon: <FileText className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />,
      color: "from-blue-50 to-indigo-50"
    },
    { 
      title: "User Settings", 
      path: "/learner/settings", 
      icon: <Settings className="w-5 h-5 text-orange-600 group-hover:text-orange-700" />, 
      color: "from-orange-50 to-red-50" 
    },
    { 
      title: "Sign Out", 
      path: "/signout", 
      icon: <LogOut className="w-5 h-5 text-orange-600 group-hover:text-orange-700" />, 
      color: "from-orange-50 to-red-50" 
    }
  ];

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
        </button>        {/* Hamburger Menu Button */}
        <button 
          className="p-3 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-lg relative z-20"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {sidebarOpen ? 
            <X className="w-6 h-6 text-gray-700" /> : 
            <Menu className="w-6 h-6 text-gray-700" />
          }
        </button>

        {/* Sidebar */}        <div 
          ref={sidebarRef}
          className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl border-l border-gray-200 z-20 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex flex-col h-full p-6">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Brain className="w-6 h-6 mr-2" style={{ color: '#F67280' }} />
                Navigation
              </h2>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="flex-1 space-y-3">
              {navLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => {
                    navigate(link.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r ${link.color} hover:shadow-md transition-all duration-300 border border-gray-200 group`}
                >
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    {link.icon}
                  </div>
                  <span className="font-medium text-gray-700">{link.title}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-auto pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-500">
                <p>© {new Date().getFullYear()} AI Learning Coach</p>
                <p>Version 2.4.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

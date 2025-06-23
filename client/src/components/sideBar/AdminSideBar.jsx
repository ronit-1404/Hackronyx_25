import React, { useState, useEffect } from "react";
import {
  School,
  Globe,
  Users,
  BookOpen,
  Target,
  AlertCircle,
  RotateCcw,
  Activity,
  TrendingUp,
  Clock,
  Bell,
  Settings,
  RefreshCw
} from "lucide-react";

const AdminSideBar = () => {
  // State for current time
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // State for live data
  const [liveSnapshot, setLiveSnapshot] = useState({
    onlineNow: 147,
    enrolledStudents: 2485,
    activeClasses: 12,
    systemHealth: 98.5
  });

  // State for quick stats
  const [quickStats, setQuickStats] = useState({
    coursesRunning: 28,
    successRate: 87,
    avgConfusionRate: 23,
    totalAssignments: 156,
    completedToday: 89
  });

  // State for refresh functionality
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate real-time data updates
  useEffect(() => {
    const updateLiveData = () => {
      setLiveSnapshot(prev => ({
        ...prev,
        onlineNow: Math.floor(Math.random() * 50) + 120, // Random between 120-170
        activeClasses: Math.floor(Math.random() * 5) + 10, // Random between 10-15
        systemHealth: Math.random() * 5 + 95 // Random between 95-100
      }));
    };

    // Update live data every 30 seconds
    const liveDataInterval = setInterval(updateLiveData, 30000);
    return () => clearInterval(liveDataInterval);
  }, []);

  // Handle manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update all data
      setLiveSnapshot({
        onlineNow: Math.floor(Math.random() * 50) + 120,
        enrolledStudents: 2485 + Math.floor(Math.random() * 20),
        activeClasses: Math.floor(Math.random() * 5) + 10,
        systemHealth: Math.random() * 5 + 95
      });

      setQuickStats({
        coursesRunning: 28 + Math.floor(Math.random() * 5),
        successRate: Math.floor(Math.random() * 10) + 80,
        avgConfusionRate: Math.floor(Math.random() * 15) + 15,
        totalAssignments: 156 + Math.floor(Math.random() * 10),
        completedToday: Math.floor(Math.random() * 30) + 70
      });

      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const autoRefreshInterval = setInterval(() => {
      handleRefresh();
    }, 300000); // 5 minutes

    return () => clearInterval(autoRefreshInterval);
  }, []);

  // Get status color based on value
  const getStatusColor = (value, threshold = 80) => {
    if (value >= threshold) return 'text-green-600 bg-green-50';
    if (value >= threshold - 20) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  // Format time for last refresh
  const formatLastRefresh = () => {
    const now = new Date();
    const diff = Math.floor((now - lastRefresh) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div>
      <div
        className="w-80 h-screen fixed left-0 top-0 bg-white shadow-xl border-r border-gray-200 flex flex-col"
        style={{ zIndex: 20 }}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center space-x-3 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: "#000000" }}
            >
              <School className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
              <p className="text-xs text-gray-500">Learning Management</p>
            </div>
          </div>

          {/* Live Clock Widget */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
            <div className="text-center flex justify-center items-center space-x-2">
              <p className="text-xl font-bold text-gray-900">
                {currentTime.toLocaleTimeString()}
              </p>
              <p className="text-sm text-gray-600">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Live Status */}
          <div className="bg-gradient-to-b from-green-50 to-white rounded-xl p-5 border border-green-100">
            <div className="text-center mb-4">
              <div
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 relative"
                style={{ backgroundColor: "#10B981" }}
              >
                <Globe className="w-8 h-8 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">
                {liveSnapshot.onlineNow}
              </h3>
              <p className="text-sm text-gray-600">Students Online</p>
              <p className="text-xs text-green-600 mt-1">Live Now</p>
            </div>
          </div>

          {/* System Health Indicators */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  +12 today
                </span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {liveSnapshot.enrolledStudents.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">Total Enrolled</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  {liveSnapshot.activeClasses} active
                </span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {quickStats.coursesRunning}
                </p>
                <p className="text-xs text-gray-600">Running Courses</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <Target className="w-5 h-5 text-emerald-600" />
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(quickStats.successRate)}`}>
                  ↑5%
                </span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {quickStats.successRate}%
                </p>
                <p className="text-xs text-gray-600">Success Rate</p>
              </div>
              <div className="mt-3">
                <div className="h-1 bg-gray-200 rounded-full">
                  <div
                    className="h-1 rounded-full transition-all duration-500 bg-emerald-500"
                    style={{ width: `${quickStats.successRate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                  -3%
                </span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {quickStats.avgConfusionRate}%
                </p>
                <p className="text-xs text-gray-600">Avg Confusion</p>
              </div>
              <div className="mt-3">
                <div className="h-1 bg-gray-200 rounded-full">
                  <div
                    className="h-1 rounded-full transition-all duration-500 bg-orange-500"
                    style={{ width: `${quickStats.avgConfusionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700">Quick Actions</h4>
              <p className="text-xs text-gray-500">Updated {formatLastRefresh()}</p>
            </div>
            
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-white font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50"
              style={{ backgroundColor: '#000000' }}
            >
              <RotateCcw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
            </button>

            {/* System Health Status */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">System Health</span>
                </div>
                <span className="text-sm font-bold text-green-600">
                  {liveSnapshot.systemHealth.toFixed(1)}%
                </span>
              </div>
              <div className="mt-2">
                <div className="h-1 bg-gray-200 rounded-full">
                  <div
                    className="h-1 rounded-full transition-all duration-500 bg-green-500"
                    style={{ width: `${liveSnapshot.systemHealth}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSideBar;
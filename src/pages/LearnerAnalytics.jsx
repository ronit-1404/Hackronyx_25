import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { 
  Brain, 
  Eye, 
  TrendingUp, 
  Clock, 
  Target, 
  Activity,
  BarChart2,
  Calendar,
  Zap,
  Award,
  Filter,
  Download,
  Share2,
  RefreshCw,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Minus,
  ThermometerSun,
  Map,
  Grid3X3,
  Settings,
  User,
  Bell,
  Home
} from 'lucide-react';

const LearnerAnalytics = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('focus');
  const [hoveredCell, setHoveredCell] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Generate heatmap data for focus patterns
  const generateHeatmapData = () => {
    const hours = [];
    for (let i = 6; i <= 23; i++) {
      hours.push(i >= 12 ? `${i === 12 ? 12 : i - 12} PM` : `${i} AM`);
    }
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = [];
    
    hours.forEach((hour, hourIndex) => {
      const hourData = { hour };
      days.forEach(day => {
        // Simulate realistic focus patterns
        let value;
        if (hourIndex < 2 || hourIndex > 15) { // Early morning or late evening
          value = Math.floor(Math.random() * 3);
        } else if (hourIndex >= 2 && hourIndex <= 8) { // Peak morning hours
          value = Math.floor(Math.random() * 3) + 3;
        } else if (hourIndex >= 9 && hourIndex <= 12) { // Midday
          value = Math.floor(Math.random() * 4) + 2;
        } else { // Afternoon
          value = Math.floor(Math.random() * 4) + 1;
        }
        hourData[day] = value;
      });
      data.push(hourData);
    });
    
    return { data, days, hours };
  };

  const { data: heatmapData, days, hours } = generateHeatmapData();

  // Weekly focus trend data
  const weeklyTrendData = [
    { day: 'Mon', focus: 7.2, productivity: 85, mood: 4.2, engagement: 92 },
    { day: 'Tue', focus: 8.1, productivity: 88, mood: 4.5, engagement: 95 },
    { day: 'Wed', focus: 6.8, productivity: 79, mood: 3.9, engagement: 87 },
    { day: 'Thu', focus: 9.2, productivity: 94, mood: 4.8, engagement: 98 },
    { day: 'Fri', focus: 7.8, productivity: 82, mood: 4.1, engagement: 89 },
    { day: 'Sat', focus: 5.4, productivity: 65, mood: 3.5, engagement: 72 },
    { day: 'Sun', focus: 6.1, productivity: 71, mood: 3.8, engagement: 78 }
  ];

  // Learning activity distribution
  const activityData = [
    { name: 'Video Lectures', value: 35, color: '#F67280' },
    { name: 'Interactive Exercises', value: 28, color: '#C06C84' },
    { name: 'Reading Materials', value: 22, color: '#6C5B7B' },
    { name: 'Practice Tests', value: 10, color: '#355C7D' },
    { name: 'Discussion Forums', value: 5, color: '#2A4E6C' }
  ];

  // Performance radar data
  const performanceData = [
    { subject: 'Mathematics', score: 85, fullMark: 100 },
    { subject: 'Science', score: 92, fullMark: 100 },
    { subject: 'Literature', score: 78, fullMark: 100 },
    { subject: 'History', score: 88, fullMark: 100 },
    { subject: 'Languages', score: 94, fullMark: 100 },
    { subject: 'Arts', score: 76, fullMark: 100 }
  ];

  // Key metrics
  const keyMetrics = [
    { label: 'Avg Focus Score', value: '8.2', change: '+12%', trend: 'up', icon: Brain, color: 'blue' },
    { label: 'Learning Streak', value: '15', change: '+3 days', trend: 'up', icon: Zap, color: 'green' },
    { label: 'Productivity Rate', value: '87%', change: '+5%', trend: 'up', icon: TrendingUp, color: 'purple' },
    { label: 'Engagement Level', value: '92%', change: '-2%', trend: 'down', icon: Target, color: 'orange' }
  ];

  const getHeatmapColor = (value) => {
    if (value >= 5) return '#10B981'; // High focus - green
    if (value >= 3) return '#F59E0B'; // Medium focus - yellow
    if (value >= 1) return '#EF4444'; // Low focus - red
    return '#E5E7EB'; // No data - gray
  };

  const getHeatmapIntensity = (value) => {
    return Math.min(value / 5, 1);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F5EFE6' }}>
      {/* Sidebar */}
      <div className="w-80 h-screen fixed left-0 top-0 bg-white shadow-xl border-r border-gray-200 flex flex-col" style={{ zIndex: 20 }}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#F67280' }}>
              <BarChart2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Analytics Hub</h1>
              <p className="text-xs text-gray-500">Advanced Learning Insights</p>
            </div>
          </div>
          
          {/* Live Clock Widget */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{currentTime.toLocaleTimeString()}</p>
              <p className="text-sm text-gray-600">{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Quick Filters */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Quick Filters</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
              <select 
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F67280] focus:border-transparent"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Metric</label>
              <select 
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F67280] focus:border-transparent"
              >
                <option value="focus">Focus Score</option>
                <option value="productivity">Productivity</option>
                <option value="engagement">Engagement</option>
                <option value="mood">Mood</option>
              </select>
            </div>
          </div>

          {/* Key Metrics Summary */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Key Metrics</h3>
            {keyMetrics.map((metric, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className={`w-5 h-5 text-${metric.color}-600`} />
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    metric.trend === 'up' ? 'text-green-600 bg-green-50' : 
                    metric.trend === 'down' ? 'text-red-600 bg-red-50' : 
                    'text-gray-600 bg-gray-50'
                  }`}>
                    {metric.trend === 'up' && <ArrowUp className="w-3 h-3 inline mr-1" />}
                    {metric.trend === 'down' && <ArrowDown className="w-3 h-3 inline mr-1" />}
                    {metric.trend === 'stable' && <Minus className="w-3 h-3 inline mr-1" />}
                    {metric.change}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-xs text-gray-600">{metric.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
            <button className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all">
              <Share2 className="w-4 h-4" />
              <span>Share Insights</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-gray-100 shrink-0">
          <div className="flex space-x-2">
            <button className="flex-1 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
              <Home className="w-4 h-4 text-gray-600 mx-auto" />
            </button>
            <button className="flex-1 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
              <Settings className="w-4 h-4 text-gray-600 mx-auto" />
            </button>
            <button className="flex-1 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
              <User className="w-4 h-4 text-gray-600 mx-auto" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-80 h-screen overflow-y-auto">
        {/* Top Navigation Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Advanced Learning Analytics</h2>
            <p className="text-sm text-gray-600">Deep insights into your learning patterns and performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Refresh</span>
            </button>
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
              <Bell className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* Focus Heatmap - Full Width */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <ThermometerSun className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Focus Heatmap</h2>
                  <p className="text-sm text-gray-600">Hourly focus patterns throughout the week</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <span>Low</span>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 rounded-sm bg-gray-200"></div>
                    <div className="w-3 h-3 rounded-sm bg-red-300"></div>
                    <div className="w-3 h-3 rounded-sm bg-yellow-300"></div>
                    <div className="w-3 h-3 rounded-sm bg-green-300"></div>
                    <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                  </div>
                  <span>High</span>
                </div>
              </div>
            </div>
            
            {/* Custom Heatmap */}
            <div className="overflow-x-auto">
              <div className="min-w-full">
                {/* Days header */}
                <div className="flex mb-2">
                  <div className="w-16"></div>
                  {days.map(day => (
                    <div key={day} className="w-12 text-center text-xs font-medium text-gray-600 px-1">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Heatmap grid */}
                <div className="space-y-1">
                  {heatmapData.map((hourData, hourIndex) => (
                    <div key={hourIndex} className="flex items-center">
                      <div className="w-16 text-xs text-gray-600 text-right pr-2">
                        {hourData.hour}
                      </div>
                      {days.map(day => (
                        <div
                          key={`${hourIndex}-${day}`}
                          className="w-12 px-1"
                          onMouseEnter={() => setHoveredCell({ hour: hourData.hour, day, value: hourData[day] })}
                          onMouseLeave={() => setHoveredCell(null)}
                        >
                          <div
                            className="w-10 h-6 rounded-sm cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg flex items-center justify-center text-xs font-medium"
                            style={{
                              backgroundColor: getHeatmapColor(hourData[day]),
                              opacity: 0.3 + (getHeatmapIntensity(hourData[day]) * 0.7),
                              color: hourData[day] >= 3 ? 'white' : '#374151'
                            }}
                          >
                            {hourData[day]}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Heatmap tooltip */}
            {hoveredCell && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{hoveredCell.day} at {hoveredCell.hour}:</span> Focus Score {hoveredCell.value}/5
                </p>
              </div>
            )}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Weekly Trend */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <TrendingUp className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Weekly Trends</h2>
                  <p className="text-sm text-gray-600">Focus and productivity over time</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '12px', 
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                    }} 
                  />
                  <Area type="monotone" dataKey="focus" stackId="1" stroke="#F67280" fill="#F67280" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="productivity" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Learning Activity Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Grid3X3 className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Activity Distribution</h2>
                  <p className="text-sm text-gray-600">How you spend your learning time</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={activityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {activityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '12px', 
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance Radar Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center mb-6">
              <Target className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Subject Performance Radar</h2>
                <p className="text-sm text-gray-600">Comprehensive view of your academic strengths</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={performanceData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#64748b' }} />
                <PolarRadiusAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Radar
                  name="Performance"
                  dataKey="score"
                  stroke="#F67280"
                  fill="#F67280"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '12px', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                  }} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Insights and Recommendations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Brain className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">AI-Powered Insights</h2>
                <p className="text-sm text-gray-600">Personalized recommendations based on your learning patterns</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-blue-100">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-800 text-lg mb-2">Peak Focus Time</h3>
                    <p className="text-blue-700 text-sm">Your optimal learning window is 10-11 AM on weekdays. Schedule challenging topics during this time.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-green-100">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-800 text-lg mb-2">Improvement Area</h3>
                    <p className="text-green-700 text-sm">Focus on Literature and Arts subjects. Consider interactive exercises to boost engagement.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-purple-100">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-purple-800 text-lg mb-2">Streak Opportunity</h3>
                    <p className="text-purple-700 text-sm">You're 3 days away from a 30-day learning streak! Keep up the momentum.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerAnalytics;

// import React from "react";

// const LearnerAnalytics = () => (
//   <div>
//     <h1>Hello Analytics</h1>
//   </div>
// );

// export default LearnerAnalytics;
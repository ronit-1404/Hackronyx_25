import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { 
  Brain, 
  Eye, 
  TrendingUp, 
  Clock, 
  FileText,
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
  Home,
  LogOut
} from 'lucide-react';

const LearnerAnalytics = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('focus');
  const [hoveredCell, setHoveredCell] = useState(null);

  const navigate = useNavigate();

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

  // Weekly Engagement vs Personal Benchmark data
  const engagementBenchmarkData = [
    { week: 'Week 1', avgEngagement: 78, personalBenchmark: 85 },
    { week: 'Week 2', avgEngagement: 82, personalBenchmark: 85 },
    { week: 'Week 3', avgEngagement: 88, personalBenchmark: 85 },
    { week: 'Week 4', avgEngagement: 91, personalBenchmark: 85 },
    { week: 'Week 5', avgEngagement: 85, personalBenchmark: 85 },
    { week: 'Week 6', avgEngagement: 93, personalBenchmark: 85 },
    { week: 'Week 7', avgEngagement: 89, personalBenchmark: 85 },
    { week: 'Week 8', avgEngagement: 95, personalBenchmark: 85 }
  ];

  // Updated Learning activity distribution
  const activityData = [
    { name: 'Social Media', value: 35, color: '#F67280' },
    { name: 'Course Platform', value: 45, color: '#C06C84' },
    { name: 'Video Lecture', value: 20, color: '#6C5B7B' }
  ];

  // Updated Performance radar data - Your Focus vs Peer Median
  const performanceData = [
    { subject: 'Mathematics', yourFocus: 85, peerMedian: 78, fullMark: 100 },
    { subject: 'Science', yourFocus: 92, peerMedian: 84, fullMark: 100 },
    { subject: 'Literature', yourFocus: 78, peerMedian: 82, fullMark: 100 },
    { subject: 'History', yourFocus: 88, peerMedian: 79, fullMark: 100 },
    { subject: 'Languages', yourFocus: 94, peerMedian: 87, fullMark: 100 },
    { subject: 'Arts', yourFocus: 76, peerMedian: 81, fullMark: 100 }
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
            {/* <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Refresh</span>
            </button> */}
            <button 
              onClick={() => navigate('/learner/analytics')}
              className="flex items-center space-x-2 py-2 px-4 rounded-lg text-white font-medium transition-all shadow-sm hover:shadow-md"
              style={{ backgroundColor: '#F67280' }}
            >
              <BarChart2 className="w-5 h-5" />
              <span>Detailed Analysis</span>
            </button>
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => navigate('/learner/resources')}
            >
              <FileText className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => navigate('/learner/settings')}
            >
              <Settings className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => navigate('/signout')}
            >
              <LogOut className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

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
            
            {/* Custom Heatmap - Horizontal Layout */}
            <div className="overflow-x-auto">
              <div className="min-w-full">
                {/* Days header */}
                <div className="flex mb-2">
                  <div className="w-20"></div>
                  {days.map(day => (
                    <div key={day} className="w-20 text-center text-sm font-medium text-gray-600 px-1">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Heatmap grid */}
                <div className="space-y-1">
                  {heatmapData.map((hourData, hourIndex) => (
                    <div key={hourIndex} className="flex items-center">
                      <div className="w-20 text-xs text-gray-600 text-right pr-3 font-medium">
                        {hourData.hour}
                      </div>
                      {days.map(day => (
                        <div
                          key={`${hourIndex}-${day}`}
                          className="w-20 px-1"
                          onMouseEnter={() => setHoveredCell({ hour: hourData.hour, day, value: hourData[day] })}
                          onMouseLeave={() => setHoveredCell(null)}
                        >
                          <div
                            className="w-18 h-8 rounded-sm cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg flex items-center justify-center text-xs font-medium"
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
          {/* New Engagement vs Benchmark Line Chart - Full Width */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center mb-6">
              <Activity className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Weekly Engagement vs Personal Benchmark</h2>
                <p className="text-sm text-gray-600">Track your engagement scores against your personal targets</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={engagementBenchmarkData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} domain={[70, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '12px', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="avgEngagement" 
                  stroke="#F67280" 
                  strokeWidth={3}
                  dot={{ fill: '#F67280', strokeWidth: 2, r: 6 }}
                  name="Avg Engagement"
                />
                <Line 
                  type="monotone" 
                  dataKey="personalBenchmark" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  name="Personal Benchmark"
                />
              </LineChart>
            </ResponsiveContainer>
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

            {/* Updated Learning Activity Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Grid3X3 className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Activity Distribution</h2>
                  <p className="text-sm text-gray-600">How you spend your digital learning time</p>
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

          {/* Updated Performance Radar Chart - Your Focus vs Peer Median */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center mb-6">
              <Target className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Your Focus vs Peer Median</h2>
                <p className="text-sm text-gray-600">Compare your focus scores with peer performance across subjects</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={performanceData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#64748b' }} />
                <PolarRadiusAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Radar
                  name="Your Focus"
                  dataKey="yourFocus"
                  stroke="#F67280"
                  fill="#F67280"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Peer Median"
                  dataKey="peerMedian"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.2}
                  strokeWidth={2}
                  strokeDasharray="5 5"
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

          {/* Content Analysis */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Eye className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Content Analysis</h2>
                <p className="text-sm text-gray-600">Deep dive into learning patterns and resource effectiveness</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Struggle Zones */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Struggle Zones</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Video timestamps</span>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-red-800">Calculus: Derivatives</span>
                      <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">3 pauses</span>
                    </div>
                    <div className="text-xs text-red-700 space-y-1">
                      <div className="flex justify-between">
                        <span>• Paused at 4:23 (15 seconds)</span>
                        <span className="text-red-500">Rewatched 2x</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Paused at 7:41 (8 seconds)</span>
                        <span className="text-red-500">Rewatched 1x</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Paused at 12:15 (22 seconds)</span>
                        <span className="text-red-500">Rewatched 3x</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-yellow-800">Physics: Quantum Mechanics</span>
                      <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">2 pauses</span>
                    </div>
                    <div className="text-xs text-yellow-700 space-y-1">
                      <div className="flex justify-between">
                        <span>• Paused at 9:12 (12 seconds)</span>
                        <span className="text-yellow-600">Rewatched 1x</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Paused at 15:30 (6 seconds)</span>
                        <span className="text-yellow-600">Rewatched 2x</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-orange-800">Chemistry: Organic Reactions</span>
                      <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">1 pause</span>
                    </div>
                    <div className="text-xs text-orange-700">
                      <div className="flex justify-between">
                        <span>• Paused at 6:45 (9 seconds)</span>
                        <span className="text-orange-600">Rewatched 1x</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Resource Effectiveness */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Resource Effectiveness</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Engagement rates</span>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">Videos</span>
                      <span className="text-lg font-bold text-gray-900">70%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Good retention, consider interactive elements</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">Articles</span>
                      <span className="text-lg font-bold text-gray-900">60%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Moderate engagement, try shorter formats</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">Quizzes</span>
                      <span className="text-lg font-bold text-gray-900">80%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Excellent performance, increase frequency</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">Interactive Labs</span>
                      <span className="text-lg font-bold text-gray-900">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Outstanding results, preferred learning method</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">Flashcards</span>
                      <span className="text-lg font-bold text-gray-900">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Low effectiveness, consider alternatives</p>
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
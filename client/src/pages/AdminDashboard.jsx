import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
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
  TrendingDown
} from 'lucide-react';

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Enhanced mock data
  const liveSnapshot = {
    activeClasses: 12,
    enrolledStudents: 347,
    onlineNow: 89,
    avgEngagement: 82
  };

  const engagementHeatmap = [
    { day: 'Mon', score: 78, students: 45, interventions: 12 },
    { day: 'Tue', score: 82, students: 52, interventions: 8 },
    { day: 'Wed', score: 85, students: 48, interventions: 6 },
    { day: 'Thu', score: 88, students: 56, interventions: 4 },
    { day: 'Fri', score: 92, students: 61, interventions: 3 },
    { day: 'Sat', score: 75, students: 38, interventions: 15 },
    { day: 'Sun', score: 70, students: 29, interventions: 18 },
  ];

  const emotionDistribution = [
    { name: 'Focused', value: 45, color: '#10B981' },
    { name: 'Confused', value: 25, color: '#F59E0B' },
    { name: 'Engaged', value: 20, color: '#3B82F6' },
    { name: 'Frustrated', value: 10, color: '#EF4444' }
  ];

  const interventionData = [
    { name: 'Break Reminder', count: 156, success: 89 },
    { name: 'Concept Review', count: 134, success: 76 },
    { name: 'Focus Helper', count: 98, success: 82 },
    { name: 'Study Group', count: 67, success: 94 },
    { name: 'Motivational', count: 45, success: 88 }
  ];

  const performanceTrend = [
    { time: '09:00', engagement: 65, confusion: 25, productivity: 70 },
    { time: '10:00', engagement: 72, confusion: 20, productivity: 75 },
    { time: '11:00', engagement: 85, confusion: 15, productivity: 82 },
    { time: '12:00', engagement: 78, confusion: 18, productivity: 78 },
    { time: '13:00', engagement: 68, confusion: 22, productivity: 72 },
    { time: '14:00', engagement: 82, confusion: 12, productivity: 85 },
    { time: '15:00', engagement: 88, confusion: 8, productivity: 90 },
    { time: '16:00', engagement: 85, confusion: 10, productivity: 87 }
  ];

  const quickStats = {
    totalStudents: 347,
    avgConfusionRate: 12,
    mostUsedIntervention: 'Break Reminder',
    successRate: 84,
    activeInstructors: 24,
    coursesRunning: 18
  };

  const getHeatmapColor = (score) => {
    if (score >= 85) return '#10B981'; // Green
    if (score >= 75) return '#F59E0B'; // Yellow
    if (score >= 65) return '#F97316'; // Orange
    return '#EF4444'; // Red
  };

  const getEmotionIcon = (emotion) => {
    switch(emotion.toLowerCase()) {
      case 'focused': return <Brain className="w-4 h-4" />;
      case 'confused': return <HelpCircle className="w-4 h-4" />;
      case 'engaged': return <Zap className="w-4 h-4" />;
      case 'frustrated': return <XCircle className="w-4 h-4" />;
      default: return <Smile className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F5EFE6' }}>
      {/* Enhanced Sidebar */}
      <div className="w-80 h-screen fixed left-0 top-0 bg-white shadow-xl border-r border-gray-200 flex flex-col" style={{ zIndex: 20 }}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#F67280' }}>
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
              <p className="text-xl font-bold text-gray-900">{currentTime.toLocaleTimeString()}</p>
              <p className="text-sm text-gray-600">{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Live Status */}
          <div className="bg-gradient-to-b from-green-50 to-white rounded-xl p-5 border border-green-100">
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 relative" style={{ backgroundColor: '#10B981' }}>
                <Globe className="w-8 h-8 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{liveSnapshot.onlineNow}</h3>
              <p className="text-sm text-gray-600">Students Online</p>
              <p className="text-xs text-green-600 mt-1">Live Now</p>
            </div>
          </div>

          {/* System Health Indicators */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">+12 today</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{liveSnapshot.enrolledStudents}</p>
                <p className="text-xs text-gray-600">Total Enrolled</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{liveSnapshot.activeClasses} active</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{quickStats.coursesRunning}</p>
                <p className="text-xs text-gray-600">Running Courses</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <Target className="w-5 h-5 text-emerald-600" />
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">↑5%</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{quickStats.successRate}%</p>
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
                <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">-3%</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{quickStats.avgConfusionRate}%</p>
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
            <h4 className="text-sm font-semibold text-gray-700">Quick Actions</h4>
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-white font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50"
              style={{ backgroundColor: '#F67280' }}
            >
              <RotateCcw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-80 h-screen overflow-y-auto">
        {/* Top Navigation Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Learning Management Dashboard</h2>
            <p className="text-sm text-gray-600">Real-time system overview and student analytics</p>
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
              <option value="semester">This Semester</option>
            </select>
            <button 
              className="flex items-center space-x-2 py-2 px-4 rounded-lg text-white font-medium transition-all shadow-sm hover:shadow-md"
              style={{ backgroundColor: '#F67280' }}
              onClick={() => navigate('/admin/analytics')}
            >
              <BarChart2 className="w-5 h-5" />
              <span>Detailed Analysis</span>
            </button>
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => navigate('/admin/classes')}
            >
              <GraduationCap className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => navigate('/admin/settings')}
            >
              <Settings className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => navigate('/admin/students')}
            >
              <User className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
          {/* Real-time Performance Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Activity className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
                <h2 className="text-xl font-semibold text-gray-900">Real-time Performance Metrics</h2>
              </div>
              <div className="flex space-x-2">
                {['overview', 'engagement', 'interventions'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab 
                        ? 'bg-[#F67280] text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                <Area type="monotone" dataKey="engagement" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                <Area type="monotone" dataKey="productivity" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                <Area type="monotone" dataKey="confusion" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Enhanced Engagement Heatmap */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center mb-6">
              <Calendar className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
              <h2 className="text-xl font-semibold text-gray-900">Weekly Engagement Heatmap</h2>
            </div>
            <div className="grid grid-cols-7 gap-4">
              {engagementHeatmap.map((day) => (
                <div key={day.day} className="text-center">
                  <div className="mb-2">
                    <div
                      className="w-16 h-16 mx-auto rounded-xl flex flex-col items-center justify-center text-white font-bold shadow-lg transition-all hover:scale-105 cursor-pointer"
                      style={{ backgroundColor: getHeatmapColor(day.score) }}
                    >
                      <span className="text-lg">{day.score}</span>
                      <span className="text-xs opacity-90">pts</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{day.day}</h3>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex items-center justify-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{day.students}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{day.interventions}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Split Layout for Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Emotion Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Brain className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
                <h2 className="text-xl font-semibold text-gray-900">Student Emotion Distribution</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie 
                    data={emotionDistribution} 
                    cx="50%" 
                    cy="50%" 
                    labelLine={false} 
                    label={({ name, value }) => `${name}: ${value}%`} 
                    outerRadius={100} 
                    fill="#8884d8" 
                    dataKey="value"
                  >
                    {emotionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* AI Intervention Performance */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Zap className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
                <h2 className="text-xl font-semibold text-gray-900">AI Intervention Success Rate</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={interventionData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={12} />
                  <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} width={80} />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                  <Bar dataKey="success" fill="#F67280" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Brain className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
              <h2 className="text-xl font-semibold text-gray-900">System Recommendations</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="relative bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-200 hover:shadow-lg transition-all">
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-red-100">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-800 text-lg mb-2">High Confusion Alert</h3>
                    <p className="text-red-700 text-sm leading-relaxed">Advanced Calculus course showing 28% confusion rate. Recommend additional TA support.</p>
                    <div className="mt-4">
                      <span className="text-xs text-red-600 bg-red-100 px-3 py-1 rounded-full">Urgent</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-all">
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-blue-100">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-800 text-lg mb-2">Engagement Boost</h3>
                    <p className="text-blue-700 text-sm leading-relaxed">Data Structures course engagement up 15%. Consider replicating teaching methods.</p>
                    <div className="mt-4">
                      <span className="text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full">Opportunity</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-all">
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-green-100">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-800 text-lg mb-2">System Optimization</h3>
                    <p className="text-green-700 text-sm leading-relaxed">AI intervention success rate at 84%. System performing optimally across all metrics.</p>
                    <div className="mt-4">
                      <span className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full">Excellent</span>
                    </div>
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

export default AdminDashboard;
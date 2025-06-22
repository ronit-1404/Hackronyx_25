import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  BookOpen, 
  Target, 
  Activity,
  Award,
  AlertTriangle,
  CheckCircle,
  Brain,
  Eye,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Clock,
  BarChart3,
  Settings,
  Bell,
  Search,
  Crown,
  User,
  GraduationCap,
  Lightbulb,
  Shield,
  Zap
} from 'lucide-react';

const AdminAnalytics = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');
  const [selectedView, setSelectedView] = useState('overview');
  const [animationKey, setAnimationKey] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Enhanced data with more details
  const topPerformers = [
    { 
      name: "Aarav Sharma", 
      score: 98, 
      class: "Math XII A", 
      improvement: "+5%", 
      streak: 15,
      avatar: "AS",
      subjects: ["Mathematics", "Physics"],
      totalTests: 24,
      rank: 1
    },
    { 
      name: "Priya Singh", 
      score: 95, 
      class: "Physics XI B", 
      improvement: "+8%", 
      streak: 12,
      avatar: "PS",
      subjects: ["Physics", "Chemistry"],
      totalTests: 22,
      rank: 2
    },
    { 
      name: "Arjun Kumar", 
      score: 94, 
      class: "Chem XII C", 
      improvement: "+3%", 
      streak: 10,
      avatar: "AK",
      subjects: ["Chemistry", "Biology"],
      totalTests: 20,
      rank: 3
    },
    { 
      name: "Ananya Patel", 
      score: 92, 
      class: "Bio XII A", 
      improvement: "+12%", 
      streak: 8,
      avatar: "AP",
      subjects: ["Biology", "Chemistry"],
      totalTests: 25,
      rank: 4
    }
  ];

  const bottomPerformers = [
    { 
      name: "Rohan Patel", 
      score: 60, 
      class: "Math X A", 
      decline: "-2%", 
      missedTests: 3,
      avatar: "RP",
      subjects: ["Mathematics"],
      needsHelp: ["Algebra", "Geometry"],
      lastActive: "2 days ago"
    },
    { 
      name: "Sneha Verma", 
      score: 58, 
      class: "Physics XI B", 
      decline: "-5%", 
      missedTests: 5,
      avatar: "SV",
      subjects: ["Physics"],
      needsHelp: ["Mechanics", "Waves"],
      lastActive: "3 days ago"
    },
    { 
      name: "Karan Singh", 
      score: 55, 
      class: "Chem XI A", 
      decline: "-3%", 
      missedTests: 4,
      avatar: "KS",
      subjects: ["Chemistry"],
      needsHelp: ["Organic Chemistry"],
      lastActive: "1 day ago"
    }
  ];

  const demographics = [
    { group: "Grade 10", count: 40, color: "#F67280", engagement: 78 },
    { group: "Grade 11", count: 35, color: "#10B981", engagement: 82 },
    { group: "Grade 12", count: 25, color: "#F59E0B", engagement: 85 },
  ];

  const contentInsights = [
    { 
      lecture: "Algebra Basics", 
      effectiveness: "Low", 
      score: 65, 
      views: 120, 
      completionRate: 68,
      avgWatchTime: "12 min",
      difficulty: "Medium",
      feedback: 3.2
    },
    { 
      lecture: "Calculus I", 
      effectiveness: "High", 
      score: 89, 
      views: 95, 
      completionRate: 92,
      avgWatchTime: "18 min",
      difficulty: "Hard",
      feedback: 4.6
    },
    { 
      lecture: "Physics Mechanics", 
      effectiveness: "Medium", 
      score: 76, 
      views: 110, 
      completionRate: 78,
      avgWatchTime: "15 min",
      difficulty: "Medium",
      feedback: 4.1
    },
    { 
      lecture: "Organic Chemistry", 
      effectiveness: "High", 
      score: 91, 
      views: 88, 
      completionRate: 89,
      avgWatchTime: "20 min",
      difficulty: "Hard",
      feedback: 4.5
    }
  ];

  const systemStats = {
    interventionSuccess: 85,
    falsePositives: 3,
    totalInterventions: 127,
    avgResponseTime: "2.3 min",
    userSatisfaction: 4.7,
    systemUptime: 99.8
  };

  const performanceData = [
    { month: 'Jan', topAvg: 92, bottomAvg: 58, overall: 75 },
    { month: 'Feb', topAvg: 94, bottomAvg: 61, overall: 77 },
    { month: 'Mar', topAvg: 96, bottomAvg: 59, overall: 78 },
    { month: 'Apr', topAvg: 95, bottomAvg: 62, overall: 79 },
    { month: 'May', topAvg: 97, bottomAvg: 64, overall: 81 },
    { month: 'Jun', topAvg: 98, bottomAvg: 60, overall: 82 }
  ];

  const radarData = [
    { subject: 'Math', A: 95, B: 60, fullMark: 100 },
    { subject: 'Physics', A: 92, B: 58, fullMark: 100 },
    { subject: 'Chemistry', A: 88, B: 65, fullMark: 100 },
    { subject: 'Biology', A: 90, B: 62, fullMark: 100 },
  ];

  const pieColors = ['#F67280', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4'];

  const refreshData = () => {
    setAnimationKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5EFE6' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
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
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg px-4 py-2 w-[220px]">
              <div className="text-sm font-medium text-gray-900 whitespace-nowrap text-center">
                {currentTime.toLocaleTimeString()} • {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            </div>
            <button 
              onClick={refreshData}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
              <Download className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => navigate('/admin/settings')}
            >
              <Settings className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* System Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <Shield className="w-8 h-8 text-emerald-600" />
              <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Excellent</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{systemStats.interventionSuccess}%</p>
            <p className="text-sm text-gray-600">Success Rate</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Low</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{systemStats.falsePositives}%</p>
            <p className="text-sm text-gray-600">False Positives</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <Zap className="w-8 h-8 text-blue-600" />
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{systemStats.totalInterventions}</p>
            <p className="text-sm text-gray-600">Interventions</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <Clock className="w-8 h-8 text-purple-600" />
              <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Avg</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{systemStats.avgResponseTime}</p>
            <p className="text-sm text-gray-600">Response Time</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <Award className="w-8 h-8 text-orange-600" />
              <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Rating</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{systemStats.userSatisfaction}/5</p>
            <p className="text-sm text-gray-600">Satisfaction</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <Activity className="w-8 h-8 text-red-600" />
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Online</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{systemStats.systemUptime}%</p>
            <p className="text-sm text-gray-600">Uptime</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Top Performers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Crown className="w-6 h-6 text-yellow-600" />
                <h2 className="text-xl font-semibold text-gray-900">Top Performers</h2>
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="space-y-4">
              {topPerformers.map((student, index) => (
                <div key={student.name} className="flex items-center space-x-4 p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                      {student.avatar}
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {student.rank}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.class}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{student.improvement}</span>
                      <span className="text-xs text-gray-500">{student.streak} day streak</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">{student.score}%</p>
                    <p className="text-xs text-gray-500">{student.totalTests} tests</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Performers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-semibold text-gray-900">Needs Attention</h2>
              </div>
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div className="space-y-4">
              {bottomPerformers.map((student) => (
                <div key={student.name} className="flex items-center space-x-4 p-3 rounded-lg bg-gradient-to-r from-red-50 to-pink-50 border border-red-200">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                      {student.avatar}
                    </div>
                    {student.missedTests > 2 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        !
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.class}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">{student.decline}</span>
                      <span className="text-xs text-gray-500">{student.missedTests} missed</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Needs help: {student.needsHelp.join(', ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-red-600">{student.score}%</p>
                    <p className="text-xs text-gray-500">{student.lastActive}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demographics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Demographics</h2>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie 
                  data={demographics} 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={70} 
                  fill="#8884d8" 
                  dataKey="count"
                  label={({ group, count }) => `${group}: ${count}`}
                >
                  {demographics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 mt-4">
              {demographics.map((demo) => (
                <div key={demo.group} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: demo.color }}></div>
                    <span className="text-sm font-medium text-gray-700">{demo.group}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{demo.count} students</p>
                    <p className="text-xs text-gray-500">{demo.engagement}% engaged</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-6 h-6" style={{ color: '#F67280' }} />
              <h2 className="text-xl font-semibold text-gray-900">Performance Trends</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Top Performers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-600">Bottom Performers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F67280' }}></div>
                <span className="text-sm text-gray-600">Overall Average</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300} key={animationKey}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
              <Line type="monotone" dataKey="topAvg" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2, r: 5 }} />
              <Line type="monotone" dataKey="bottomAvg" stroke="#EF4444" strokeWidth={3} dot={{ fill: '#EF4444', strokeWidth: 2, r: 5 }} />
              <Line type="monotone" dataKey="overall" stroke="#F67280" strokeWidth={3} dot={{ fill: '#F67280', strokeWidth: 2, r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Content Insights and Subject Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Content Insights */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Lightbulb className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-semibold text-gray-900">Content Effectiveness</h2>
            </div>
            <div className="space-y-4">
              {contentInsights.map((content) => (
                <div key={content.lecture} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{content.lecture}</h3>
                      <p className="text-sm text-gray-600">Difficulty: {content.difficulty}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      content.effectiveness === 'High' ? 'bg-green-100 text-green-800' :
                      content.effectiveness === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {content.effectiveness}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Score: <span className="font-bold text-gray-900">{content.score}%</span></p>
                      <p className="text-gray-600">Views: <span className="font-bold text-gray-900">{content.views}</span></p>
                    </div>
                    <div>
                      <p className="text-gray-600">Completion: <span className="font-bold text-gray-900">{content.completionRate}%</span></p>
                      <p className="text-gray-600">Rating: <span className="font-bold text-gray-900">{content.feedback}/5</span></p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          content.effectiveness === 'High' ? 'bg-green-500' :
                          content.effectiveness === 'Medium' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${content.score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Performance Radar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Target className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Subject Performance</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={45} domain={[0, 100]} />
                <Radar name="Top Performers" dataKey="A" stroke="#10B981" fill="#10B981" fillOpacity={0.3} strokeWidth={2} />
                <Radar name="Bottom Performers" dataKey="B" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} strokeWidth={2} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Top Performers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-600">Bottom Performers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
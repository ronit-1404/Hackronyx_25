import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  MessageCircle, 
  TrendingUp, 
  AlertTriangle,
  Eye,
  Settings,
  Bell,
  Search,
  Filter,
  MoreVertical,
  UserCheck,
  Clock,
  Target,
  Activity,
  ChevronRight,
  Calendar,
  Award,
  Brain,
  BarChart2,
  GraduationCap,
  User,
  Download,
  BarChart3
} from 'lucide-react';
import AdminHeader from '../components/headers/AdminHeader';

const AdminClasses = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Enhanced class data with more detailed information
  const classData = [
    {
      id: 1,
      name: "Mathematics - X A",
      code: "MATH10A",
      enrolled: 32,
      avgEngagement: 87,
      activeAlerts: 2,
      teacher: "Mrs. Priya Sharma",
      schedule: "Mon, Wed, Fri - 9:00 AM",
      completionRate: 76,
      lastActivity: "2 hours ago",
      topicsCovered: 12,
      totalTopics: 16,
      averageScore: 78,
      status: "active",
      color: "#000000"
    },
    {
      id: 2,
      name: "Physics - XI B",
      code: "PHY11B",
      enrolled: 28,
      avgEngagement: 78,
      activeAlerts: 0,
      teacher: "Mr. Rajesh Kumar",
      schedule: "Tue, Thu, Sat - 10:30 AM",
      completionRate: 82,
      lastActivity: "45 minutes ago",
      topicsCovered: 8,
      totalTopics: 12,
      averageScore: 85,
      status: "active",
      color: "#10B981"
    },
    {
      id: 3,
      name: "Chemistry - XII C",
      code: "CHEM12C",
      enrolled: 25,
      avgEngagement: 82,
      activeAlerts: 1,
      teacher: "Dr. Meera Patel",
      schedule: "Mon, Wed, Fri - 2:00 PM",
      completionRate: 68,
      lastActivity: "1 hour ago",
      topicsCovered: 15,
      totalTopics: 18,
      averageScore: 72,
      status: "active",
      color: "#F59E0B"
    },
    {
      id: 4,
      name: "Biology - XII A",
      code: "BIO12A",
      enrolled: 30,
      avgEngagement: 91,
      activeAlerts: 0,
      teacher: "Mrs. Anita Singh",
      schedule: "Tue, Thu, Sat - 11:00 AM",
      completionRate: 89,
      lastActivity: "30 minutes ago",
      topicsCovered: 14,
      totalTopics: 16,
      averageScore: 88,
      status: "active",
      color: "#8B5CF6"
    }
  ];

  // Summary calculations
  const summary = {
    totalStudents: classData.reduce((sum, cls) => sum + cls.enrolled, 0),
    activeCourses: classData.filter(cls => cls.status === 'active').length,
    unansweredQueries: classData.reduce((sum, cls) => sum + cls.activeAlerts, 0),
    avgEngagement: Math.round(classData.reduce((sum, cls) => sum + cls.avgEngagement, 0) / classData.length)
  };

  // Filter classes based on search and filter
  const filteredClasses = classData.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cls.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cls.teacher.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'alerts' && cls.activeAlerts > 0) ||
                         (selectedFilter === 'high-engagement' && cls.avgEngagement >= 85);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5EFE6' }}>
      {/* Header */}
      <AdminHeader/>

      <div className="p-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Students */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#000000' }}>
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{summary.totalStudents}</p>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-xs text-gray-500 mt-1">Enrolled across all classes</p>
            </div>
          </div>

          {/* Active Courses */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Active</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{summary.activeCourses}</p>
              <p className="text-sm text-gray-600">Active Courses</p>
              <p className="text-xs text-gray-500 mt-1">Currently running</p>
            </div>
          </div>

          {/* Average Engagement */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">↑8%</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{summary.avgEngagement}%</p>
              <p className="text-sm text-gray-600">Avg Engagement</p>
              <p className="text-xs text-gray-500 mt-1">Across all classes</p>
            </div>
          </div>

          {/* Pending Queries */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${summary.unansweredQueries > 0 ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'}`}>
                {summary.unansweredQueries > 0 ? 'Needs Attention' : 'All Clear'}
              </span>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{summary.unansweredQueries}</p>
              <p className="text-sm text-gray-600">Pending Queries</p>
              <p className="text-xs text-gray-500 mt-1">Requiring response</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search classes, teachers, or codes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                >
                  <option value="all">All Classes</option>
                  <option value="alerts">With Alerts</option>
                  <option value="high-engagement">High Engagement (85%+)</option>
                </select>
              </div>
              <button 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium transition-all shadow-sm hover:shadow-md"
                style={{ backgroundColor: '#000000' }}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Class Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredClasses.map((cls) => (
            <div 
              key={cls.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setSelectedClass(selectedClass === cls.id ? null : cls.id)}
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: cls.color }}
                    >
                      {cls.code.substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{cls.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">Code: <span className="font-mono text-gray-800">{cls.code}</span></p>
                      <p className="text-sm text-gray-600">Teacher: {cls.teacher}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {cls.activeAlerts > 0 && (
                      <div className="flex items-center space-x-1 bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{cls.activeAlerts}</span>
                      </div>
                    )}
                    <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                {/* Quick Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 mx-auto mb-2">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">{cls.enrolled}</p>
                    <p className="text-xs text-gray-600">Students</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 mx-auto mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">{cls.avgEngagement}%</p>
                    <p className="text-xs text-gray-600">Engagement</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 mx-auto mb-2">
                      <Award className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">{cls.averageScore}%</p>
                    <p className="text-xs text-gray-600">Avg Score</p>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-4 mb-6">
                  {/* Course Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Course Progress</span>
                      <span className="font-medium text-gray-900">{cls.topicsCovered}/{cls.totalTopics} topics</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(cls.topicsCovered / cls.totalTopics) * 100}%`,
                          backgroundColor: cls.color
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Completion Rate */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Assignment Completion</span>
                      <span className="font-medium text-gray-900">{cls.completionRate}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${cls.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedClass === cls.id && (
                  <div className="border-t border-gray-100 pt-6 space-y-4 animate-in slide-in-from-top duration-300">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{cls.schedule}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Last activity: {cls.lastActivity}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button 
                        className="flex-1 py-2 px-4 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-4 h-4 inline mr-2" />
                        View Details
                      </button>
                      <button 
                        className="flex-1 py-2 px-4 rounded-lg text-white font-medium transition-all"
                        style={{ backgroundColor: cls.color }}
                      >
                        <Settings className="w-4 h-4 inline mr-2" />
                        Manage Class
                      </button>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Active</span>
                  </div>
                  <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    <span>More details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredClasses.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
              className="px-4 py-2 rounded-lg text-white font-medium transition-all"
              style={{ backgroundColor: '#000000' }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminClasses;
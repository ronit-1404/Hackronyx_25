import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
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
  Radar,
} from "recharts";
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
  XCircle,
  Shield,
  Zap,
  BarChart2,
} from "lucide-react";
import AdminHeader from "../components/headers/AdminHeader";
import TopPerformer from "../components/adminAnalytics/TopPerformer";
import BottomPerformer from "../components/adminAnalytics/BottomPerformer";
import Demograpghy from "../components/adminAnalytics/Demograpghy";
import SystemIntervention from "../components/adminAnalytics/SystemIntervention";
import ContentInsight from "../components/adminAnalytics/ContentInsight";
import PerformanceGraph from "../components/adminAnalytics/PerformanceGarph";

const AdminAnalytics = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimeRange, setSelectedTimeRange] = useState("month");
  const [selectedView, setSelectedView] = useState("overview");
  const [animationKey, setAnimationKey] = useState(0);

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
      rank: 1,
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
      rank: 2,
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
      rank: 3,
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
      rank: 4,
    },
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
      lastActive: "2 days ago",
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
      lastActive: "3 days ago",
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
      lastActive: "1 day ago",
    },
  ];

  const demographics = [
    { group: "Grade 10", count: 40, color: "#000000", engagement: 78 },
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
      feedback: 3.2,
    },
    {
      lecture: "Calculus I",
      effectiveness: "High",
      score: 89,
      views: 95,
      completionRate: 92,
      avgWatchTime: "18 min",
      difficulty: "Hard",
      feedback: 4.6,
    },
    {
      lecture: "Physics Mechanics",
      effectiveness: "Medium",
      score: 76,
      views: 110,
      completionRate: 78,
      avgWatchTime: "15 min",
      difficulty: "Medium",
      feedback: 4.1,
    },
    {
      lecture: "Organic Chemistry",
      effectiveness: "High",
      score: 91,
      views: 88,
      completionRate: 89,
      avgWatchTime: "20 min",
      difficulty: "Hard",
      feedback: 4.5,
    },
  ];

  const systemStats = {
    interventionSuccess: 85,
    falsePositives: 3,
    totalInterventions: 127,
    avgResponseTime: "2.3 min",
    userSatisfaction: 4.7,
    systemUptime: 99.8,
  };

  const performanceData = [
    { month: "Jan", topAvg: 92, bottomAvg: 58, overall: 75 },
    { month: "Feb", topAvg: 94, bottomAvg: 61, overall: 77 },
    { month: "Mar", topAvg: 96, bottomAvg: 59, overall: 78 },
    { month: "Apr", topAvg: 95, bottomAvg: 62, overall: 79 },
    { month: "May", topAvg: 97, bottomAvg: 64, overall: 81 },
    { month: "Jun", topAvg: 98, bottomAvg: 60, overall: 82 },
  ];

  const radarData = [
    { subject: "Math", A: 95, B: 60, fullMark: 100 },
    { subject: "Physics", A: 92, B: 58, fullMark: 100 },
    { subject: "Chemistry", A: 88, B: 65, fullMark: 100 },
    { subject: "Biology", A: 90, B: 62, fullMark: 100 },
  ];

  const pieColors = ["#000000", "#10B981", "#F59E0B", "#8B5CF6", "#06B6D4"];

  const refreshData = () => {
    setAnimationKey((prev) => prev + 1);
  };

  const mlModelData = [
    { month: "Jan", successRate: 82, falsePositives: 8, interventions: 45 },
    { month: "Feb", successRate: 84, falsePositives: 6, interventions: 52 },
    { month: "Mar", successRate: 87, falsePositives: 5, interventions: 48 },
    { month: "Apr", successRate: 89, falsePositives: 4, interventions: 61 },
    { month: "May", successRate: 91, falsePositives: 3, interventions: 58 },
    { month: "Jun", successRate: 93, falsePositives: 2, interventions: 67 },
  ];

  // Intervention Categories
  const interventionTypes = [
    { name: "Learning Difficulty", value: 35, color: "#EF4444" },
    { name: "Engagement Drop", value: 28, color: "#F59E0B" },
    { name: "Performance Decline", value: 22, color: "#8B5CF6" },
    { name: "Attendance Issues", value: 15, color: "#06B6D4" },
  ];

  // Real-time Intervention Success
  const interventionSuccess = [
    { time: "00:00", successful: 85, failed: 15 },
    { time: "04:00", successful: 88, failed: 12 },
    { time: "08:00", successful: 92, failed: 8 },
    { time: "12:00", successful: 89, failed: 11 },
    { time: "16:00", successful: 94, failed: 6 },
    { time: "20:00", successful: 91, failed: 9 },
  ];

  // False Positive Analysis

  const falsePositiveData = [
    {
      category: "Temporary Absence",
      count: 12,
      percentage: 40,
      description: "Student was absent due to illness/family emergency",
      examples: [
        "Medical appointments",
        "Family functions",
        "Weather conditions",
      ],
    },
    {
      category: "Technical Issues",
      count: 8,
      percentage: 27,
      description: "System or device connectivity problems",
      examples: ["Internet outage", "Device malfunction", "App crashes"],
    },
    {
      category: "External Factors",
      count: 6,
      percentage: 20,
      description: "Non-academic reasons affecting performance",
      examples: ["Home environment", "Personal stress", "Time zone changes"],
    },
    {
      category: "Data Anomalies",
      count: 4,
      percentage: 13,
      description: "Irregular data patterns or system errors",
      examples: ["Duplicate submissions", "Timestamp errors", "Cache issues"],
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5EFE6" }}>
      {/* Header */}
      <AdminHeader />

      <div className="p-8">
        {/* System Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <Shield className="w-8 h-8 text-emerald-600" />
              <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                Excellent
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {systemStats.interventionSuccess}%
            </p>
            <p className="text-sm text-gray-600">Success Rate</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Low
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {systemStats.falsePositives}%
            </p>
            <p className="text-sm text-gray-600">False Positives</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <Zap className="w-8 h-8 text-blue-600" />
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                Total
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {systemStats.totalInterventions}
            </p>
            <p className="text-sm text-gray-600">Interventions</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <Clock className="w-8 h-8 text-purple-600" />
              <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                Avg
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {systemStats.avgResponseTime}
            </p>
            <p className="text-sm text-gray-600">Response Time</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <Award className="w-8 h-8 text-orange-600" />
              <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                Rating
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {systemStats.userSatisfaction}/5
            </p>
            <p className="text-sm text-gray-600">Satisfaction</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <Activity className="w-8 h-8 text-red-600" />
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Online
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {systemStats.systemUptime}%
            </p>
            <p className="text-sm text-gray-600">Uptime</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Top Performers */}
          <TopPerformer />

          {/* Bottom Performers */}
          <BottomPerformer />

          {/* Demographics */}
          <Demograpghy />
        </div>
        {/* Performance Trend Chart */}
        <PerformanceGraph/>

        {/* Content Insights and Subject Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Content Insights */}
          <ContentInsight/>

          {/* Subject Performance Radar */}
          <SystemIntervention />
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;

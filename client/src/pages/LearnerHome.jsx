import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { 
  Brain, 
  Eye,
  GraduationCap,
  FileText, 
  TrendingUp, 
  Clock, 
  LogOut,
  Target, 
  Activity,
  Smile,
  Frown,
  Meh,
  AlertCircle,
  Coffee,
  BookOpen,
  Monitor,
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Timer,
  BarChart2,
  Settings,
  User,
  Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/headers/Header';
import SideBar from '../components/sideBar/SideBar';

const Dashboard2 = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Pomodoro Timer State
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Pomodoro Timer Effect
  useEffect(() => {
    let interval = null;
    if (isActive && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(time => time - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      // Timer finished
      if (!isBreak) {
        setPomodoroCount(count => count + 1);
        setIsBreak(true);
        setPomodoroTime(5 * 60); // 5 minute break
      } else {
        setIsBreak(false);
        setPomodoroTime(25 * 60); // Back to 25 minute work session
      }
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, pomodoroTime, isBreak]);

  const togglePomodoro = () => {
    setIsActive(!isActive);
  };

  const resetPomodoro = () => {
    setIsActive(false);
    setIsBreak(false);
    setPomodoroTime(25 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Mock data for demonstration
  const emotionTimelineData = [
    { time: '09:00', focused: 8, confused: 2, bored: 1, frustrated: 0, app: 'Course Platform' },
    { time: '09:30', focused: 6, confused: 4, bored: 2, frustrated: 1, app: 'Video Lecture' },
    { time: '10:00', focused: 9, confused: 1, bored: 0, frustrated: 0, app: 'Interactive Quiz' },
    { time: '10:30', focused: 4, confused: 6, bored: 3, frustrated: 2, app: 'Assignment Portal' },
    { time: '11:00', focused: 7, confused: 2, bored: 1, frustrated: 1, app: 'Study Materials' },
    { time: '11:30', focused: 3, confused: 2, bored: 7, frustrated: 3, app: 'Social Media' },
    { time: '12:00', focused: 8, confused: 1, bored: 0, frustrated: 0, app: 'Practice Lab' },
    { time: '12:30', focused: 9, confused: 0, bored: 0, frustrated: 0, app: 'Course Platform' },
  ];

  const productivityData = [
    { name: 'Course Platform', time: 240, productivity: 85 },
    { name: 'Video Lectures', time: 180, productivity: 78 },
    { name: 'Practice Labs', time: 120, productivity: 92 },
    { name: 'Social Media', time: 45, productivity: 25 },
    { name: 'Email', time: 30, productivity: 40 },
    { name: 'Other', time: 25, productivity: 35 },
  ];

  const emotionColors = {
    focused: '#10B981',
    confused: '#F59E0B',
    bored: '#6B7280',
    frustrated: '#EF4444'
  };

  const pieColors = ['#F67280', '#C06C84', '#6C5B7B', '#355C7D', '#2A4E6C', '#1B3951'];

  const currentEmotion = 'focused';
  const currentApp = 'Course Platform';
  const focusScore = 82;
  const todayProductivity = 78;

  const getEmotionIcon = (emotion) => {
    switch(emotion) {
      case 'focused': return <Brain className="w-5 h-5 text-emerald-600" />;
      case 'confused': return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'bored': return <Meh className="w-5 h-5 text-gray-600" />;
      case 'frustrated': return <Frown className="w-5 h-5 text-red-600" />;
      default: return <Smile className="w-5 h-5 text-blue-600" />;
    }
  };
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F5EFE6' }}>
      {/* Innovative Sidebar */}
      <SideBar/>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-80 h-screen overflow-y-auto">
        {/* Top Navigation Bar */}
        <Header/>
        <div className="flex-1 p-8 overflow-y-auto">
          {/* Emotion Timeline - Full Width */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center mb-6">
              <Activity className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
              <h2 className="text-xl font-semibold text-gray-900">Emotion Timeline Analysis</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={emotionTimelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                <Line type="monotone" dataKey="focused" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2, r: 5 }} activeDot={{ r: 7, stroke: '#10B981', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="confused" stroke="#F59E0B" strokeWidth={3} dot={{ fill: '#F59E0B', strokeWidth: 2, r: 5 }} activeDot={{ r: 7, stroke: '#F59E0B', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="bored" stroke="#6B7280" strokeWidth={3} dot={{ fill: '#6B7280', strokeWidth: 2, r: 5 }} activeDot={{ r: 7, stroke: '#6B7280', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="frustrated" stroke="#EF4444" strokeWidth={3} dot={{ fill: '#EF4444', strokeWidth: 2, r: 5 }} activeDot={{ r: 7, stroke: '#EF4444', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Split Layout for Pie Chart and Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* App Usage Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Monitor className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
                <h2 className="text-xl font-semibold text-gray-900">App Distribution</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={productivityData} cx="50%" cy="50%" labelLine={false} label={({ name, time }) => `${name}: ${time}m`} outerRadius={100} fill="#8884d8" dataKey="time">
                    {productivityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Productivity Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <BookOpen className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
                <h2 className="text-xl font-semibold text-gray-900">Productivity Metrics</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} angle={-35} textAnchor="end" height={80} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                  <Bar dataKey="productivity" fill="#F67280" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Recommendations - Horizontal Cards */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Brain className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
              <h2 className="text-xl font-semibold text-gray-900">AI-Powered Recommendations</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-all">
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-green-100">
                    <Coffee className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-800 text-lg mb-2">Take a Break</h3>
                    <p className="text-green-700 text-sm leading-relaxed">You've been focused for 2 hours. A 15-minute break will help maintain your productivity momentum.</p>
                    <div className="mt-4">
                      <span className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full">High Priority</span>
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
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-800 text-lg mb-2">Review Session</h3>
                    <p className="text-blue-700 text-sm leading-relaxed">Confusion patterns suggest reviewing Chapter 3 concepts before proceeding to new material.</p>
                    <div className="mt-4">
                      <span className="text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full">Medium Priority</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200 hover:shadow-lg transition-all">
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-purple-100">
                    <Headphones className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-purple-800 text-lg mb-2">Focus Enhancement</h3>
                    <p className="text-purple-700 text-sm leading-relaxed">Try ambient soundscapes to improve concentration during complex problem-solving tasks.</p>
                    <div className="mt-4">
                      <span className="text-xs text-purple-600 bg-purple-100 px-3 py-1 rounded-full">Suggestion</span>
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

export default Dashboard2;
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { 
  Brain, 
  Eye, 
  TrendingUp, 
  Clock, 
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
  Timer
} from 'lucide-react';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');
  
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

  const pieColors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  const currentEmotion = 'focused';
  const currentApp = 'Course Platform';
  const focusScore = 82;
  const todayProductivity = 78;

  const getEmotionIcon = (emotion) => {
    switch(emotion) {
      case 'focused': return <Brain className="w-5 h-5 text-green-500" />;
      case 'confused': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'bored': return <Meh className="w-5 h-5 text-gray-500" />;
      case 'frustrated': return <Frown className="w-5 h-5 text-red-500" />;
      default: return <Smile className="w-5 h-5 text-blue-500" />;
    }
  };

  const getEmotionGradient = (emotion) => {
    switch(emotion) {
      case 'focused': return 'from-green-400 to-emerald-600';
      case 'confused': return 'from-yellow-400 to-orange-600';
      case 'bored': return 'from-gray-400 to-gray-600';
      case 'frustrated': return 'from-red-400 to-red-600';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">AI Learning Coach</h1>
                <p className="text-purple-200">Intelligent Emotion & Productivity Tracker</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">{currentTime.toLocaleTimeString()}</p>
              <p className="text-purple-200 text-sm">{currentTime.toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Current Emotion */}
          <div className={`bg-gradient-to-r ${getEmotionGradient(currentEmotion)} p-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Current State</p>
                <p className="text-white text-2xl font-bold capitalize">{currentEmotion}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                {getEmotionIcon(currentEmotion)}
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-white/90 text-sm">
                <Monitor className="w-4 h-4 mr-2" />
                {currentApp}
              </div>
            </div>
          </div>

          {/* Pomodoro Timer */}
          <div className={`bg-gradient-to-r ${isBreak ? 'from-green-500 to-emerald-600' : 'from-red-500 to-pink-600'} p-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/80 text-sm font-medium">
                  {isBreak ? 'Break Time' : 'Focus Time'}
                </p>
                <p className="text-white text-2xl font-bold">{formatTime(pomodoroTime)}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Timer className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button 
                onClick={togglePomodoro}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all duration-200"
              >
                {isActive ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
              </button>
              <button 
                onClick={resetPomodoro}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4 text-white" />
              </button>
              <span className="text-white/90 text-sm">#{pomodoroCount}</span>
            </div>
          </div>

          {/* Focus Score */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Focus Score</p>
                <p className="text-white text-2xl font-bold">{focusScore}%</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Target className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-500"
                  style={{ width: `${focusScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Productivity */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Productivity</p>
                <p className="text-white text-2xl font-bold">{todayProductivity}%</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-white/90 text-sm">↑ 12% from yesterday</p>
            </div>
          </div>

          {/* Active Time */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Active Time</p>
                <p className="text-white text-2xl font-bold">6.5h</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-white/90 text-sm">Goal: 8h daily</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Emotion Timeline */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-purple-400" />
                Emotion Timeline
              </h2>
              <select 
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="bg-white/10 text-white rounded-lg px-3 py-1 text-sm border border-white/20"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={emotionTimelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="time" 
                  stroke="rgba(255,255,255,0.7)"
                  fontSize={12}
                />
                <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="focused" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="confused" 
                  stroke="#F59E0B" 
                  strokeWidth={3}
                  dot={{ fill: '#F59E0B', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="bored" 
                  stroke="#6B7280" 
                  strokeWidth={3}
                  dot={{ fill: '#6B7280', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="frustrated" 
                  stroke="#EF4444" 
                  strokeWidth={3}
                  dot={{ fill: '#EF4444', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* App Usage Distribution */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Monitor className="w-5 h-5 mr-2 text-cyan-400" />
              App Usage Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productivityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, time }) => `${name}: ${time}m`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="time"
                >
                  {productivityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Productivity Analysis */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl mb-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-green-400" />
            Productivity Analysis
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="rgba(255,255,255,0.7)"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Bar dataKey="productivity" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI Recommendations */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-400" />
            AI Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-500/20 rounded-xl p-4 border border-green-500/30">
              <div className="flex items-center mb-2">
                <Coffee className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-green-300 font-semibold">Take a Break</span>
              </div>
              <p className="text-white/80 text-sm">You've been focused for 2 hours. Consider a 15-minute break to maintain productivity.</p>
            </div>
            <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-500/30">
              <div className="flex items-center mb-2">
                <BookOpen className="w-5 h-5 text-blue-400 mr-2" />
                <span className="text-blue-300 font-semibold">Review Session</span>
              </div>
              <p className="text-white/80 text-sm">Based on confusion patterns, review Chapter 3 concepts before proceeding.</p>
            </div>
            <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-500/30">
              <div className="flex items-center mb-2">
                <Headphones className="w-5 h-5 text-purple-400 mr-2" />
                <span className="text-purple-300 font-semibold">Focus Music</span>
              </div>
              <p className="text-white/80 text-sm">Try ambient sounds to improve concentration during complex tasks.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
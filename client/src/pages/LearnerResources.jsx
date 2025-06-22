import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { 
  Brain, 
  Coffee, 
  BookOpen, 
  Target,
  Clock,
  BarChart2,
  LucideHome,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Bell,
  User,
  Monitor,
  LogOut
} from 'lucide-react';

const LearnerResources = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');
  
  // Pomodoro Timer State
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);

  const navigate = useNavigate();

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

  // AI Interventions and Suggestions
  const interventions = [
    {
      title: "Take a break",
      suggestion: "You've been focused for 2 hrs. Consider a 15 min break.",
      priority: "High Priority",
      icon: Coffee,
      color: "green",
      bgGradient: "from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      textColor: "text-green-800",
      descColor: "text-green-700",
      tagBg: "bg-green-100",
      tagColor: "text-green-600",
      pulseColor: "bg-green-500"
    },
    {
      title: "Review session",
      suggestion: "Based on confusion pattern, review Unit 3 concepts.",
      priority: "Medium Priority",
      icon: BookOpen,
      color: "blue",
      bgGradient: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      textColor: "text-blue-800",
      descColor: "text-blue-700",
      tagBg: "bg-blue-100",
      tagColor: "text-blue-600",
      pulseColor: "bg-blue-500"
    },
    {
      title: "Try a quiz",
      suggestion: "Test your understanding of today's topics with a quick quiz.",
      priority: "Suggestion",
      icon: Target,
      color: "purple",
      bgGradient: "from-purple-50 to-indigo-50",
      borderColor: "border-purple-200",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      textColor: "text-purple-800",
      descColor: "text-purple-700",
      tagBg: "bg-purple-100",
      tagColor: "text-purple-600",
      pulseColor: "bg-purple-500"
    },
  ];

  const focusScore = 82;
  const todayProductivity = 78;
  const currentApp = 'Course Platform';

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F5EFE6' }}>
      {/* Innovative Sidebar */}
      <div className="w-80 h-screen fixed left-0 top-0 bg-white shadow-xl border-r border-gray-200 flex flex-col" style={{ zIndex: 20 }}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#F67280' }}>
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Coach</h1>
              <p className="text-xs text-gray-500">Learning Resources</p>
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
          {/* Pomodoro Timer - Vertical Progress */}
          <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl p-5 border border-gray-100">
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: isBreak ? '#10B981' : '#F67280' }}>
                <Timer className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{formatTime(pomodoroTime)}</h3>
              <p className="text-sm text-gray-600">{isBreak ? 'Break Time' : 'Focus Session'}</p>
              <p className="text-xs text-gray-500 mt-1">Session #{pomodoroCount}</p>
            </div>
            
            {/* Vertical Progress Bar */}
            <div className="w-2 h-24 bg-gray-200 rounded-full mx-auto mb-4">
              <div 
                className="w-2 rounded-full transition-all duration-1000"
                style={{ 
                  height: `${((isBreak ? 5*60 : 25*60) - pomodoroTime) / (isBreak ? 5*60 : 25*60) * 100}%`,
                  backgroundColor: isBreak ? '#10B981' : '#F67280'
                }}
              ></div>
            </div>
            
            <div className="flex justify-center space-x-3">
              <button 
                onClick={togglePomodoro}
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all"
                style={{ 
                  borderColor: isBreak ? '#10B981' : '#F67280',
                  backgroundColor: isActive ? (isBreak ? '#10B981' : '#F67280') : 'white',
                  color: isActive ? 'white' : (isBreak ? '#10B981' : '#F67280')
                }}
              >
                {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button 
                onClick={resetPomodoro}
                className="w-10 h-10 rounded-full border-2 border-gray-300 bg-white text-gray-600 flex items-center justify-center hover:bg-gray-50 transition-all"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Current Status */}
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
                  <Brain className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#F67280' }}>
                ●
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Learning Mode</h3>
            <p className="text-sm text-gray-600">Active Learning</p>
            <div className="mt-2 flex items-center justify-center text-xs text-gray-500">
              <Monitor className="w-3 h-3 mr-1" />
              {currentApp}
            </div>
          </div>

          {/* Vertical Metrics List */}
          <div className="space-y-4">
            {/* Focus Score */}
            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">+5%</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{focusScore}%</p>
                <p className="text-xs text-gray-600">Focus Score</p>
              </div>
              <div className="mt-3">
                <div className="h-1 bg-gray-200 rounded-full">
                  <div 
                    className="h-1 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${focusScore}%`,
                      backgroundColor: '#F67280'
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Productivity */}
            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">↑12%</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{todayProductivity}%</p>
                <p className="text-xs text-gray-600">Productivity</p>
                <p className="text-xs text-gray-500">vs. yesterday</p>
              </div>
            </div>

            {/* Active Time */}
            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">6.5/8h</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">6.5h</p>
                <p className="text-xs text-gray-600">Active Time</p>
              </div>
              <div className="mt-3">
                <div className="h-1 bg-gray-200 rounded-full">
                  <div className="bg-orange-500 h-1 rounded-full transition-all duration-500" style={{ width: '81%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-80 h-screen overflow-y-auto">
        {/* Top Navigation Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Learner Resources</h2>
            <p className="text-sm text-gray-600">AI-powered learning interventions and suggestions</p>
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
              className="flex items-center space-x-2 py-2 px-4 rounded-lg text-white font-medium transition-all shadow-sm hover:shadow-md"
              style={{ backgroundColor: '#F67280' }}
            >
              <BarChart2 className="w-5 h-5" />
              <span>Detailed Analysis</span>
            </button>
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => navigate('/learner/home')}
            >
              <LucideHome className="w-4 h-4 text-gray-600" />
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
          {/* AI Interventions & Suggestions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Brain className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
              <h2 className="text-xl font-semibold text-gray-900">AI Learning Interventions</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {interventions.map((intervention, index) => {
                const IconComponent = intervention.icon;
                return (
                  <div key={index} className={`relative bg-gradient-to-br ${intervention.bgGradient} rounded-xl p-6 border ${intervention.borderColor} hover:shadow-lg transition-all`}>
                    <div className="absolute top-4 right-4">
                      <div className={`w-3 h-3 rounded-full ${intervention.pulseColor} ${intervention.priority === 'High Priority' ? 'animate-pulse' : ''}`}></div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl ${intervention.iconBg}`}>
                        <IconComponent className={`w-6 h-6 ${intervention.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${intervention.textColor} text-lg mb-2`}>{intervention.title}</h3>
                        <p className={`${intervention.descColor} text-sm leading-relaxed`}>{intervention.suggestion}</p>
                        <div className="mt-4">
                          <span className={`text-xs ${intervention.tagColor} ${intervention.tagBg} px-3 py-1 rounded-full`}>{intervention.priority}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Additional Resources Section */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Lightbulb className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
              <h2 className="text-xl font-semibold text-gray-900">Learning Tips & Resources</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-amber-100">
                    <CheckCircle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-amber-800 text-lg mb-2">Study Technique</h3>
                    <p className="text-amber-700 text-sm leading-relaxed">Use the Pomodoro Technique to maintain focus and prevent burnout during long study sessions.</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-teal-100">
                    <AlertCircle className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-teal-800 text-lg mb-2">Learning Insight</h3>
                    <p className="text-teal-700 text-sm leading-relaxed">Regular breaks and active recall improve retention by up to 40% compared to passive reading.</p>
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

export default LearnerResources;
import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Monitor, 
  Target, 
  TrendingUp, 
  Clock,
  Smile,
  Frown,
  Meh,
  Heart,
  Zap
} from 'lucide-react';

const SideBar = () => {
  // State variables
  const [currentTime, setCurrentTime] = useState(new Date());
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(1);
  const [currentEmotion, setCurrentEmotion] = useState('happy');
  const [currentApp, setCurrentApp] = useState('VS Code');
  const [focusScore, setFocusScore] = useState(85);
  const [todayProductivity, setTodayProductivity] = useState(92);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Pomodoro timer logic
  useEffect(() => {
    let interval = null;
    if (isActive && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(time => time - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      // Timer finished
      setIsActive(false);
      if (isBreak) {
        // Break finished, start new focus session
        setIsBreak(false);
        setPomodoroTime(25 * 60);
        setPomodoroCount(count => count + 1);
      } else {
        // Focus session finished, start break
        setIsBreak(true);
        setPomodoroTime(5 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, pomodoroTime, isBreak]);

  // Helper functions
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const togglePomodoro = () => {
    setIsActive(!isActive);
  };

  const resetPomodoro = () => {
    setIsActive(false);
    if (isBreak) {
      setPomodoroTime(5 * 60);
    } else {
      setPomodoroTime(25 * 60);
    }
  };

  const getEmotionIcon = (emotion) => {
    const iconProps = { className: "w-8 h-8", style: { color: '#F67280' } };
    switch (emotion) {
      case 'happy':
        return <Smile {...iconProps} />;
      case 'sad':
        return <Frown {...iconProps} />;
      case 'neutral':
        return <Meh {...iconProps} />;
      case 'excited':
        return <Zap {...iconProps} />;
      case 'loved':
        return <Heart {...iconProps} />;
      default:
        return <Smile {...iconProps} />;
    }
  };

  return (
    <div className="w-80 h-screen fixed left-0 top-0 bg-white shadow-xl border-r border-gray-200 flex flex-col" style={{ zIndex: 20 }}>
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-100 shrink-0">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#F67280' }}>
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Coach</h1>
            <p className="text-xs text-gray-500">Learning Analytics</p>
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
        
        {/* Current Emotion - Circular Design */}
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
                {getEmotionIcon(currentEmotion)}
              </div>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#F67280' }}>
              ●
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-900 capitalize">{currentEmotion}</h3>
          <p className="text-sm text-gray-600">Current Emotion</p>
          <div className="mt-2 flex items-center justify-center text-xs text-gray-500">
            <Monitor className="w-3 h-3 mr-1" />
            {currentApp}
          </div>
        </div>

        {/* Vertical Metrics List */}
        <div className="space-y-4">
          {/* Focus Score - Gauge Style */}
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

          {/* Productivity - Trend Style */}
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

          {/* Active Time - Clock Style */}
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

      {/* Sidebar Footer */}
      <div className="p-6 border-t border-gray-100 space-y-3 shrink-0">
        {/* Footer content can be added here */}
      </div>
    </div>
  );
};

export default SideBar;
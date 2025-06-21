import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Settings,
  User,
  Mail,
  Lock,
  Bell,
  Shield,
  Palette,
  Monitor,
  Volume2,
  Eye,
  Clock,
  Target,
  TrendingUp,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Save,
  Check,
  AlertCircle,
  Globe,
  Moon,
  Sun
} from 'lucide-react';

const LearnerSettings = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [email, setEmail] = useState("learner@school.edu");
  const [password, setPassword] = useState("");
  const [notif, setNotif] = useState(true);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  
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

  const handleSave = (e) => {
    e.preventDefault();
    alert("Settings saved (demo only)!");
  };

  const focusScore = 82;
  const todayProductivity = 78;
  const currentApp = 'Settings Panel';

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
              <p className="text-xs text-gray-500">Settings Panel</p>
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
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
                  <Settings className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#F67280' }}>
                ●
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Configuration</h3>
            <p className="text-sm text-gray-600">Settings Mode</p>
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
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            <p className="text-sm text-gray-600">Manage your learning preferences and account settings</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
              <Bell className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
              <Settings className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
              <User className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
          {/* Account Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center mb-6">
              <User className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
              <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F67280] focus:border-transparent"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Contact admin to change email</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Change Password
                  </label>
                  <input
                    type="password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F67280] focus:border-transparent"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center mb-6">
              <Bell className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
              <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive updates about your learning progress</p>
                  </div>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notif}
                    onChange={() => setNotif(!notif)}
                    className="sr-only"
                  />
                  <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notif ? 'bg-[#F67280]' : 'bg-gray-300'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notif ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Volume2 className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Sound Notifications</p>
                    <p className="text-sm text-gray-600">Play sounds for alerts and reminders</p>
                  </div>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={() => setSoundEnabled(!soundEnabled)}
                    className="sr-only"
                  />
                  <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${soundEnabled ? 'bg-[#F67280]' : 'bg-gray-300'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center mb-6">
              <Palette className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
              <h2 className="text-xl font-semibold text-gray-900">Preferences</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Palette className="w-4 h-4 inline mr-2" />
                  Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F67280] focus:border-transparent"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F67280] focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Save className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Auto-save</p>
                    <p className="text-sm text-gray-600">Automatically save your progress</p>
                  </div>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSave}
                    onChange={() => setAutoSave(!autoSave)}
                    className="sr-only"
                  />
                  <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoSave ? 'bg-[#F67280]' : 'bg-gray-300'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoSave ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Privacy Mode</p>
                    <p className="text-sm text-gray-600">Hide sensitive information in shared views</p>
                  </div>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyMode}
                    onChange={() => setPrivacyMode(!privacyMode)}
                    className="sr-only"
                  />
                  <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${privacyMode ? 'bg-[#F67280]' : 'bg-gray-300'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${privacyMode ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-3 rounded-lg text-white font-medium transition-all shadow-sm hover:shadow-md"
              style={{ backgroundColor: '#F67280' }}
            >
              <Save className="w-5 h-5" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerSettings;
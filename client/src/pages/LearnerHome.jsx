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
import Recommendation from '../components/learnerHome/Recommendation';
import ProductivityCharts from '../components/learnerHome/ProductivityCharts';
import EmotionTimelineAnalysis from '../components/learnerHome/EmotionTimeline';

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
          <EmotionTimelineAnalysis />

          {/* Split Layout for Pie Chart and Bar Chart */}
          <ProductivityCharts />

          {/* AI Recommendations - Horizontal Cards */}
          <Recommendation />
        </div>
      </div>
    </div>
  );
};

export default Dashboard2;
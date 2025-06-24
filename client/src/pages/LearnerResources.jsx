import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { motion, AnimatePresence } from 'framer-motion';
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
import Header from '../components/headers/Header';
import SideBar from '../components/sideBar/SideBar';

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

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const sidebarVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.2, 1],
      opacity: [1, 0.7, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.2
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.2
      }
    }
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
    <motion.div 
      className="min-h-screen flex" 
      style={{ backgroundColor: '#F5EFE6' }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Innovative Sidebar */}
      <motion.div variants={sidebarVariants}>
        <SideBar/>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-80 h-screen overflow-y-auto">
        {/* Top Navigation Bar */}
        <motion.div variants={headerVariants}>
          <Header/>
        </motion.div>

        <motion.div 
          className="flex-1 p-8 overflow-y-auto"
          variants={containerVariants}
        >
          {/* AI Interventions & Suggestions */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            variants={itemVariants}
          >
            <motion.div 
              className="flex items-center mb-6"
              variants={itemVariants}
            >
              <motion.div variants={iconVariants}>
                <Brain className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
              </motion.div>
              <h2 className="text-xl font-semibold text-gray-900">AI Learning Interventions</h2>
            </motion.div>
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              variants={containerVariants}
            >
              <AnimatePresence>
                {interventions.map((intervention, index) => {
                  const IconComponent = intervention.icon;
                  return (
                    <motion.div 
                      key={index} 
                      className={`relative bg-gradient-to-br ${intervention.bgGradient} rounded-xl p-6 border ${intervention.borderColor} hover:shadow-lg transition-all cursor-pointer`}
                      variants={cardVariants}
                      whileHover="hover"
                      layout
                    >
                      <div className="absolute top-4 right-4">
                        <motion.div 
                          className={`w-3 h-3 rounded-full ${intervention.pulseColor}`}
                          variants={intervention.priority === 'High Priority' ? pulseVariants : {}}
                          animate={intervention.priority === 'High Priority' ? "pulse" : ""}
                        />
                      </div>
                      <div className="flex items-start space-x-4">
                        <motion.div 
                          className={`p-3 rounded-xl ${intervention.iconBg}`}
                          variants={iconVariants}
                          whileHover="hover"
                        >
                          <IconComponent className={`w-6 h-6 ${intervention.iconColor}`} />
                        </motion.div>
                        <div className="flex-1">
                          <motion.h3 
                            className={`font-semibold ${intervention.textColor} text-lg mb-2`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                          >
                            {intervention.title}
                          </motion.h3>
                          <motion.p 
                            className={`${intervention.descColor} text-sm leading-relaxed`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                          >
                            {intervention.suggestion}
                          </motion.p>
                          <motion.div 
                            className="mt-4"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                          >
                            <span className={`text-xs ${intervention.tagColor} ${intervention.tagBg} px-3 py-1 rounded-full`}>
                              {intervention.priority}
                            </span>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Additional Resources Section */}
          <motion.div 
            className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            variants={itemVariants}
          >
            <motion.div 
              className="flex items-center mb-6"
              variants={itemVariants}
            >
              <motion.div variants={iconVariants}>
                <Lightbulb className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
              </motion.div>
              <h2 className="text-xl font-semibold text-gray-900">Learning Tips & Resources</h2>
            </motion.div>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={containerVariants}
            >
              <motion.div 
                className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200 cursor-pointer"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="flex items-start space-x-4">
                  <motion.div 
                    className="p-3 rounded-xl bg-amber-100"
                    variants={iconVariants}
                    whileHover="hover"
                  >
                    <CheckCircle className="w-6 h-6 text-amber-600" />
                  </motion.div>
                  <div className="flex-1">
                    <motion.h3 
                      className="font-semibold text-amber-800 text-lg mb-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      Study Technique
                    </motion.h3>
                    <motion.p 
                      className="text-amber-700 text-sm leading-relaxed"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      Use the Pomodoro Technique to maintain focus and prevent burnout during long study sessions.
                    </motion.p>
                  </div>
                </div>
              </motion.div>
              <motion.div 
                className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200 cursor-pointer"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="flex items-start space-x-4">
                  <motion.div 
                    className="p-3 rounded-xl bg-teal-100"
                    variants={iconVariants}
                    whileHover="hover"
                  >
                    <AlertCircle className="w-6 h-6 text-teal-600" />
                  </motion.div>
                  <div className="flex-1">
                    <motion.h3 
                      className="font-semibold text-teal-800 text-lg mb-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      Learning Insight
                    </motion.h3>
                    <motion.p 
                      className="text-teal-700 text-sm leading-relaxed"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                    >
                      Regular breaks and active recall improve retention by up to 40% compared to passive reading.
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LearnerResources;
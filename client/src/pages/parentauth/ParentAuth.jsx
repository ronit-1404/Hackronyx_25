import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowRight,
  AlertCircle,
  Github,
  Chrome,
  Loader,
  Shield,
  Zap,
  Target,
  BookOpen,
  Activity,
  BookOpen as Book,
  Music,
  Edit3,
  UserCircle
} from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" }
  })
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { delay: i * 0.1, duration: 0.3, ease: "easeOut" }
  })
};

const ParentAuth = () => {
  const [isSignUp, setIsSignUp] = useState(false); // Default to signin view
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferredWayOfLearning: ''
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const learningStyles = [
    { id: 'Visual', name: 'Visual', icon: <Eye className="w-5 h-5" />, description: 'Learn best through images, diagrams, and spatial understanding' },
    { id: 'Auditory', name: 'Auditory', icon: <Music className="w-5 h-5" />, description: 'Learn best through listening and speaking' },
    { id: 'Read/Write', name: 'Read/Write', icon: <Edit3 className="w-5 h-5" />, description: 'Learn best through reading and writing text' },
    { id: 'Kinaesthetic', name: 'Kinaesthetic', icon: <UserCircle className="w-5 h-5" />, description: 'Learn best through physical activities and hands-on experiences' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (apiError) setApiError(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (isSignUp && !formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (isSignUp && formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (isSignUp && !formData.preferredWayOfLearning) newErrors.preferredWayOfLearning = 'Please select your preferred learning style';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setApiError(null);
    try {
      let response;
      if (isSignUp) {
        response = await axios.post('http://localhost:5001/api/auth/user/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          preferredWayOfLearning: formData.preferredWayOfLearning
        });
      } else {
        response = await axios.post('http://localhost:5001/api/auth/user/login', {
          email: formData.email,
          password: formData.password
        });
      }
      if (response.data.success) {
        localStorage.setItem('sToken', response.data.sToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/parent/dashboard');
      } else {
        setApiError(response.data.message || 'Authentication failed');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setApiError(error.response.data.message || 'Authentication failed');
      } else {
        setApiError('Network error. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
    setApiError(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      preferredWayOfLearning: ''
    });
  };

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Analysis",
      description: "Advanced emotion detection using computer vision and machine learning"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Focus Optimization",
      description: "Personalized recommendations to improve concentration and productivity"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Feedback",
      description: "Instant insights and adaptive learning suggestions"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Privacy First",
      description: "Your data stays secure with end-to-end encryption"
    }
  ];
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5EFE6' }}>
      <div className="flex justify-center items-center min-h-screen py-10 px-6">
        <motion.div
          className="w-full max-w-5xl"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          {/* Main Card */}
          <motion.div
            className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="flex flex-col lg:flex-row">
              {/* Left Side - Features */}
              <motion.div
                className="lg:w-1/2 p-8 lg:p-10 bg-gradient-to-br from-pink-50 to-white border-r border-gray-200"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
              >
                <motion.div className="mb-8" variants={fadeInUp} custom={0}>
                  <div className="flex items-center mb-6">
                    <motion.div
                      className="p-3 rounded-xl shadow-lg"
                      style={{ backgroundColor: '#F67280' }}
                      initial={{ scale: 0.8, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <Brain className="w-8 h-8 text-white" />
                    </motion.div>
                    <div className="ml-4">
                      <h1 className="text-2xl font-bold text-gray-800">AI Learning Coach</h1>
                      <p className="text-gray-500">Intelligent Emotion & Productivity Tracker</p>
                    </div>
                  </div>
                  <motion.div className="mb-8" variants={fadeInUp} custom={1}>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      Transform Your Learning
                      <span className="block" style={{ color: '#F67280' }}>
                        With AI Intelligence
                      </span>
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      Experience personalized learning like never before. Our AI analyzes your emotions, 
                      focus patterns, and productivity to provide real-time insights and recommendations.
                    </p>
                  </motion.div>
                </motion.div>
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-4 group bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={fadeInUp}
                      custom={index + 2}
                      whileHover={{ scale: 1.04, y: -4, boxShadow: "0 8px 32px 0 rgba(246,114,128,0.08)" }}
                    >
                      <div className="p-3 rounded-xl shadow" style={{ backgroundColor: 'rgba(246, 114, 128, 0.1)' }}>
                        <div style={{ color: '#F67280' }}>{feature.icon}</div>
                      </div>
                      <div>
                        <h3 className="text-gray-800 font-semibold mb-1">{feature.title}</h3>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Right Side - Auth Form */}
              <motion.div
                className="lg:w-1/2 p-8 lg:p-10"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                custom={1}
              >
                <motion.div className="text-center mb-8" variants={fadeInUp} custom={0}>
                  <motion.div
                    className="p-2 rounded-xl inline-block mb-4 shadow"
                    style={{ backgroundColor: '#F67280' }}
                    initial={{ scale: 0.8, rotate: 10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <Activity className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                  </h2>
                  <p className="text-gray-500">
                    {isSignUp 
                      ? 'Join thousands of learners improving with AI' 
                      : 'Sign in to continue your learning journey'
                    }
                  </p>
                </motion.div>

                {/* API Error Message */}
                {apiError && (
                  <motion.div
                    className="bg-red-50 border border-red-200 rounded-xl p-3 mb-6 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                      <span className="text-red-600">{apiError}</span>
                    </div>
                  </motion.div>
                )}

                <motion.div className="space-y-3 mb-6" variants={fadeInUp} custom={1}>
                  <motion.button 
                    className="w-full bg-white hover:bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 flex items-center justify-center space-x-3 text-gray-700 transition-all duration-300 hover:shadow-md"
                    disabled={isLoading}
                    whileHover={{ scale: 1.03 }}
                  >
                    <Chrome className="w-5 h-5" />
                    <span>Continue with Google</span>
                  </motion.button>
                  <motion.button 
                    className="w-full bg-white hover:bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 flex items-center justify-center space-x-3 text-gray-700 transition-all duration-300 hover:shadow-md"
                    disabled={isLoading}
                    whileHover={{ scale: 1.03 }}
                  >
                    <Github className="w-5 h-5" />
                    <span>Continue with GitHub</span>
                  </motion.button>
                </motion.div>

                <div className="flex items-center mb-6">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="px-4 text-gray-400 text-sm">or</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                <motion.form onSubmit={handleSubmit} className="space-y-4" variants={fadeInUp} custom={2}>
                  {isSignUp && (
                    <motion.div variants={fadeInUp} custom={3}>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="name"
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          className={`w-full bg-white border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-xl py-3 pl-12 pr-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-300`}
                        />
                      </div>
                      {errors.name && (
                        <div className="flex items-center mt-2 text-red-500 text-sm">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.name}
                        </div>
                      )}
                    </motion.div>
                  )}

                  <motion.div variants={fadeInUp} custom={4}>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className={`w-full bg-white border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl py-3 pl-12 pr-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-300`}
                      />
                    </div>
                    {errors.email && (
                      <div className="flex items-center mt-2 text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.email}
                      </div>
                    )}
                  </motion.div>

                  <motion.div variants={fadeInUp} custom={5}>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className={`w-full bg-white border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-xl py-3 pl-12 pr-12 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-300`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <div className="flex items-center mt-2 text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.password}
                      </div>
                    )}
                  </motion.div>

                  {isSignUp && (
                    <motion.div variants={fadeInUp} custom={6}>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          className={`w-full bg-white border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} rounded-xl py-3 pl-12 pr-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-300`}
                        />
                      </div>
                      {errors.confirmPassword && (
                        <div className="flex items-center mt-2 text-red-500 text-sm">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.confirmPassword}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Learning Style Selection */}
                  {isSignUp && (
                    <motion.div variants={fadeInUp} custom={7}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Learning Style
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {learningStyles.map((style) => (
                          <div key={style.id}>
                            <input
                              type="radio"
                              id={style.id}
                              name="preferredWayOfLearning"
                              value={style.id}
                              checked={formData.preferredWayOfLearning === style.id}
                              onChange={handleInputChange}
                              className="sr-only peer"
                            />
                            <label
                              htmlFor={style.id}
                              className={`w-full flex flex-col items-center justify-center p-3 text-gray-600 
                                         border rounded-xl cursor-pointer transition-all duration-200 peer-checked:border-transparent 
                                         ${formData.preferredWayOfLearning === style.id 
                                           ? 'bg-pink-50 peer-checked:border-pink-300 shadow-sm' 
                                           : 'bg-white hover:bg-gray-50 border-gray-200'}`}
                            >
                              <div className={`p-2 rounded-lg mb-2 ${formData.preferredWayOfLearning === style.id ? 'text-pink-500' : 'text-gray-400'}`}>
                                {style.icon}
                              </div>
                              <span className="text-sm font-medium">{style.name}</span>
                              <span className="text-xs text-center mt-1 text-gray-500">{style.description}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                      {errors.preferredWayOfLearning && (
                        <div className="flex items-center mt-2 text-red-500 text-sm">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.preferredWayOfLearning}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {!isSignUp && (
                    <motion.div className="flex items-center justify-between text-sm" variants={fadeInUp} custom={8}>
                      <label className="flex items-center text-gray-600">
                        <input type="checkbox" className="mr-2 rounded border-gray-300" />
                        Remember me
                      </label>
                      <button type="button" style={{ color: '#F67280' }} className="hover:text-pink-600 transition-colors duration-200">
                        Forgot Password?
                      </button>
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    style={{ backgroundColor: '#F67280' }}
                    className="w-full hover:bg-pink-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.03 }}
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </motion.form>

                <motion.div className="text-center mt-6" variants={fadeInUp} custom={9}>
                  <p className="text-gray-600">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    <button
                      onClick={toggleAuthMode}
                      disabled={isLoading}
                      style={{ color: '#F67280' }}
                      className="hover:text-pink-600 font-semibold ml-2 transition-colors duration-200"
                    >
                      {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                  </p>
                </motion.div>

                {isSignUp && (
                  <motion.div className="text-center mt-4" variants={fadeInUp} custom={10}>
                    <p className="text-gray-500 text-xs">
                      By creating an account, you agree to our{' '}
                      <button style={{ color: '#F67280' }} className="hover:text-pink-600 transition-colors duration-200">
                        Terms of Service
                      </button>{' '}
                      and{' '}
                      <button style={{ color: '#F67280' }} className="hover:text-pink-600 transition-colors duration-200">
                        Privacy Policy
                      </button>
                    </p>
                  </motion.div>
                )}

                <motion.button
                  style={{ backgroundColor: '#F67280' }}
                  className="w-full hover:bg-pink-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2 mt-[23px]"
                  onClick={() => navigate('/')}
                  whileHover={{ scale: 1.03, backgroundColor: '#ec4899' }}
                  variants={fadeInUp}
                  custom={11}
                > 
                  <span>Home Page</span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default ParentAuth;
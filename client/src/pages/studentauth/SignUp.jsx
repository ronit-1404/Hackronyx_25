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
  Activity
} from 'lucide-react';
import axios from 'axios';

const SignUp = () => {
  const [isSignUp, setIsSignUp] = useState(false); // Default to signin view
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

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
    // Clear API error when user starts typing again
    if (apiError) setApiError(null);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (isSignUp && !formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (isSignUp && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
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
        // Direct API call for registration
        response = await axios.post('http://localhost:5000/api/auth/user/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      } else {
        // Direct API call for login
        response = await axios.post('http://localhost:5000/api/auth/user/login', {
          email: formData.email,
          password: formData.password
        });
      }
      
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        // Save sToken and user data to localStorage
        localStorage.setItem('sToken', response.data.sToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect to dashboard
        navigate('/learner/home');
      } else {
        setApiError(response.data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      
      // Handle error messages from API
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
      confirmPassword: ''
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
        <div className="w-full max-w-5xl">
          {/* Main Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Left Side - Features */}
              <div className="lg:w-1/2 p-8 lg:p-10 bg-gradient-to-br from-pink-50 to-white border-r border-gray-200">
                <div className="mb-8">
                  <div className="flex items-center mb-6">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: '#F67280' }}>
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <div className="ml-4">
                      <h1 className="text-2xl font-bold text-gray-800">AI Learning Coach</h1>
                      <p className="text-gray-500">Intelligent Emotion & Productivity Tracker</p>
                    </div>
                  </div>

                  <div className="mb-8">
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
                  </div>
                </div>

                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-4 group bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300">
                      <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(246, 114, 128, 0.1)' }}>
                        <div style={{ color: '#F67280' }}>{feature.icon}</div>
                      </div>
                      <div>
                        <h3 className="text-gray-800 font-semibold mb-1">{feature.title}</h3>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Auth Form */}
              <div className="lg:w-1/2 p-8 lg:p-10">
                <div className="text-center mb-8">
                  <div className="p-2 rounded-xl inline-block mb-4" style={{ backgroundColor: '#F67280' }}>
                    <Activity className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                  </h2>
                  <p className="text-gray-500">
                    {isSignUp 
                      ? 'Join thousands of learners improving with AI' 
                      : 'Sign in to continue your learning journey'
                    }
                  </p>
                </div>

                {/* API Error Message */}
                {apiError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-6 text-center">
                    <div className="flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                      <span className="text-red-600">{apiError}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  <button 
                    className="w-full bg-white hover:bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 flex items-center justify-center space-x-3 text-gray-700 transition-all duration-300 hover:shadow-md"
                    disabled={isLoading}
                  >
                    <Chrome className="w-5 h-5" />
                    <span>Continue with Google</span>
                  </button>
                  <button 
                    className="w-full bg-white hover:bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 flex items-center justify-center space-x-3 text-gray-700 transition-all duration-300 hover:shadow-md"
                    disabled={isLoading}
                  >
                    <Github className="w-5 h-5" />
                    <span>Continue with GitHub</span>
                  </button>
                </div>

                <div className="flex items-center mb-6">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="px-4 text-gray-400 text-sm">or</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && (
                    <div>
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
                    </div>
                  )}

                  <div>
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
                  </div>

                  <div>
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
                  </div>

                  {isSignUp && (
                    <div>
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
                    </div>
                  )}

                  {!isSignUp && (
                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center text-gray-600">
                        <input type="checkbox" className="mr-2 rounded border-gray-300" />
                        Remember me
                      </label>
                      <button type="button" style={{ color: '#F67280' }} className="hover:text-pink-600 transition-colors duration-200">
                        Forgot Password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{ backgroundColor: '#F67280' }}
                    className="w-full hover:bg-pink-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2"
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
                  </button>
                </form>

                <div className="text-center mt-6">
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
                </div>

                {isSignUp && (
                  <div className="text-center mt-4">
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
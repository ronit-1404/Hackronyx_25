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
  Clipboard,
  BarChart3,
  LineChart
} from 'lucide-react';
import axios from 'axios';

const AdminAuth = () => {
  const [isSignUp, setIsSignUp] = useState(false); // Default to signin view
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminid: ''  // Additional field for admin registration
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
    
    if (isSignUp && !formData.adminid?.trim()) {
      newErrors.adminid = 'Admin ID is required';
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
        // Direct API call for admin registration
        response = await axios.post('http://localhost:5000/api/auth/admin/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          adminid: formData.adminid
        });
      } else {
        // Direct API call for admin login
        response = await axios.post('http://localhost:5000/api/auth/admin/signup', {
          email: formData.email,
          password: formData.password
        });
      }
      
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        // Save aToken and admin data to localStorage
        localStorage.setItem('aToken', response.data.aToken);
        localStorage.setItem('admin', JSON.stringify(response.data.admin));
        
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
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
      confirmPassword: '',
      adminid: ''
    });
  };

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Student Analytics",
      description: "Monitor student performance and engagement with comprehensive dashboards"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Administrative Control",
      description: "Secure access to manage users, courses, and learning resources"
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: "Progress Tracking",
      description: "Track student improvement and identify areas needing intervention"
    },
    {
      icon: <Clipboard className="w-6 h-6" />,
      title: "Resource Management",
      description: "Easily organize and distribute learning materials to students"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex">
      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10">
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-2xl mr-4">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-blue-200">Comprehensive Learning Management</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Empower Your Institution
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                With Advanced Analytics
              </span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Gain valuable insights into student performance and engagement. 
              Our admin tools provide comprehensive data and management features to optimize learning outcomes.
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 group">
                <div className="bg-white/10 p-3 rounded-xl text-blue-400 group-hover:bg-blue-500/20 transition-all duration-300">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-xl inline-block mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {isSignUp ? 'Create Admin Account' : 'Admin Login'}
              </h2>
              <p className="text-gray-300">
                {isSignUp 
                  ? 'Register as an administrator to manage the platform' 
                  : 'Sign in to access the administration panel'
                }
              </p>
            </div>

            {/* API Error Message */}
            {apiError && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 mb-6 text-center">
                <div className="flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                  <span className="text-red-300">{apiError}</span>
                </div>
              </div>
            )}

            <div className="space-y-3 mb-6">
              <button 
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-3 px-4 flex items-center justify-center space-x-3 text-white transition-all duration-300 hover:scale-105"
                disabled={isLoading}
              >
                <Chrome className="w-5 h-5" />
                <span>Continue with Google</span>
              </button>
              <button 
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-3 px-4 flex items-center justify-center space-x-3 text-white transition-all duration-300 hover:scale-105"
                disabled={isLoading}
              >
                <Github className="w-5 h-5" />
                <span>Continue with GitHub</span>
              </button>
            </div>

            <div className="flex items-center mb-6">
              <div className="flex-1 h-px bg-white/20"></div>
              <span className="px-4 text-gray-400 text-sm">or</span>
              <div className="flex-1 h-px bg-white/20"></div>
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
                      className={`w-full bg-white/10 border ${errors.name ? 'border-red-500' : 'border-white/20'} rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    />
                  </div>
                  {errors.name && (
                    <div className="flex items-center mt-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name}
                    </div>
                  )}
                </div>
              )}

              {isSignUp && (
                <div>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="adminid"
                      placeholder="Admin ID"
                      value={formData.adminid}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className={`w-full bg-white/10 border ${errors.adminid ? 'border-red-500' : 'border-white/20'} rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    />
                  </div>
                  {errors.adminid && (
                    <div className="flex items-center mt-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.adminid}
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
                    className={`w-full bg-white/10 border ${errors.email ? 'border-red-500' : 'border-white/20'} rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center mt-2 text-red-400 text-sm">
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
                    className={`w-full bg-white/10 border ${errors.password ? 'border-red-500' : 'border-white/20'} rounded-xl py-3 pl-12 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center mt-2 text-red-400 text-sm">
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
                      className={`w-full bg-white/10 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/20'} rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <div className="flex items-center mt-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>
              )}

              {!isSignUp && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center text-gray-300">
                    <input type="checkbox" className="mr-2 rounded bg-white/10 border-white/20" />
                    Remember me
                  </label>
                  <button type="button" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/25"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                  </>
                ) : (
                  <>
                    <span>{isSignUp ? 'Create Admin Account' : 'Sign In'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-300">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  onClick={toggleAuthMode}
                  disabled={isLoading}
                  className="text-blue-400 hover:text-blue-300 font-semibold ml-2 transition-colors duration-200"
                >
                  {isSignUp ? 'Sign In' : 'Register'}
                </button>
              </p>
            </div>

            {isSignUp && (
              <div className="text-center mt-4">
                <p className="text-gray-400 text-xs">
                  By creating an account, you agree to our{' '}
                  <button className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                    Privacy Policy
                  </button>
                </p>
              </div>
            )}
          </div>

          <div className="lg:hidden mt-8 space-y-4">
            {features.slice(0, 2).map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="text-blue-400">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm">{feature.title}</h3>
                    <p className="text-gray-400 text-xs">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
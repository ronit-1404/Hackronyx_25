import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowRight,
  AlertCircle,
  Chrome,
  Loader,
  Users,
  Phone,
  Baby,
  BookOpen,
  TrendingUp,
  Shield
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
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    childName: '',
    childAge: ''
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
    if (isSignUp && !formData.phone?.trim()) newErrors.phone = 'Phone number is required';
    if (isSignUp && !formData.childName?.trim()) newErrors.childName = 'Child name is required';
    if (isSignUp && !formData.childAge?.trim()) newErrors.childAge = 'Child age is required';
    else if (isSignUp && (isNaN(formData.childAge) || formData.childAge < 3 || formData.childAge > 18)) {
      newErrors.childAge = 'Child age must be between 3 and 18';
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
        response = await axios.post('http://localhost:5001/api/auth/parent/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          childName: formData.childName,
          childAge: parseInt(formData.childAge)
        });
      } else {
        response = await axios.post('http://localhost:5001/api/auth/parent/login', {
          email: formData.email,
          password: formData.password
        });
      }
      if (response.data.success) {
        localStorage.setItem('pToken', response.data.pToken);
        localStorage.setItem('parent', JSON.stringify(response.data.parent));
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
      phone: '',
      childName: '',
      childAge: ''
    });
  };

  const features = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Track Progress",
      description: "Monitor your child's learning journey with detailed progress reports and insights"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Learning Resources",
      description: "Access curated educational materials and activities tailored for your child"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Emotional Support",
      description: "Understand your child's emotional well-being and get guidance on support strategies"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Connect with Educators",
      description: "Stay connected with teachers and receive personalized recommendations"
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
                      style={{ backgroundColor: '#EC4899' }}
                      initial={{ scale: 0.8, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <Heart className="w-8 h-8 text-white" />
                    </motion.div>
                    <div className="ml-4">
                      <h1 className="text-2xl font-bold text-gray-800">Parent Portal</h1>
                      <p className="text-gray-500">Supporting Your Child's Journey</p>
                    </div>
                  </div>
                  <motion.div className="mb-8" variants={fadeInUp} custom={1}>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      Nurture Your Child's
                      <span className="block" style={{ color: '#EC4899' }}>
                        Learning & Growth
                      </span>
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      Join our community of caring parents who are actively involved in their children's 
                      educational journey. Get insights, track progress, and receive personalized guidance 
                      to support your child's learning and emotional development.
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
                      whileHover={{ scale: 1.04, y: -4, boxShadow: "0 8px 32px 0 rgba(236,72,153,0.08)" }}
                    >
                      <div className="p-3 rounded-xl shadow" style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)' }}>
                        <div style={{ color: '#EC4899' }}>{feature.icon}</div>
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
                    style={{ backgroundColor: '#EC4899' }}
                    initial={{ scale: 0.8, rotate: 10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <Users className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {isSignUp ? 'Join Our Parent Community' : 'Welcome Back, Parent'}
                  </h2>
                  <p className="text-gray-500">
                    {isSignUp 
                      ? 'Create your account to start supporting your child\'s learning journey' 
                      : 'Sign in to access your child\'s progress and learning resources'
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
                          placeholder="Your Full Name"
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

                  {isSignUp && (
                    <motion.div variants={fadeInUp} custom={5}>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          className={`w-full bg-white border ${errors.phone ? 'border-red-500' : 'border-gray-200'} rounded-xl py-3 pl-12 pr-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-300`}
                        />
                      </div>
                      {errors.phone && (
                        <div className="flex items-center mt-2 text-red-500 text-sm">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.phone}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {isSignUp && (
                    <motion.div className="grid grid-cols-2 gap-4" variants={fadeInUp} custom={6}>
                      <div>
                        <div className="relative">
                          <Baby className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            name="childName"
                            placeholder="Child's Name"
                            value={formData.childName}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            className={`w-full bg-white border ${errors.childName ? 'border-red-500' : 'border-gray-200'} rounded-xl py-3 pl-12 pr-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-300`}
                          />
                        </div>
                        {errors.childName && (
                          <div className="flex items-center mt-2 text-red-500 text-sm">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.childName}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="relative">
                          <input
                            type="number"
                            name="childAge"
                            placeholder="Child's Age"
                            min="3"
                            max="18"
                            value={formData.childAge}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            className={`w-full bg-white border ${errors.childAge ? 'border-red-500' : 'border-gray-200'} rounded-xl py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-300`}
                          />
                        </div>
                        {errors.childAge && (
                          <div className="flex items-center mt-2 text-red-500 text-sm">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.childAge}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  <motion.div variants={fadeInUp} custom={7}>
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
                    <motion.div variants={fadeInUp} custom={8}>
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

                  {!isSignUp && (
                    <motion.div className="flex items-center justify-between text-sm" variants={fadeInUp} custom={9}>
                      <label className="flex items-center text-gray-600">
                        <input type="checkbox" className="mr-2 rounded border-gray-300" />
                        Remember me
                      </label>
                      <button type="button" style={{ color: '#EC4899' }} className="hover:text-pink-600 transition-colors duration-200">
                        Forgot Password?
                      </button>
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    style={{ backgroundColor: '#EC4899' }}
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
                        <span>{isSignUp ? 'Join Parent Community' : 'Sign In to Portal'}</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </motion.form>

                <motion.div className="text-center mt-6" variants={fadeInUp} custom={10}>
                  <p className="text-gray-600">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    <button
                      onClick={toggleAuthMode}
                      disabled={isLoading}
                      style={{ color: '#EC4899' }}
                      className="hover:text-pink-600 font-semibold ml-2 transition-colors duration-200"
                    >
                      {isSignUp ? 'Sign In' : 'Join Us'}
                    </button>
                  </p>
                </motion.div>

                {isSignUp && (
                  <motion.div className="text-center mt-4" variants={fadeInUp} custom={11}>
                    <p className="text-gray-500 text-xs">
                      By creating an account, you agree to our{' '}
                      <button style={{ color: '#EC4899' }} className="hover:text-pink-600 transition-colors duration-200">
                        Terms of Service
                      </button>{' '}
                      and{' '}
                      <button style={{ color: '#EC4899' }} className="hover:text-pink-600 transition-colors duration-200">
                        Privacy Policy
                      </button>
                    </p>
                  </motion.div>
                )}

                <motion.button
                  style={{ backgroundColor: '#EC4899' }}
                  className="w-full hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2 mt-[23px]"
                  onClick={() => navigate('/')}
                  whileHover={{ scale: 1.03, backgroundColor: '#3B82F6' }}
                  variants={fadeInUp}
                  custom={12}
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
};

export default ParentAuth;
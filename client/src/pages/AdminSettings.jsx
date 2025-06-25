import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Palette, 
  Monitor, 
  Moon, 
  Sun,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import AdminHeader from "../components/headers/AdminHeader";

const AdminSettings = () => {
  const [email, setEmail] = useState("admin@school.edu");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notif, setNotif] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState('default');
  const [autoSave, setAutoSave] = useState(true);
  const [language, setLanguage] = useState('english');
  const [timezone, setTimezone] = useState('UTC-5');
  
  // Form validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Password strength indicator
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }

    // Password validation
    if (password && password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
    } else if (password && confirmPassword && password !== confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }

    // Calculate password strength
    if (password) {
      let strength = 0;
      if (password.length >= 8) strength += 25;
      if (/[A-Z]/.test(password)) strength += 25;
      if (/[0-9]/.test(password)) strength += 25;
      if (/[^A-Za-z0-9]/.test(password)) strength += 25;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }

    // Form validation
    setIsFormValid(!emailError && !passwordError && email);
  }, [email, password, confirmPassword, emailError, passwordError]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return '#EF4444';
    if (passwordStrength < 75) return '#F59E0B';
    return '#10B981';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Very Weak';
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSaving(false);
    setSaveSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    setEmail("admin@school.edu");
    setPassword("");
    setConfirmPassword("");
    setNotif(true);
    setEmailNotifications(true);
    setPushNotifications(false);
    setDarkMode(false);
    setTheme('default');
    setAutoSave(true);
    setLanguage('english');
    setTimezone('UTC-5');
    setSaveSuccess(false);
  };

  // Animation variants
  const pageVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const headerVariants = {
    hidden: { 
      y: -60, 
      opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const sectionVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
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

  // Hover effects
  const hoverEffect = {
    scale: 1.01,
    y: -2,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  };

  return (
    <motion.div 
      className="min-h-screen" 
      style={{ backgroundColor: '#F5EFE6' }}
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <motion.div variants={headerVariants}>
        <AdminHeader />
      </motion.div>
      <motion.div 
        className="max-w-7xl mx-auto p-8"
        variants={containerVariants}
      >
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#000000' }}>
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
              <p className="text-gray-600 mt-1">Manage your account preferences and system configuration</p>
            </div>
          </div>
        </div>

        {/* Success Banner */}
        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 animate-pulse">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">Settings Saved Successfully!</h3>
                <p className="text-green-700 text-sm">All changes have been applied to your account.</p>
              </div>
            </div>
          </div>
        )}

        <form className="space-y-8">
          {/* Account Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center mb-6">
              <User className="w-6 h-6 mr-3" style={{ color: '#000000' }} />
              <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block font-semibold text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#000000] ${
                      emailError ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-transparent'
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                  />
                  {emailError && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                  )}
                </div>
                {emailError && <p className="text-red-500 text-sm flex items-center"><X className="w-4 h-4 mr-1" />{emailError}</p>}
              </div>

              {/* Language & Timezone */}
              <div className="space-y-2">
                <label className="block font-semibold text-gray-700">Language & Region</label>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                  >
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                  </select>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                  >
                    <option value="UTC-5">EST (UTC-5)</option>
                    <option value="UTC-8">PST (UTC-8)</option>
                    <option value="UTC+0">GMT (UTC+0)</option>
                    <option value="UTC+1">CET (UTC+1)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center mb-6">
              <Shield className="w-6 h-6 mr-3" style={{ color: '#000000' }} />
              <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Password Field */}
              <div className="space-y-2">
                <label className="block font-semibold text-gray-700">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#000000] ${
                      passwordError ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-transparent'
                    }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {password && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Password Strength:</span>
                      <span className="text-sm font-medium" style={{ color: getPasswordStrengthColor() }}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${passwordStrength}%`,
                          backgroundColor: getPasswordStrengthColor()
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="block font-semibold text-gray-700">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#000000] ${
                      passwordError && confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-transparent'
                    }`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordError && confirmPassword && (
                  <p className="text-red-500 text-sm flex items-center"><X className="w-4 h-4 mr-1" />{passwordError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center mb-6">
              <Bell className="w-6 h-6 mr-3" style={{ color: '#000000' }} />
              <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
            </div>
            
            <div className="space-y-4">
              {/* Email Notifications Toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-600">Receive important updates via email</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    emailNotifications ? 'bg-[#000000]' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    emailNotifications ? 'translate-x-7' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>

              {/* Push Notifications Toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Push Notifications</h3>
                    <p className="text-sm text-gray-600">Get real-time alerts in your browser</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPushNotifications(!pushNotifications)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    pushNotifications ? 'bg-[#000000]' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    pushNotifications ? 'translate-x-7' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center mb-6">
              <Palette className="w-6 h-6 mr-3" style={{ color: '#000000' }} />
              <h2 className="text-xl font-semibold text-gray-900">Appearance & Theme</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Theme Selection */}
              <div className="space-y-4">
                <label className="block font-semibold text-gray-700">Color Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {['default', 'blue', 'green'].map((themeOption) => (
                    <button
                      key={themeOption}
                      type="button"
                      onClick={() => setTheme(themeOption)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        theme === themeOption 
                          ? 'border-[#000000] bg-pink-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-full h-6 rounded mb-2 ${
                        themeOption === 'default' ? 'bg-[#000000]' :
                        themeOption === 'blue' ? 'bg-blue-500' : 'bg-green-500'
                      }`}></div>
                      <span className="text-sm font-medium capitalize">{themeOption}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dark Mode Toggle */}
              <div className="space-y-4">
                <label className="block font-semibold text-gray-700">Display Mode</label>
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    {darkMode ? <Moon className="w-5 h-5 text-gray-600" /> : <Sun className="w-5 h-5 text-gray-600" />}
                    <div>
                      <h3 className="font-semibold text-gray-900">Dark Mode</h3>
                      <p className="text-sm text-gray-600">Switch to dark interface</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      darkMode ? 'bg-[#000000]' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      darkMode ? 'translate-x-7' : 'translate-x-1'
                    }`}></div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center space-x-2 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Reset to Default</span>
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSaving}
              className={`flex items-center justify-center space-x-2 px-8 py-3 rounded-lg text-white font-medium transition-all shadow-sm hover:shadow-md ${
                isFormValid && !isSaving 
                  ? 'bg-[#000000] hover:bg-[#e55a73]' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              onClick={handleSave}
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdminSettings;
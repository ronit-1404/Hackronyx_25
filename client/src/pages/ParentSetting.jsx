import React, { useState } from "react";
import axios from "axios";
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
  CheckCircle2,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Volume2,
  VolumeX
} from 'lucide-react';
import Header from "../components/headers/ParentHeader";

const UserSettings = () => {
  // Personal Information
  const [firstName, setFirstName] = useState("Ishan");
  const [lastName, setLastName] = useState("Jha");
  const [email, setEmail] = useState("ishanjha@student.edu");
  const [phone, setPhone] = useState("(555) 123-4567");
  const [dateOfBirth, setDateOfBirth] = useState("1995-03-15");
  const [address, setAddress] = useState("123 Main St, City, State 12345");
  const [emailError, setEmailError] = useState("");

  // Security Settings
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [assignmentReminders, setAssignmentReminders] = useState(true);
  const [gradeNotifications, setGradeNotifications] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);
  const [soundNotifications, setSoundNotifications] = useState(true);

  // Appearance Settings
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState('blue');
  const [fontSize, setFontSize] = useState('medium');
  const [language, setLanguage] = useState('english');
  const [startWeek, setStartWeek] = useState('sunday');

  // Privacy Settings
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [showEmail, setShowEmail] = useState(true);
  const [showPhone, setShowPhone] = useState(false);

  // Save/Reset
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);

  // Password strength calculation
  React.useEffect(() => {
    let strength = 0;
    if (newPassword.length > 5) strength += 30;
    if (/[A-Z]/.test(newPassword)) strength += 20;
    if (/[0-9]/.test(newPassword)) strength += 20;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 30;
    setPasswordStrength(strength);
  }, [newPassword]);

  // Email validation
  React.useEffect(() => {
    if (email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError("Invalid email address");
      setIsFormValid(false);
    } else {
      setEmailError("");
      setIsFormValid(true);
    }
  }, [email]);

  // Password match validation
  React.useEffect(() => {
    if (confirmPassword && newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      setIsFormValid(false);
    } else {
      setPasswordError("");
      setIsFormValid(true);
    }
  }, [newPassword, confirmPassword]);

  // ...existing code...

// Remove Authorization and sToken from the axios call
React.useEffect(() => {
  axios.get('http://localhost:5001/api/user/parent/settings')
    .then(res => {
      if (res.data.success) {
        const s = res.data.settings;
        setFirstName(s.firstName || "");
        setLastName(s.lastName || "");
        setEmail(s.email || "");
        setPhone(s.phone || "");
        // Set other fields as needed
      }
    })
    .catch(err => {
      // Optionally handle error
      console.error('Failed to fetch settings', err);
    });
}, []);


  // ...existing code...

const handleSave = (e) => {
  e.preventDefault();
  setIsSaving(true);

  // Prepare the data to send
  const data = {
    firstName,
    lastName,
    email,
    phone,
    // Add other fields as needed
    // Example:
    // dateOfBirth,
    // address,
    // preferences: { ... }
  };

  axios.put('http://localhost:5001/api/user/parent/update/settings', data)
    .then(res => {
      if (res.data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    })
    .catch(err => {
      // Optionally handle error
      console.error('Failed to update settings', err);
    })
    .finally(() => {
      setIsSaving(false);
    });
};

  const handleReset = () => {
    setFirstName("Imran");
    setLastName("Khan");
    setEmail("jailkasitara@student.edu");
    setPhone("(555) 123-4567");
    setDateOfBirth("1995-03-15");
    setAddress("123 Main St, City, State 12345");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTheme('blue');
    setFontSize('medium');
    setLanguage('english');
    setStartWeek('sunday');
    setDarkMode(false);
    setProfileVisibility('public');
    setShowEmail(true);
    setShowPhone(false);
    setEmailNotifications(true);
    setPushNotifications(true);
    setSmsNotifications(false);
    setAssignmentReminders(true);
    setGradeNotifications(true);
    setEventReminders(true);
    setSoundNotifications(true);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return '#EF4444';
    if (passwordStrength < 70) return '#F59E0B';
    return '#10B981';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 70) return 'Moderate';
    return 'Strong';
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

  return (
    <motion.div 
      className="min-h-screen" 
      style={{ backgroundColor: '#F5EFE6' }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={headerVariants}>
        <Header />
      </motion.div>
      <motion.div 
        className="max-w-7xl mx-auto p-8" 
        id="settings-container"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div 
          className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-8"
          variants={itemVariants}
        >
          <div className="flex items-center space-x-4">
            <motion.div 
              className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-blue-500 to-purple-600"
              variants={iconVariants}
              whileHover="hover"
            >
              <User className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <motion.h1 
                className="text-3xl font-bold text-gray-900"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Parent Settings
              </motion.h1>
              <motion.p 
                className="text-gray-600 mt-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                Manage your personal preferences and account settings
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Success Banner */}
        <AnimatePresence>
          {saveSuccess && (
            <motion.div 
              className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </motion.div>
                <div>
                  <motion.h3 
                    className="font-semibold text-green-800"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Settings Saved Successfully!
                  </motion.h3>
                  <motion.p 
                    className="text-green-700 text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Your preferences have been updated.
                  </motion.p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form 
          className="space-y-8" 
          onSubmit={handleSave}
          variants={containerVariants}
        >
          {/* Personal Information */}
          <motion.div 
            className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="flex items-center mb-6">
              <motion.div variants={iconVariants} whileHover="hover">
                <User className="w-6 h-6 mr-3 text-blue-600" />
              </motion.div>
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block font-semibold text-gray-700">First Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <label className="block font-semibold text-gray-700">Last Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
              <div className="space-y-2">
                <label className="block font-semibold text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      emailError ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-transparent'
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                  />
                </div>
                {emailError && <p className="text-red-500 text-sm flex items-center"><X className="w-4 h-4 mr-1" />{emailError}</p>}
              </div>
              <div className="space-y-2">
                <label className="block font-semibold text-gray-700">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Security Settings */}
          <motion.div 
            className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="flex items-center mb-6">
              <motion.div variants={iconVariants} whileHover="hover">
                <Shield className="w-6 h-6 mr-3 text-green-600" />
              </motion.div>
              <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block font-semibold text-gray-700">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block font-semibold text-gray-700">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      passwordError ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-transparent'
                    }`}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {newPassword && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Strength:</span>
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
              <div className="space-y-2">
                <label className="block font-semibold text-gray-700">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
          </motion.div>

          {/* Notification Settings */}
          <motion.div 
            className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="flex items-center mb-6">
              <motion.div variants={iconVariants} whileHover="hover">
                <Bell className="w-6 h-6 mr-3 text-purple-600" />
              </motion.div>
              <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email', icon: Mail, state: emailNotifications, setState: setEmailNotifications },
                { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser notifications', icon: Bell, state: pushNotifications, setState: setPushNotifications },
                { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Text message alerts', icon: Phone, state: smsNotifications, setState: setSmsNotifications },
                { key: 'assignmentReminders', label: 'Assignment Reminders', desc: 'Due date notifications', icon: BookOpen, state: assignmentReminders, setState: setAssignmentReminders },
                { key: 'gradeNotifications', label: 'Grade Updates', desc: 'New grade notifications', icon: CheckCircle2, state: gradeNotifications, setState: setGradeNotifications },
                { key: 'eventReminders', label: 'Event Reminders', desc: 'Calendar event alerts', icon: Calendar, state: eventReminders, setState: setEventReminders },
                { key: 'soundNotifications', label: 'Sound Notifications', desc: 'Audio alerts', icon: Volume2, state: soundNotifications, setState: setSoundNotifications }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 text-gray-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.label}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => item.setState(!item.state)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      item.state ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      item.state ? 'translate-x-7' : 'translate-x-1'
                    }`}></div>
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Appearance & Preferences */}
          <motion.div 
            className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="flex items-center mb-6">
              <motion.div variants={iconVariants} whileHover="hover">
                <Palette className="w-6 h-6 mr-3 text-orange-600" />
              </motion.div>
              <h2 className="text-xl font-semibold text-gray-900">Appearance & Preferences</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block font-semibold text-gray-700">Color Theme</label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { key: 'blue', color: 'bg-blue-500', label: 'Blue' },
                    { key: 'green', color: 'bg-green-500', label: 'Green' },
                    { key: 'purple', color: 'bg-purple-500', label: 'Purple' },
                    { key: 'pink', color: 'bg-pink-500', label: 'Pink' }
                  ].map((themeOption) => (
                    <button
                      key={themeOption.key}
                      type="button"
                      onClick={() => setTheme(themeOption.key)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        theme === themeOption.key 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-full h-6 rounded mb-2 ${themeOption.color}`}></div>
                      <span className="text-sm font-medium">{themeOption.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block font-semibold text-gray-700">Font Size</label>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block font-semibold text-gray-700">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block font-semibold text-gray-700">Week Starts On</label>
                  <select
                    value={startWeek}
                    onChange={(e) => setStartWeek(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="sunday">Sunday</option>
                    <option value="monday">Monday</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Dark Mode Toggle */}
            <div className="mt-6 flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
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
                  darkMode ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  darkMode ? 'translate-x-7' : 'translate-x-1'
                }`}></div>
              </button>
            </div>
          </motion.div>

          {/* Privacy Settings */}
          <motion.div 
            className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="flex items-center mb-6">
              <motion.div variants={iconVariants} whileHover="hover">
                <Shield className="w-6 h-6 mr-3 text-red-600" />
              </motion.div>
              <h2 className="text-xl font-semibold text-gray-900">Privacy Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block font-semibold text-gray-700">Profile Visibility</label>
                <select
                  value={profileVisibility}
                  onChange={(e) => setProfileVisibility(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="public">Public - Anyone can see</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private - Only me</option>
                </select>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div>
                    <h3 className="font-semibold text-gray-900">Show Email in Profile</h3>
                    <p className="text-sm text-gray-600">Make email visible to others</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEmail(!showEmail)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      showEmail ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      showEmail ? 'translate-x-7' : 'translate-x-1'
                    }`}></div>
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div>
                    <h3 className="font-semibold text-gray-900">Show Phone in Profile</h3>
                    <p className="text-sm text-gray-600">Make phone visible to others</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPhone(!showPhone)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      showPhone ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      showPhone ? 'translate-x-7' : 'translate-x-1'
                    }`}></div>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Save/Reset Buttons */}
          <motion.div 
            className="flex justify-end gap-4 mt-8"
            variants={itemVariants}
          >
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-300 transition"
              disabled={isSaving}
            >
              <RefreshCw size={18} />
              Reset
            </button>
            <button
              type="submit"
              className={`px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition ${
                !isFormValid || isSaving ? 'opacity-60 cursor-not-allowed' : ''
              }`}
              disabled={!isFormValid || isSaving}
            >
              {isSaving ? (
                <>
                  <Save size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Settings
                </>
              )}
            </button>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default UserSettings;
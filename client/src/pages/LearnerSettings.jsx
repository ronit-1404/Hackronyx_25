import React, { useState, useEffect } from "react";
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

const UserSettings = () => {
  // Personal Information
  const [firstName, setFirstName] = useState("Imran");
  const [lastName, setLastName] = useState("Khan");
  const [email, setEmail] = useState("jailkasitara@student.edu");
  const [phone, setPhone] = useState("(555) 123-4567");
  const [dateOfBirth, setDateOfBirth] = useState("1995-03-15");
  const [address, setAddress] = useState("123 Main St, City, State 12345");
  
  // Security Settings
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
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
  
  // Preferences
  const [language, setLanguage] = useState('english');
  const [timezone, setTimezone] = useState('UTC-5');
  const [startWeek, setStartWeek] = useState('monday');
  
  // Privacy Settings
  const [profileVisibility, setProfileVisibility] = useState('friends');
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  
  // Form validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
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
    if (newPassword && newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
    } else if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }

    // Calculate password strength
    if (newPassword) {
      let strength = 0;
      if (newPassword.length >= 8) strength += 25;
      if (/[A-Z]/.test(newPassword)) strength += 25;
      if (/[0-9]/.test(newPassword)) strength += 25;
      if (/[^A-Za-z0-9]/.test(newPassword)) strength += 25;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }

    // Form validation
    setIsFormValid(!emailError && !passwordError && email && firstName && lastName);
  }, [email, newPassword, confirmPassword, emailError, passwordError, firstName, lastName]);

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
    setFirstName("Imran");
    setLastName("Khan");
    setEmail("jailkasitara@student.edu");
    setPhone("(555) 123-4567");
    setDateOfBirth("1995-03-15");
    setAddress("123 Main St, City, State 12345");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setEmailNotifications(true);
    setPushNotifications(true);
    setSmsNotifications(false);
    setAssignmentReminders(true);
    setGradeNotifications(true);
    setEventReminders(true);
    setSoundNotifications(true);
    setDarkMode(false);
    setTheme('blue');
    setFontSize('medium');
    setLanguage('english');
    setTimezone('UTC-5');
    setStartWeek('monday');
    setProfileVisibility('friends');
    setShowEmail(false);
    setShowPhone(false);
    setSaveSuccess(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Settings</h1>
              <p className="text-gray-600 mt-1">Manage your personal preferences and account settings</p>
            </div>
          </div>
        </div>

        {/* Success Banner */}
        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 animate-pulse">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">Settings Saved Successfully!</h3>
                <p className="text-green-700 text-sm">Your preferences have been updated.</p>
              </div>
            </div>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSave}>
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <User className="w-6 h-6 mr-3 text-blue-600" />
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

              <div className="space-y-2">
                <label className="block font-semibold text-gray-700">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-semibold text-gray-700">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your address"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Shield className="w-6 h-6 mr-3 text-green-600" />
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
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Bell className="w-6 h-6 mr-3 text-purple-600" />
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
          </div>

          {/* Appearance & Preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Palette className="w-6 h-6 mr-3 text-orange-600" />
              <h2 className="text-xl font-semibold text-gray-900">Appearance & Preferences</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Theme Selection */}
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

              {/* Other Preferences */}
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
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Shield className="w-6 h-6 mr-3 text-red-600" />
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
          </div>
        </form>
      </div>
    </div>
  );      
}

export default UserSettings;
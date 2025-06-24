import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  User, 
  Settings,
  Shield,
  HelpCircle,
  Brain,
  Sparkles,
  CheckCircle
} from 'lucide-react';

export default function SignoutButton() {
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const navigation = useNavigate();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    tap: { scale: 0.95 }
  };

  const loadingVariants = {
    loading: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const successVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "backOut",
        staggerChildren: 0.1
      }
    }
  };
  
  // Get user data from localStorage on component mount
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserData(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // Check if user is actually signed in
    const hasToken = localStorage.getItem('sToken') || localStorage.getItem('aToken');
    if (!hasToken) {
      // If no token exists, redirect to home page
      navigation('/');
    }
  }, [navigation]);

  const handleSignout = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear actual user session data
      localStorage.removeItem('sToken');
      localStorage.removeItem('aToken');
      localStorage.removeItem('user');
      
      setIsSignedIn(false);
      console.log('User signed out successfully');
      
      // Redirect to home/role selection after showing success message
      setTimeout(() => {
        navigation('/');
      }, 2000);
      
    } catch (error) {
      console.error('Signout failed:', error);
      alert('Signout failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSignedIn) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center px-8" 
        style={{ backgroundColor: '#F5EFE6' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="relative z-10 text-center"
          variants={successVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 max-w-md mx-auto"
            variants={itemVariants}
          >
            <motion.div 
              className="p-3 rounded-xl inline-block mb-4" 
              style={{ backgroundColor: '#F67280' }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "backOut" }}
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </motion.div>
            
            <motion.h2 
              className="text-2xl font-bold text-gray-800 mb-3"
              variants={itemVariants}
            >
              Successfully Signed Out
            </motion.h2>
            
            <motion.p 
              className="text-gray-600 mb-4 leading-relaxed"
              variants={itemVariants}
            >
              You have been safely signed out of your AI Learning Coach account.
            </motion.p>
            
            <motion.div 
              className="bg-green-50 rounded-xl p-3 border border-green-100"
              variants={itemVariants}
            >
              <p className="text-green-700 text-sm flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-block mr-2"
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                Redirecting you to the home page...
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center px-8" 
      style={{ backgroundColor: '#F5EFE6' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          variants={itemVariants}
        >
          {/* Header */}
          <motion.div className="text-center mb-6" variants={itemVariants}>
            <motion.div 
              className="p-2.5 rounded-xl inline-block mb-3" 
              style={{ backgroundColor: '#F67280' }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-xl font-bold text-gray-800 mb-1">AI Learning Coach</h1>
            <p className="text-gray-500 text-sm">Account Management</p>
          </motion.div>

          {/* User Profile Section */}
          <motion.div className="text-center mb-6" variants={itemVariants}>
            <motion.div 
              className="relative inline-block mb-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                <User className="w-8 h-8" style={{ color: '#F67280' }} />
              </div>
              <motion.div 
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </motion.div>
            </motion.div>
            
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              {userData?.name || 'User'}
            </h2>
            <p className="text-gray-500 text-sm">
              {userData?.email || 'user@example.com'}
            </p>
            <motion.div 
              className="mt-2 inline-flex items-center px-2.5 py-1 bg-pink-50 rounded-full text-pink-600 text-xs"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              {userData?.role === 'admin' ? 'Administrator' : 'Student Member'}
            </motion.div>
          </motion.div>

          {/* Quick Actions - Horizontal Layout */}
          <motion.div className="flex space-x-2 mb-5" variants={itemVariants}>
            <motion.button 
              className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 flex flex-col items-center space-y-1 text-gray-700 transition-all duration-300 shadow-sm"
              onClick={() => navigation('/learner/settings')}
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
            >
              <Settings className="w-4 h-4 text-gray-500 group-hover:text-pink-500 transition-colors" />
              <span className="text-xs">Settings</span>
            </motion.button>
            
            <motion.button 
              className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 flex flex-col items-center space-y-1 text-gray-700 transition-all duration-300 shadow-sm"
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
            >
              <Shield className="w-4 h-4 text-gray-500 group-hover:text-pink-500 transition-colors" />
              <span className="text-xs">Security</span>
            </motion.button>
            
            <motion.button 
              className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 flex flex-col items-center space-y-1 text-gray-700 transition-all duration-300 shadow-sm"
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
            >
              <HelpCircle className="w-4 h-4 text-gray-500 group-hover:text-pink-500 transition-colors" />
              <span className="text-xs">Help</span>
            </motion.button>
          </motion.div>

          {/* Divider */}
          <motion.div className="flex items-center mb-5" variants={itemVariants}>
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-3 text-gray-400 text-xs">Session</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </motion.div>

          {/* Signout Button */}
          <motion.button
            onClick={handleSignout}
            disabled={isLoading}
            className={`
              w-full flex items-center justify-center space-x-3 py-2.5 px-4 rounded-xl font-semibold transition-all duration-300 shadow-sm
              ${isLoading 
                ? 'bg-gray-200 cursor-not-allowed border border-gray-300 text-gray-400' 
                : 'text-white focus:outline-none focus:ring-2 focus:ring-offset-2'
              } 
            `}
            style={{ backgroundColor: isLoading ? undefined : '#F67280' }}
            variants={isLoading ? loadingVariants : buttonVariants}
            initial="idle"
            whileHover={!isLoading ? "hover" : undefined}
            whileTap={!isLoading ? "tap" : undefined}
            animate={isLoading ? "loading" : "idle"}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center space-x-3"
                >
                  <motion.div 
                    className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Signing out...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center space-x-3"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Footer Note */}
          <motion.div className="text-center mt-4" variants={itemVariants}>
            <p className="text-gray-500 text-xs">
              Signing out will end your current session
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom Features - Compact */}
        <motion.div 
          className="mt-4"
          variants={itemVariants}
        >
          <motion.div 
            className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-3">
              <motion.div 
                className="p-2 rounded-lg" 
                style={{ backgroundColor: 'rgba(246, 114, 128, 0.1)' }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Shield className="w-4 h-4" style={{ color: '#F67280' }} />
              </motion.div>
              <div>
                <h3 className="text-gray-800 font-medium text-xs">Secure Session</h3>
                <p className="text-gray-500 text-xs">End-to-end encryption protected</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
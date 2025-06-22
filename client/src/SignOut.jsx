import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const navigation = useNavigate();

  const handleSignout = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear user session data (simulated)
      // In a real app, you would:
      // - Call your authentication API endpoint
      // - Clear tokens from memory/state
      // - Redirect to login page
      // - Clear any user data from state management
      
      setIsSignedIn(false);
      console.log('User signed out successfully');
      
      // Simulate redirect or state change
      setTimeout(() => {
        // Reset for demo purposes
        setIsSignedIn(true);
      }, 3000);
      
    } catch (error) {
      console.error('Signout failed:', error);
      alert('Signout failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md mx-auto">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-2xl inline-block mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Successfully Signed Out</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              You have been safely signed out of your AI Learning Coach account.
            </p>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-purple-400 text-sm">
                <Sparkles className="w-4 h-4 inline mr-2" />
                Thank you for using AI Learning Coach
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-8">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2.5 rounded-2xl inline-block mb-3">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white mb-1">AI Learning Coach</h1>
            <p className="text-purple-200 text-sm">Account Management</p>
          </div>

          {/* User Profile Section */}
          <div className="text-center mb-6">
            <div className="relative inline-block mb-3">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center border border-white/20">
                <User className="w-8 h-8 text-purple-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
            <h2 className="text-lg font-semibold text-white mb-1">Arman Singh</h2>
            <p className="text-gray-400 text-sm">arman.singh@example.com</p>
            <div className="mt-2 inline-flex items-center px-2.5 py-1 bg-purple-500/20 rounded-full text-purple-300 text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              Premium Member
            </div>
          </div>

          {/* Quick Actions - Horizontal Layout */}
          <div className="flex space-x-2 mb-5">
            <button className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg py-2 px-3 flex flex-col items-center space-y-1 text-white transition-all duration-300 hover:scale-105 group"
              onClick={() => navigation('/learner/settings ')}
            >
              <Settings className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
              <span className="text-xs">Settings</span>
            </button>
            <button className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg py-2 px-3 flex flex-col items-center space-y-1 text-white transition-all duration-300 hover:scale-105 group">
              <Shield className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
              <span className="text-xs">Security</span>
            </button>
            <button className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg py-2 px-3 flex flex-col items-center space-y-1 text-white transition-all duration-300 hover:scale-105 group">
              <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
              <span className="text-xs">Help</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center mb-5">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="px-3 text-gray-400 text-xs">Session</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Signout Button */}
          <button
            onClick={handleSignout}
            disabled={isLoading}
            className={`
              w-full flex items-center justify-center space-x-3 py-2.5 px-4 rounded-xl font-semibold transition-all duration-300 shadow-lg
              ${isLoading 
                ? 'bg-gray-600/50 cursor-not-allowed border border-gray-500/50' 
                : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 hover:scale-105 hover:shadow-red-500/25 border border-red-500/50'
              } 
              text-white focus:outline-none focus:ring-4 focus:ring-red-500/20
            `}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Signing out...</span>
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </>
            )}
          </button>

          {/* Footer Note */}
          <div className="text-center mt-4">
            <p className="text-gray-400 text-xs">
              Signing out will end your current session
            </p>
          </div>
        </div>

        {/* Bottom Features - Compact */}
        <div className="mt-4">
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="text-purple-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-white font-medium text-xs">Secure Session</h3>
                <p className="text-gray-400 text-xs">End-to-end encryption protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
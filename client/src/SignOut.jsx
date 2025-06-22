import React, { useState } from 'react';
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
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20 max-w-md mx-auto">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-2xl inline-block mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Successfully Signed Out</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              You have been safely signed out of your AI Learning Coach account. 
              Your session has been terminated securely.
            </p>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
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
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl inline-block mb-4">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">AI Learning Coach</h1>
            <p className="text-purple-200">Account Management</p>
          </div>

          {/* User Profile Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center border border-white/20">
                <User className="w-10 h-10 text-purple-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-white mb-1">John Doe</h2>
            <p className="text-gray-400">john.doe@example.com</p>
            <div className="mt-3 inline-flex items-center px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 text-sm">
              <Sparkles className="w-4 h-4 mr-1" />
              Premium Member
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3 mb-6">
            <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-3 px-4 flex items-center space-x-3 text-white transition-all duration-300 hover:scale-105 group">
              <Settings className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
              <span>Account Settings</span>
            </button>
            <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-3 px-4 flex items-center space-x-3 text-white transition-all duration-300 hover:scale-105 group">
              <Shield className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
              <span>Privacy & Security</span>
            </button>
            <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-3 px-4 flex items-center space-x-3 text-white transition-all duration-300 hover:scale-105 group">
              <HelpCircle className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
              <span>Help & Support</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="px-4 text-gray-400 text-sm">Session</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Signout Button */}
          <button
            onClick={handleSignout}
            disabled={isLoading}
            className={`
              w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-xl font-semibold transition-all duration-300 shadow-lg
              ${isLoading 
                ? 'bg-gray-600/50 cursor-not-allowed border border-gray-500/50' 
                : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 hover:scale-105 hover:shadow-red-500/25 border border-red-500/50'
              } 
              text-white focus:outline-none focus:ring-4 focus:ring-red-500/20
            `}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Signing out...</span>
              </>
            ) : (
              <>
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </>
            )}
          </button>

          {/* Footer Note */}
          <div className="text-center mt-6">
            <p className="text-gray-400 text-xs">
              Signing out will end your current session and require re-authentication to access your account.
            </p>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="mt-6 space-y-3">
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="text-purple-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">Secure Session</h3>
                <p className="text-gray-400 text-xs">Your data is protected with end-to-end encryption</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
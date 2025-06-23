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
      <div className="min-h-screen flex items-center justify-center px-8" style={{ backgroundColor: '#F5EFE6' }}>
        <div className="relative z-10 text-center">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 max-w-md mx-auto">
            <div className="p-3 rounded-xl inline-block mb-4" style={{ backgroundColor: '#F67280' }}>
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Successfully Signed Out</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              You have been safely signed out of your AI Learning Coach account.
            </p>
            <div className="bg-green-50 rounded-xl p-3 border border-green-100">
              <p className="text-green-700 text-sm flex items-center justify-center">
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
    <div className="min-h-screen flex items-center justify-center px-8" style={{ backgroundColor: '#F5EFE6' }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="p-2.5 rounded-xl inline-block mb-3" style={{ backgroundColor: '#F67280' }}>
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 mb-1">AI Learning Coach</h1>
            <p className="text-gray-500 text-sm">Account Management</p>
          </div>

          {/* User Profile Section */}
          <div className="text-center mb-6">
            <div className="relative inline-block mb-3">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                <User className="w-8 h-8" style={{ color: '#F67280' }} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Arman Singh</h2>
            <p className="text-gray-500 text-sm">arman.singh@example.com</p>
            <div className="mt-2 inline-flex items-center px-2.5 py-1 bg-pink-50 rounded-full text-pink-600 text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              Premium Member
            </div>
          </div>

          {/* Quick Actions - Horizontal Layout */}
          <div className="flex space-x-2 mb-5">
            <button 
              className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 flex flex-col items-center space-y-1 text-gray-700 transition-all duration-300 hover:scale-105 group shadow-sm"
              onClick={() => navigation('/learner/settings')}
            >
              <Settings className="w-4 h-4 text-gray-500 group-hover:text-pink-500 transition-colors" />
              <span className="text-xs">Settings</span>
            </button>
            <button className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 flex flex-col items-center space-y-1 text-gray-700 transition-all duration-300 hover:scale-105 group shadow-sm">
              <Shield className="w-4 h-4 text-gray-500 group-hover:text-pink-500 transition-colors" />
              <span className="text-xs">Security</span>
            </button>
            <button className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 flex flex-col items-center space-y-1 text-gray-700 transition-all duration-300 hover:scale-105 group shadow-sm">
              <HelpCircle className="w-4 h-4 text-gray-500 group-hover:text-pink-500 transition-colors" />
              <span className="text-xs">Help</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center mb-5">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-3 text-gray-400 text-xs">Session</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Signout Button */}
          <button
            onClick={handleSignout}
            disabled={isLoading}
            className={`
              w-full flex items-center justify-center space-x-3 py-2.5 px-4 rounded-xl font-semibold transition-all duration-300 shadow-sm
              ${isLoading 
                ? 'bg-gray-200 cursor-not-allowed border border-gray-300 text-gray-400' 
                : 'text-white hover:scale-105 hover:shadow-md'
              } 
              focus:outline-none focus:ring-2 focus:ring-offset-2
            `}
            style={{ backgroundColor: isLoading ? undefined : '#F67280' }}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
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
            <p className="text-gray-500 text-xs">
              Signing out will end your current session
            </p>
          </div>
        </div>

        {/* Bottom Features - Compact */}
        <div className="mt-4">
          <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(246, 114, 128, 0.1)' }}>
                <Shield className="w-4 h-4" style={{ color: '#F67280' }} />
              </div>
              <div>
                <h3 className="text-gray-800 font-medium text-xs">Secure Session</h3>
                <p className="text-gray-500 text-xs">End-to-end encryption protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
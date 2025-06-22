import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  register: () => {}
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on initialization
  useEffect(() => {
    const checkAuthStatus = async () => {
      // Check for student token
      const sToken = localStorage.getItem('sToken');
      // Check for admin token
      const aToken = localStorage.getItem('aToken'); 
      
      if (!sToken && !aToken) {
        setLoading(false);
        return;
      }
      
      try {
        // Get user profile
        const response = await api.get('/auth/profile');
        
        if (response.data.success) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          // If token is invalid, clear tokens
          localStorage.removeItem('sToken');
          localStorage.removeItem('aToken');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // If token is invalid, clear tokens
        localStorage.removeItem('sToken');
        localStorage.removeItem('aToken');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/user/login', {
        email,
        password
      });
      
      if (response.data.success) {
        localStorage.setItem('sToken', response.data.sToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Set auth state
        setUser(response.data.user);
        setIsAuthenticated(true);
        
        return { success: true };
      }
      
      return { success: false, message: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/user/register', {
        name,
        email,
        password
      });
      
      if (response.data.success) {
        localStorage.setItem('sToken', response.data.sToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Set auth state
        setUser(response.data.user);
        setIsAuthenticated(true);
        
        return { success: true };
      }
      
      return { success: false, message: 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('sToken');
    localStorage.removeItem('aToken');
    localStorage.removeItem('user');
    
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
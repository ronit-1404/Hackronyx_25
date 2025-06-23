import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import SignUp from "./pages/studentauth/SignUp";
import LoginSelection from "./pages/LoginSelction"; 
import { useAuth } from "./context/AuthContext";

// Learner Pages
import LearnerHome from "./pages/LearnerHome";
import LearnerAnalytics from "./pages/LearnerAnalytics";
import LearnerResources from "./pages/LearnerResources";
import LearnerSettings from "./pages/LearnerSettings";
import LearnerReports from "./pages/LearnerReports";  

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminStudents from "./pages/AdminStudents";
import AdminClasses from "./pages/AdminClasses";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminSettings from "./pages/AdminSettings";

import SignOut from "./SignOut";
import AnalysisPage from "./pages/AnalysisPage";
import AdminAuth from "./pages/adminauth/AdminAuth";

// Protected Route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If a specific role is required, check it
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on actual role
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/learner/home" replace />;
  }

  return children;
};

function AppContent() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stoken = localStorage.getItem('sToken');
    const aToken = localStorage.getItem('aToken');

    if (stoken) {
      setRole('student');
    }
    else if (aToken) {
      setRole('admin');
    }
  }, []);

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'student') {
      navigate('/signup');
    } else if (selectedRole === 'admin') {
      navigate('/admin/login');
    } else {
      navigate('/signup');
    }
  };

  // Check for authentication tokens
  const hasToken = localStorage.getItem('sToken') || localStorage.getItem('aToken');

  return (
    <Routes>
      {!hasToken ? (
        <>
          {/* Public routes - only accessible when not authenticated */}
          <Route path="/" element={<LoginSelection onSelect={handleRoleSelection} />} />
          <Route path="/fds" element={<Navigate to="/signup" />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin/login" element={<AdminAuth />} />
          
          {/* Redirect authenticated paths to login if no token */}
          <Route path="/learner/*" element={<Navigate to="/" replace />} />
          <Route path="/admin/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/admin/students" element={<Navigate to="/" replace />} />
          <Route path="/admin/classes" element={<Navigate to="/" replace />} />
          <Route path="/admin/analytics" element={<Navigate to="/" replace />} />
          <Route path="/admin/settings" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          {/* Authenticated routes */}
          <Route path="/" element={
            localStorage.getItem('sToken') 
              ? <Navigate to="/learner/home" replace /> 
              : <Navigate to="/admin/dashboard" replace />
          } />
          <Route path="/signup" element={<Navigate to="/" replace />} />
          <Route path="/admin/login" element={<Navigate to="/admin/dashboard" replace />} />

          {/* Learner Routes */}
          <Route path="/learner/home" element={<LearnerHome />} />
          <Route path="/ana" element={<AnalysisPage />} />
          <Route path="/learner/analytics" element={<LearnerAnalytics />} />
          <Route path="/learner/resources" element={<LearnerResources />} />
          <Route path="/learner/reports" element={<LearnerReports />} />
          <Route path="/learner/settings" element={<LearnerSettings />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/classes" element={<AdminClasses />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          <Route path="/signout" element={<SignOut/>} />

          {/* Catch-all redirect */}
          <Route path="*" element={
            localStorage.getItem('sToken')
              ? <Navigate to="/learner/home" replace />
              : <Navigate to="/admin/dashboard" replace />
          } />
        </>
      )}
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
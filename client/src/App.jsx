import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import SignUp from "./SignUp";

// Learner Pages
import LearnerHome from "./pages/LearnerHome";
import LearnerAnalytics from "./pages/LearnerAnalytics";
import LearnerResources from "./pages/LearnerResources";
import LearnerSettings from "./pages/LearnerSettings";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminStudents from "./pages/AdminStudents";
import AdminClasses from "./pages/AdminClasses";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminSettings from "./pages/AdminSettings";

// Parent Pages
// import ParentDashboard from "./pages/ParentDashboard";
// import ParentSettings from "./pages/ParentSettings";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route: redirect to signup */}
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Learner Routes */}
        <Route path="/learner/home" element={<LearnerHome />} />
        <Route path="/learner/analytics" element={<LearnerAnalytics />} />
        <Route path="/learner/resources" element={<LearnerResources />} />
        <Route path="/learner/settings" element={<LearnerSettings />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/classes" element={<AdminClasses />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/settings" element={<AdminSettings />} />

        {/* Parent Routes */}
        {/* <Route path="/parent/dashboard" element={<ParentDashboard />} />
        <Route path="/parent/settings" element={<ParentSettings />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Dashboard2 from "./Dashboard2";
import SignUp from "./SignUp";
import AnalysisPage from "./pages/AnalysisPage";
import ScreenAnalyzer from "./components/ScreenAnalyzer";

function App() {
  return (
    <Router>
      <Routes>
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
      </Routes>
    </Router>
  );
}

export default App;
 

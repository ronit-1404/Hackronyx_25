import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Dashboard2 from "./Dashboard2";
import SignUp from "./SignUp";
import AnalysisPage from "./pages/AnalysisPage";

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard2 />} />
        <Route path='/analysis' element={<AnalysisPage />} />
      </Routes>
    </Router>
  );
}

export default App;
 

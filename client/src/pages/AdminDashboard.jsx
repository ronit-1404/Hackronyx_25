import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../components/headers/AdminHeader";
import AdminSideBar from "../components/sideBar/AdminSideBar";
import RealtimePerformanceMetrics from "../components/adminDash/RealtimePerformanceMetrics";
import Heatmap from "../components/adminDash/Heatmap";
import StudentEmotionChart from "../components/adminDash/StudentEmotionChart";
import SystemRecomendation from "../components/adminDash/SystemRecomendation";
import AiIntervention from "../components/adminDash/AiIntervention";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F5EFE6" }}>
      {/* Enhanced Sidebar */}
      <AdminSideBar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-80 h-screen overflow-y-auto">
        {/* Top Navigation Bar */}
        <AdminHeader />

        <div className="flex-1 p-8 overflow-y-auto">
          {/* Real-time Performance Chart */}
          <RealtimePerformanceMetrics />
          {/* Enhanced Engagement Heatmap */}
          <Heatmap />

          {/* Split Layout for Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Emotion Distribution */}
            <StudentEmotionChart />

            {/* AI Intervention Performance */}
            <AiIntervention />
          </div>

          {/* AI Recommendations */}
          <SystemRecomendation />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

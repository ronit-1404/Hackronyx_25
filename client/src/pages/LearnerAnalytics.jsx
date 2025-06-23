import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/headers/Header';
import SideBar from '../components/sideBar/SideBar';
import FocusHeatmap from '../components/learnerDash/Heatmap';
import EngagementChart from '../components/learnerDash/EngagementCurve';
import DashboardCharts from '../components/learnerDash/DashboardCharts';
import PeerMetrics from '../components/learnerDash/PeerMetrics';
import ContentAnalysis from '../components/learnerDash/ContentAnalysis';

const LearnerAnalytics = () => {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F5EFE6' }}>
      {/* Sidebar */}
      <SideBar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-80 h-screen overflow-y-auto">
        {/* Top Navigation Bar */}
        <Header/>

        <div className="flex-1 p-8 overflow-y-auto">
          {/* Focus Heatmap - Full Width */}
          <FocusHeatmap />
          {/* New Engagement vs Benchmark Line Chart - Full Width */}
          <EngagementChart />

          {/* Charts Grid */}
          <DashboardCharts />

          {/* Updated Performance Radar Chart - Your Focus vs Peer Median */}
          <PeerMetrics/>

          {/* Content Analysis */}
          <ContentAnalysis />
        </div>
      </div>
    </div>
  );
};

export default LearnerAnalytics;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/headers/Header';
import SideBar from '../components/sideBar/SideBar';
import Recommendation from '../components/learnerHome/Recommendation';
import ProductivityCharts from '../components/learnerHome/ProductivityCharts';
import EmotionTimelineAnalysis from '../components/learnerHome/EmotionTimeline';

const Dashboard2 = () => {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F5EFE6' }}>
      {/* Innovative Sidebar */}
      <SideBar/>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-80 h-screen overflow-y-auto">
        {/* Top Navigation Bar */}
        <Header/>
        <div className="flex-1 p-8 overflow-y-auto">
          {/* Emotion Timeline - Full Width */}
          <EmotionTimelineAnalysis />

          {/* Split Layout for Pie Chart and Bar Chart */}
          <ProductivityCharts />

          {/* AI Recommendations - Horizontal Cards */}
          <Recommendation />
        </div>
      </div>
    </div>
  );
};

export default Dashboard2;
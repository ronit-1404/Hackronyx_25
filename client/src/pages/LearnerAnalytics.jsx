import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/headers/Header';
import SideBar from '../components/sideBar/SideBar';
import FocusHeatmap from '../components/learnerDash/Heatmap';
import EngagementChart from '../components/learnerDash/EngagementCurve';
import DashboardCharts from '../components/learnerDash/DashboardCharts';
import PeerMetrics from '../components/learnerDash/PeerMetrics';
import ContentAnalysis from '../components/learnerDash/ContentAnalysis';

const LearnerAnalytics = () => {
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  // Individual component animation variants
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Sidebar animation
  const sidebarVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Header animation
  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex" 
      style={{ backgroundColor: '#F5EFE6' }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Sidebar */}
      <motion.div variants={sidebarVariants}>
        <SideBar />
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-80 h-screen overflow-y-auto">
        {/* Top Navigation Bar */}
        <motion.div variants={headerVariants}>
          <Header />
        </motion.div>

        <motion.div 
          className="flex-1 p-8 overflow-y-auto"
          variants={containerVariants}
        >
          {/* Focus Heatmap - Full Width */}
          <motion.div variants={itemVariants}>
            <FocusHeatmap />
          </motion.div>

          {/* New Engagement vs Benchmark Line Chart - Full Width */}
          <motion.div variants={itemVariants}>
            <EngagementChart />
          </motion.div>

          {/* Charts Grid */}
          <motion.div variants={itemVariants}>
            <DashboardCharts />
          </motion.div>

          {/* Updated Performance Radar Chart - Your Focus vs Peer Median */}
          <motion.div variants={itemVariants}>
            <PeerMetrics />
          </motion.div>

          {/* Content Analysis */}
          <motion.div variants={itemVariants}>
            <ContentAnalysis />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LearnerAnalytics;
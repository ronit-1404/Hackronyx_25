import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/headers/Header';
import SideBar from '../components/sideBar/SideBar';
import Recommendation from '../components/learnerHome/Recommendation';
import ProductivityCharts from '../components/learnerHome/ProductivityCharts';
import EmotionTimelineAnalysis from '../components/learnerHome/EmotionTimeline';

const Dashboard2 = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const sidebarVariants = {
    hidden: { x: -320, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const mainContentVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.3
      }
    }
  };

  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const contentSectionVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex" 
      style={{ backgroundColor: '#F5EFE6' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Innovative Sidebar */}
      <motion.div
        variants={sidebarVariants}
        className="fixed left-0 top-0 h-full z-10"
      >
        <SideBar/>
      </motion.div>

      {/* Main Content Area */}
      <motion.div 
        className="flex-1 flex flex-col ml-80 h-screen overflow-y-auto"
        variants={mainContentVariants}
      >
        {/* Top Navigation Bar */}
        <motion.div
          variants={headerVariants}
          className="sticky top-0 z-20"
        >
          <Header/>
        </motion.div>

        <motion.div 
          className="flex-1 p-8 overflow-y-auto"
          variants={staggerContainerVariants}
        >
          {/* Emotion Timeline - Full Width */}
          <motion.div
            variants={contentSectionVariants}
            whileHover={{ 
              scale: 1.01,
              transition: { duration: 0.2 }
            }}
          >
            <EmotionTimelineAnalysis />
          </motion.div>

          {/* Split Layout for Pie Chart and Bar Chart */}
          <motion.div
            variants={contentSectionVariants}
            whileHover={{ 
              scale: 1.005,
              transition: { duration: 0.2 }
            }}
          >
            <ProductivityCharts />
          </motion.div>

          {/* AI Recommendations - Horizontal Cards */}
          <motion.div
            variants={contentSectionVariants}
            whileHover={{ 
              scale: 1.005,
              transition: { duration: 0.2 }
            }}
          >
            <Recommendation />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard2;
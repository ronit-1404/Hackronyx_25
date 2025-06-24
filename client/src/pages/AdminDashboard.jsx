import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AdminHeader from "../components/headers/AdminHeader";
import AdminSideBar from "../components/sideBar/AdminSideBar";
import RealtimePerformanceMetrics from "../components/adminDash/RealtimePerformanceMetrics";
import Heatmap from "../components/adminDash/Heatmap";
import StudentEmotionChart from "../components/adminDash/StudentEmotionChart";
import SystemRecomendation from "../components/adminDash/SystemRecomendation";
import AiIntervention from "../components/adminDash/AiIntervention";

const AdminDashboard = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
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

  const headerVariants = {
    hidden: { y: -60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.2
      }
    }
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex" 
      style={{ backgroundColor: "#F5EFE6" }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Enhanced Sidebar with animation */}
      <motion.div variants={sidebarVariants}>
        <AdminSideBar />
      </motion.div>

      {/* Main Content Area */}
      <motion.div 
        className="flex-1 flex flex-col ml-80 h-screen overflow-y-auto"
        variants={itemVariants}
      >
        {/* Top Navigation Bar with animation */}
        <motion.div variants={headerVariants}>
          <AdminHeader />
        </motion.div>

        <motion.div 
          className="flex-1 p-8 overflow-y-auto"
          variants={containerVariants}
        >
          {/* Real-time Performance Chart */}
          <motion.div variants={itemVariants}>
            <RealtimePerformanceMetrics />
          </motion.div>

          {/* Enhanced Engagement Heatmap */}
          <motion.div variants={itemVariants}>
            <Heatmap />
          </motion.div>

          {/* Split Layout for Charts */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
            variants={gridVariants}
          >
            {/* Emotion Distribution */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <StudentEmotionChart />
            </motion.div>

            {/* AI Intervention Performance */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <AiIntervention />
            </motion.div>
          </motion.div>

          {/* AI Recommendations */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ 
              y: -5,
              transition: { duration: 0.2 }
            }}
          >
            <SystemRecomendation />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
import React, { useState, useEffect } from 'react';
// OLD IMPORT - Without useParams and useLocation
// import { useNavigate } from 'react-router-dom';
// NEW IMPORT - With useParams and useLocation for dynamic routing
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/headers/Header';
import SideBar from '../components/sideBar/SideBar';
import FocusHeatmap from '../components/learnerDash/Heatmap';
import EngagementChart from '../components/learnerDash/EngagementCurve';
import DashboardCharts from '../components/learnerDash/DashboardCharts';
import PeerMetrics from '../components/learnerDash/PeerMetrics';
import ContentAnalysis from '../components/learnerDash/ContentAnalysis';

const LearnerAnalytics = () => {
  const navigate = useNavigate();
  // OLD - Without URL parameters
  // const { studentId } = useParams();
  // const location = useLocation();
  
  // NEW CODE - Extract both studentId and studentName from URL
  const { studentId, studentName: urlStudentName } = useParams();
  const location = useLocation();
  
  // Determine if this is admin view based on the URL path
  const isAdminView = location.pathname.includes('/admin/students/');
  const currentStudentId = studentId; // From URL params
  
  // OLD CODE - Manual student name lookup
  // const [studentName, setStudentName] = useState('');
  // useEffect(() => {
  //   if (isAdminView && currentStudentId) {
  //     const sampleStudents = [
  //       { id: "1", name: "Priya Sharma" },
  //       { id: "2", name: "Arjun Singh" },
  //       { id: "3", name: "Ananya Patel" },
  //       { id: "4", name: "Rohit Kumar" },
  //       { id: "5", name: "Kavya Reddy" },
  //       { id: "6", name: "Aditya Gupta" }
  //     ];
  //     
  //     const student = sampleStudents.find(s => s.id === currentStudentId);
  //     if (student) {
  //       setStudentName(student.name);
  //     }
  //   }
  // }, [isAdminView, currentStudentId]);

  // NEW CODE - Format the student name from URL (convert back from URL format)
  const studentName = urlStudentName 
    ? urlStudentName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : '';

  useEffect(() => {
    // If admin is viewing a specific student
    if (isAdminView && currentStudentId) {
      console.log('Admin viewing analytics for student:', {
        studentId: currentStudentId,
        studentName: studentName || 'Unknown'
      });
    }
  }, [isAdminView, currentStudentId, studentName]);
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
          {/* Admin View Header - Show when viewing from admin */}
          {isAdminView && (
            <motion.div 
              variants={itemVariants}
              className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-blue-900">
                    Admin View: {studentName || `Student ${currentStudentId}`}'s Analytics
                  </h2>
                  <p className="text-sm text-blue-700">Student ID: {currentStudentId}</p>
                  {studentName && (
                    <p className="text-xs text-blue-600 mt-1">
                      URL: /admin/students/{currentStudentId}/{urlStudentName}/learner/analytics
                    </p>
                  )}
                </div>
                <button
                  onClick={() => navigate('/admin/students')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  ← Back to Students
                </button>
              </div>
            </motion.div>
          )}

          {/* Focus Heatmap - Full Width */}
          <motion.div variants={itemVariants}>
            <FocusHeatmap studentId={currentStudentId} />
          </motion.div>

          {/* New Engagement vs Benchmark Line Chart - Full Width */}
          <motion.div variants={itemVariants}>
            <EngagementChart studentId={currentStudentId} />
          </motion.div>

          {/* Charts Grid */}
          <motion.div variants={itemVariants}>
            <DashboardCharts studentId={currentStudentId} />
          </motion.div>

          {/* Updated Performance Radar Chart - Your Focus vs Peer Median */}
          <motion.div variants={itemVariants}>
            <PeerMetrics studentId={currentStudentId} />
          </motion.div>

          {/* Content Analysis */}
          <motion.div variants={itemVariants}>
            <ContentAnalysis studentId={currentStudentId} />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LearnerAnalytics;
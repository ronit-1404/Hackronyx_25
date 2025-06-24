import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminHeader from '../components/headers/AdminHeader';
import ClassDashboard from '../components/adminClass/ClassComponent';
import SearchFilterComponent from '../components/adminClass/SearchComponent';
import StatsCards from '../components/adminClass/StatsCard';

const AdminClasses = () => {
  // Animation variants
  const pageVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const headerVariants = {
    hidden: { 
      y: -60, 
      opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const contentVariants = {
    hidden: { 
      opacity: 0,
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const sectionVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  // Hover effects
  const hoverEffect = {
    scale: 1.01,
    y: -2,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  };

  return (
    <motion.div 
      className="min-h-screen" 
      style={{ backgroundColor: '#F5EFE6' }}
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {/* Header */}
      <motion.div variants={headerVariants}>
        <AdminHeader />
      </motion.div>

      <motion.div 
        className="p-8"
        variants={containerVariants}
      >
        {/* Summary Cards */}
        <motion.div 
          variants={sectionVariants}
          whileHover={hoverEffect}
        >
          <StatsCards />
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div 
          variants={sectionVariants}
          whileHover={{
            scale: 1.005,
            transition: { duration: 0.2 }
          }}
        >
          <SearchFilterComponent />
        </motion.div>

        {/* Class Cards Grid */}
        <motion.div 
          variants={sectionVariants}
          whileHover={hoverEffect}
        >
          <ClassDashboard />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AdminClasses;
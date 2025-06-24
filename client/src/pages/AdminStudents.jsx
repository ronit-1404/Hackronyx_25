import React, { useState } from "react";
import { User, Search, BarChart2, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import AdminHeader from "../components/headers/AdminHeader";
import StudentCards from "../components/adminStudents/StudentsCard";

const AdminStudents = () => {
  return (
    <motion.div 
      className="min-h-screen bg-[#F5EFE6] p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="bg-white rounded-xl border border-gray-200 p-6 mb-6 sticky top-0 z-10 shadow-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <AdminHeader/>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        <StudentCards/>
      </motion.div>
    </motion.div>
  );
};

export default AdminStudents;
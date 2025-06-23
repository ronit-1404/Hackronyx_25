import React, { useState } from "react";
import { User, Search, BarChart2, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import AdminHeader from "../components/headers/AdminHeader";
import StudentCards from "../components/adminStudents/StudentsCard";

const AdminStudents = () => {
  return (
    <div className="min-h-screen bg-[#F5EFE6] p-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 sticky top-0 z-10 shadow-sm">
        <AdminHeader/>
      </div>

      <StudentCards/>
    </div>
  );
};

export default AdminStudents;
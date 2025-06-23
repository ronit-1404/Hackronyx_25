import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../components/headers/AdminHeader';
import ClassDashboard from '../components/adminClass/ClassComponent';
import SearchFilterComponent from '../components/adminClass/SearchComponent';
import StatsCards from '../components/adminClass/StatsCard';

const AdminClasses = () => {

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5EFE6' }}>
      {/* Header */}
      <AdminHeader/>

      <div className="p-8">
        {/* Summary Cards */}
        <StatsCards />

        {/* Search and Filter Bar */}
        <SearchFilterComponent/>

        {/* Class Cards Grid */}
        <ClassDashboard/>
      </div>
    </div>
  );
};

export default AdminClasses;
import React, { useState } from 'react';
import { Search, Filter, BarChart3 } from 'lucide-react';

export default function SearchFilterComponent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleExportReport = () => {
    // Export functionality would go here
    console.log('Exporting report...');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search classes, teachers, or codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent"
            >
              <option value="all">All Classes</option>
              <option value="alerts">With Alerts</option>
              <option value="high-engagement">High Engagement (85%+)</option>
            </select>
          </div>
          <button 
            onClick={handleExportReport}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium transition-all shadow-sm hover:shadow-md"
            style={{ backgroundColor: '#000000' }}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}
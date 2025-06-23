import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, Grid3X3 } from 'lucide-react';

// Sample weekly trend data
const weeklyTrendData = [
  { day: 'Mon', focus: 85, productivity: 78 },
  { day: 'Tue', focus: 92, productivity: 88 },
  { day: 'Wed', focus: 78, productivity: 82 },
  { day: 'Thu', focus: 95, productivity: 91 },
  { day: 'Fri', focus: 88, productivity: 85 },
  { day: 'Sat', focus: 72, productivity: 68 },
  { day: 'Sun', focus: 65, productivity: 62 }
];

// Sample activity distribution data
const activityData = [
    { name: 'Social Media', value: 35, color: '#F67280' },
    { name: 'Course Platform', value: 45, color: '#C06C84' },
    { name: 'Video Lecture', value: 20, color: '#6C5B7B' }
  ];

const DashboardCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Weekly Trend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <TrendingUp className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Weekly Trends</h2>
            <p className="text-sm text-gray-600">Focus and productivity over time</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={weeklyTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0', 
                borderRadius: '12px', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
              }} 
            />
            <Area type="monotone" dataKey="focus" stackId="1" stroke="#F67280" fill="#F67280" fillOpacity={0.6} />
            <Area type="monotone" dataKey="productivity" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Updated Learning Activity Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Grid3X3 className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Activity Distribution</h2>
            <p className="text-sm text-gray-600">How you spend your digital learning time</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={activityData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {activityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0', 
                borderRadius: '12px', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
              }} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;
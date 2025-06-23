import React from 'react';
import { Monitor, BookOpen } from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';

export default function ProductivityCharts() {
  // Sample productivity data
  const productivityData = [
    { name: 'Learning Apps', time: 180, productivity: 85 },
    { name: 'Social Media', time: 45, productivity: 20 },
    { name: 'Games', time: 30, productivity: 15 },
    { name: 'Study Tools', time: 120, productivity: 90 },
    { name: 'Entertainment', time: 60, productivity: 25 },
    { name: 'Communication', time: 40, productivity: 60 }
  ];

  // Colors for the pie chart
  const pieColors = ['#F67280', '#C06C84', '#6C5B7B', '#355C7D', '#2F4858', '#1A535C'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* App Usage Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Monitor className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
          <h2 className="text-xl font-semibold text-gray-900">App Distribution</h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie 
              data={productivityData} 
              cx="50%" 
              cy="50%" 
              labelLine={false} 
              label={({ name, time }) => `${name}: ${time}m`} 
              outerRadius={100} 
              fill="#8884d8" 
              dataKey="time"
            >
              {productivityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
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

      {/* Productivity Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <BookOpen className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
          <h2 className="text-xl font-semibold text-gray-900">Productivity Metrics</h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={productivityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              stroke="#64748b" 
              fontSize={11} 
              angle={-35} 
              textAnchor="end" 
              height={80} 
            />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0', 
                borderRadius: '12px', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
              }} 
            />
            <Bar 
              dataKey="productivity" 
              fill="#F67280" 
              radius={[6, 6, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';

const AiIntervention = () => {
  // Sample intervention data - ensuring data is visible
  const interventionData = [
    { name: 'Computer Science', success: 96 },
    { name: 'Chemistry', success: 94 },
    { name: 'Mathematics', success: 92 },
    { name: 'History', success: 91 },
    { name: 'Biology', success: 89 },
    { name: 'Physics', success: 87 },
    { name: 'Literature', success: 85 }
  ];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-indigo-600">
            Success Rate: <span className="font-bold">{payload[0].value}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom bar component for hover effects
  const CustomBar = (props) => {
    const [isHovered, setIsHovered] = useState(false);
    
    // Filter out non-DOM props
    const { 
      fill, 
      dataKey, 
      tooltipPayload, 
      tooltipPosition, 
      index,
      payload,
      ...domProps 
    } = props;
    
    return (
      <rect
        {...domProps}
        fill={isHovered ? '#3B82F6' : '#6366F1'}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ 
          cursor: 'pointer',
          transition: 'fill 0.2s ease-in-out'
        }}
      />
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <Zap className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
        <h2 className="text-xl font-semibold text-gray-900">AI Intervention Success Rate</h2>
      </div>
      
      {/* Data preview - shows the actual values being plotted */}
      {/* <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">Current Data Points:</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {interventionData.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-blue-700">{item.name}:</span>
              <span className="font-semibold text-blue-900">{item.success}%</span>
            </div>
          ))}
        </div>
      </div> */}
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={interventionData} layout="horizontal" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            type="number" 
            domain={[0, 100]} 
            stroke="#64748b" 
            fontSize={12}
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            stroke="#64748b" 
            fontSize={11} 
            width={100}
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
          />
          <Bar 
            dataKey="success" 
            fill="#6366F1" 
            radius={[0, 6, 6, 0]}
            shape={<CustomBar />}
          />
        </BarChart>
      </ResponsiveContainer>
      
      {/* Summary statistics */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">
            {Math.max(...interventionData.map(d => d.success))}%
          </div>
          <div className="text-xs text-gray-600">Highest</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">
            {Math.round(interventionData.reduce((acc, d) => acc + d.success, 0) / interventionData.length)}%
          </div>
          <div className="text-xs text-gray-600">Average</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">
            {Math.min(...interventionData.map(d => d.success))}%
          </div>
          <div className="text-xs text-gray-600">Lowest</div>
        </div>
      </div>
    </div>
  );
};

export default AiIntervention;
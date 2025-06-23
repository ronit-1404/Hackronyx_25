import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Brain } from 'lucide-react';

const StudentEmotionChart = () => {
  // Sample emotion distribution data
  const emotionDistribution = [
    { name: 'Happy', value: 35, color: '#10B981' },
    { name: 'Focused', value: 28, color: '#3B82F6' },
    { name: 'Confused', value: 15, color: '#F59E0B' },
    { name: 'Frustrated', value: 12, color: '#EF4444' },
    { name: 'Excited', value: 6, color: '#8B5CF6' },
    { name: 'Bored', value: 4, color: '#6B7280' }
  ];

  // Custom label function for better readability
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    if (percent < 0.05) return null; // Hide labels for segments smaller than 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="500"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Custom tooltip content
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">{data.value}%</span> of students
          </p>
        </div>
      );
    }
    return null;
  };

  const totalStudents = 247; // Sample total for context

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Brain className="w-6 h-6 mr-3" style={{ color: "#F67280" }} />
          <h2 className="text-xl font-semibold text-gray-900">
            Student Emotion Distribution
          </h2>
        </div>
        <div className="text-sm text-gray-500">
          Based on {totalStudents} responses
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={emotionDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {emotionDistribution.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend with Statistics */}
        <div className="flex flex-col justify-center space-y-3">
          <h3 className="font-semibold text-gray-900 mb-2">Emotion Breakdown</h3>
          {emotionDistribution.map((emotion, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-3" 
                  style={{ backgroundColor: emotion.color }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {emotion.name}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">{emotion.value}%</span>
                <span className="text-xs text-gray-400 ml-1">
                  ({Math.round(totalStudents * emotion.value / 100)})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-lg font-bold text-green-600">
              {emotionDistribution.find(e => e.name === 'Happy')?.value}%
            </div>
            <div className="text-xs text-gray-600">Positive Mood</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-lg font-bold text-blue-600">
              {emotionDistribution.find(e => e.name === 'Focused')?.value}%
            </div>
            <div className="text-xs text-gray-600">Engaged</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="text-lg font-bold text-yellow-600">
              {emotionDistribution.find(e => e.name === 'Confused')?.value}%
            </div>
            <div className="text-xs text-gray-600">Need Support</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <div className="text-lg font-bold text-red-600">
              {emotionDistribution.find(e => e.name === 'Frustrated')?.value}%
            </div>
            <div className="text-xs text-gray-600">Struggling</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentEmotionChart;
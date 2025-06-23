import React from 'react';
import { Activity } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function EmotionTimelineAnalysis() {
  // Sample emotion timeline data
  const emotionTimelineData = [
    { time: '9:00', focused: 85, confused: 10, bored: 5, frustrated: 0 },
    { time: '9:30', focused: 75, confused: 15, bored: 8, frustrated: 2 },
    { time: '10:00', focused: 90, confused: 5, bored: 3, frustrated: 2 },
    { time: '10:30', focused: 65, confused: 25, bored: 5, frustrated: 5 },
    { time: '11:00', focused: 45, confused: 35, bored: 10, frustrated: 10 },
    { time: '11:30', focused: 60, confused: 20, bored: 15, frustrated: 5 },
    { time: '12:00', focused: 80, confused: 10, bored: 8, frustrated: 2 },
    { time: '12:30', focused: 70, confused: 15, bored: 12, frustrated: 3 },
    { time: '1:00', focused: 55, confused: 20, bored: 20, frustrated: 5 },
    { time: '1:30', focused: 85, confused: 8, bored: 5, frustrated: 2 },
    { time: '2:00', focused: 92, confused: 5, bored: 2, frustrated: 1 },
    { time: '2:30', focused: 88, confused: 7, bored: 3, frustrated: 2 }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center mb-6">
        <Activity className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
        <h2 className="text-xl font-semibold text-gray-900">Emotion Timeline Analysis</h2>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={emotionTimelineData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e2e8f0', 
              borderRadius: '12px', 
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
            }} 
          />
          <Line 
            type="monotone" 
            dataKey="focused" 
            stroke="#10B981" 
            strokeWidth={3} 
            dot={{ fill: '#10B981', strokeWidth: 2, r: 5 }} 
            activeDot={{ r: 7, stroke: '#10B981', strokeWidth: 2 }} 
          />
          <Line 
            type="monotone" 
            dataKey="confused" 
            stroke="#F59E0B" 
            strokeWidth={3} 
            dot={{ fill: '#F59E0B', strokeWidth: 2, r: 5 }} 
            activeDot={{ r: 7, stroke: '#F59E0B', strokeWidth: 2 }} 
          />
          <Line 
            type="monotone" 
            dataKey="bored" 
            stroke="#6B7280" 
            strokeWidth={3} 
            dot={{ fill: '#6B7280', strokeWidth: 2, r: 5 }} 
            activeDot={{ r: 7, stroke: '#6B7280', strokeWidth: 2 }} 
          />
          <Line 
            type="monotone" 
            dataKey="frustrated" 
            stroke="#EF4444" 
            strokeWidth={3} 
            dot={{ fill: '#EF4444', strokeWidth: 2, r: 5 }} 
            activeDot={{ r: 7, stroke: '#EF4444', strokeWidth: 2 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
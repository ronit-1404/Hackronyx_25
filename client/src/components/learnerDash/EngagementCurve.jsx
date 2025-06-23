import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

// Sample engagement benchmark data
const engagementBenchmarkData = [
  { week: 'Week 1', avgEngagement: 78, personalBenchmark: 85 },
  { week: 'Week 2', avgEngagement: 82, personalBenchmark: 85 },
  { week: 'Week 3', avgEngagement: 79, personalBenchmark: 85 },
  { week: 'Week 4', avgEngagement: 88, personalBenchmark: 85 },
  { week: 'Week 5', avgEngagement: 91, personalBenchmark: 85 },
  { week: 'Week 6', avgEngagement: 85, personalBenchmark: 85 },
  { week: 'Week 7', avgEngagement: 93, personalBenchmark: 85 },
  { week: 'Week 8', avgEngagement: 87, personalBenchmark: 85 },
  { week: 'Week 9', avgEngagement: 89, personalBenchmark: 85 },
  { week: 'Week 10', avgEngagement: 94, personalBenchmark: 85 },
  { week: 'Week 11', avgEngagement: 92, personalBenchmark: 85 },
  { week: 'Week 12', avgEngagement: 96, personalBenchmark: 85 }
];

const EngagementChart = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center mb-6">
        <Activity className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Weekly Engagement vs Personal Benchmark</h2>
          <p className="text-sm text-gray-600">Track your engagement scores against your personal targets</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={engagementBenchmarkData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} domain={[70, 100]} />
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
            dataKey="avgEngagement"
            stroke="#F67280"
            strokeWidth={3}
            dot={{ fill: '#F67280', strokeWidth: 2, r: 6 }}
            name="Avg Engagement"
          />
          <Line
            type="monotone"
            dataKey="personalBenchmark"
            stroke="#10B981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            name="Personal Benchmark"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EngagementChart;
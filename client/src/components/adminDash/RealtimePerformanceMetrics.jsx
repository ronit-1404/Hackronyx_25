import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar } from 'recharts';
import { Activity, Users, Brain, AlertTriangle, TrendingUp, Clock } from 'lucide-react';

const RealtimePerformanceMetrics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [performanceTrend, setPerformanceTrend] = useState([]);
  const [liveMetrics, setLiveMetrics] = useState({
    activeStudents: 0,
    avgEngagement: 0,
    interventions: 0,
    confusionRate: 0
  });

  // Generate realistic performance data
  const generateDataPoint = (time) => {
    const hour = time.getHours();
    const minute = time.getMinutes();
    
    // Simulate realistic patterns based on time of day
    let baseEngagement = 70;
    let baseProductivity = 65;
    let baseConfusion = 20;
    
    // Peak hours (9-11 AM, 2-4 PM)
    if ((hour >= 9 && hour <= 11) || (hour >= 14 && hour <= 16)) {
      baseEngagement += 15;
      baseProductivity += 20;
      baseConfusion -= 5;
    }
    
    // Add some randomness
    const engagement = Math.max(0, Math.min(100, baseEngagement + (Math.random() - 0.5) * 20));
    const productivity = Math.max(0, Math.min(100, baseProductivity + (Math.random() - 0.5) * 25));
    const confusion = Math.max(0, Math.min(50, baseConfusion + (Math.random() - 0.5) * 15));
    
    return {
      time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      engagement: Math.round(engagement),
      productivity: Math.round(productivity),
      confusion: Math.round(confusion),
      activeStudents: Math.floor(120 + Math.random() * 80),
      interventions: Math.floor(confusion / 5)
    };
  };

  // Initialize with some historical data
  useEffect(() => {
    const initialData = [];
    const now = new Date();
    for (let i = 9; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000); // 1 minute intervals
      initialData.push(generateDataPoint(time));
    }
    setPerformanceTrend(initialData);
  }, []);

  // Update data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      const newDataPoint = generateDataPoint(now);
      
      setPerformanceTrend(prev => {
        const updated = [...prev, newDataPoint];
        return updated.slice(-10); // Keep only last 10 points
      });
      
      // Update live metrics
      setLiveMetrics({
        activeStudents: newDataPoint.activeStudents,
        avgEngagement: newDataPoint.engagement,
        interventions: newDataPoint.interventions,
        confusionRate: newDataPoint.confusion
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Set initial live metrics
  useEffect(() => {
    if (performanceTrend.length > 0) {
      const latest = performanceTrend[performanceTrend.length - 1];
      setLiveMetrics({
        activeStudents: latest.activeStudents,
        avgEngagement: latest.engagement,
        interventions: latest.interventions,
        confusionRate: latest.confusion
      });
    }
  }, [performanceTrend]);

  const renderChart = () => {
    switch (activeTab) {
      case 'engagement':
        return (
          <LineChart data={performanceTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Line 
              type="monotone" 
              dataKey="engagement" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        );
      
      case 'interventions':
        return (
          <BarChart data={performanceTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Bar dataKey="interventions" fill="#EF4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="confusion" fill="#F59E0B" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      
      default:
        return (
          <AreaChart data={performanceTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="engagement"
              stackId="1"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.3}
            />
            <Area
              type="monotone"
              dataKey="productivity"
              stackId="1"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.3}
            />
            <Area
              type="monotone"
              dataKey="confusion"
              stackId="2"
              stroke="#EF4444"
              fill="#EF4444"
              fillOpacity={0.3}
            />
          </AreaChart>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Activity
            className="w-6 h-6 mr-3"
            style={{ color: "#F67280" }}
          />
          <h2 className="text-xl font-semibold text-gray-900">
            Real-time Performance Metrics
          </h2>
          <div className="ml-4 flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Live</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            {currentTime.toLocaleTimeString()}
          </div>
          <div className="flex space-x-2">
            {["overview", "engagement", "interventions"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-[#F67280] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {liveMetrics.activeStudents}
              </div>
              <div className="text-sm text-blue-800">Active Students</div>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {liveMetrics.avgEngagement}%
              </div>
              <div className="text-sm text-green-800">Avg Engagement</div>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">
                {liveMetrics.interventions}
              </div>
              <div className="text-sm text-red-800">Interventions</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {liveMetrics.confusionRate}%
              </div>
              <div className="text-sm text-yellow-800">Confusion Rate</div>
            </div>
            <Brain className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        {renderChart()}
      </ResponsiveContainer>

      {/* Status Bar */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Engagement</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Productivity</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Confusion</span>
          </div>
        </div>
        <div>
          Updates every 30 seconds • Last updated: {currentTime.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default RealtimePerformanceMetrics;
import React, { useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Target, TrendingUp, TrendingDown, Minus, Award, Users } from 'lucide-react';

const PeerMetrics = () => {
  const [selectedMetric, setSelectedMetric] = useState('focus');
  
  const performanceData = [
    { 
      subject: 'Mathematics', 
      yourFocus: 85, 
      peerMedian: 78, 
      yourEngagement: 82,
      peerEngagementMedian: 75,
      yourCompletion: 92,
      peerCompletionMedian: 88,
      fullMark: 100 
    },
    { 
      subject: 'Science', 
      yourFocus: 92, 
      peerMedian: 84, 
      yourEngagement: 89,
      peerEngagementMedian: 81,
      yourCompletion: 95,
      peerCompletionMedian: 90,
      fullMark: 100 
    },
    { 
      subject: 'Literature', 
      yourFocus: 78, 
      peerMedian: 82, 
      yourEngagement: 85,
      peerEngagementMedian: 83,
      yourCompletion: 88,
      peerCompletionMedian: 85,
      fullMark: 100 
    },
    { 
      subject: 'History', 
      yourFocus: 88, 
      peerMedian: 79, 
      yourEngagement: 91,
      peerEngagementMedian: 77,
      yourCompletion: 86,
      peerCompletionMedian: 82,
      fullMark: 100 
    },
    { 
      subject: 'Languages', 
      yourFocus: 94, 
      peerMedian: 87, 
      yourEngagement: 96,
      peerEngagementMedian: 89,
      yourCompletion: 98,
      peerCompletionMedian: 91,
      fullMark: 100 
    },
    { 
      subject: 'Arts', 
      yourFocus: 76, 
      peerMedian: 81, 
      yourEngagement: 79,
      peerEngagementMedian: 84,
      yourCompletion: 83,
      peerCompletionMedian: 87,
      fullMark: 100 
    }
  ];

  const getMetricData = () => {
    switch(selectedMetric) {
      case 'engagement':
        return performanceData.map(item => ({
          ...item,
          yourScore: item.yourEngagement,
          peerScore: item.peerEngagementMedian
        }));
      case 'completion':
        return performanceData.map(item => ({
          ...item,
          yourScore: item.yourCompletion,
          peerScore: item.peerCompletionMedian
        }));
      default:
        return performanceData.map(item => ({
          ...item,
          yourScore: item.yourFocus,
          peerScore: item.peerMedian
        }));
    }
  };

  const calculateOverallStats = () => {
    const data = getMetricData();
    const yourAvg = data.reduce((sum, item) => sum + item.yourScore, 0) / data.length;
    const peerAvg = data.reduce((sum, item) => sum + item.peerScore, 0) / data.length;
    const difference = yourAvg - peerAvg;
    
    return {
      yourAvg: Math.round(yourAvg),
      peerAvg: Math.round(peerAvg),
      difference: Math.round(difference),
      betterSubjects: data.filter(item => item.yourScore > item.peerScore).length,
      totalSubjects: data.length
    };
  };

  const stats = calculateOverallStats();
  const currentData = getMetricData();

  const getComparisonIcon = (difference) => {
    if (difference > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (difference < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Target className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Performance vs Peer Comparison</h2>
            <p className="text-sm text-gray-600">Compare your scores with peer performance across subjects</p>
          </div>
        </div>
        
        {/* Metric Selector */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { key: 'focus', label: 'Focus' },
            { key: 'engagement', label: 'Engagement' },
            { key: 'completion', label: 'Completion' }
          ].map((metric) => (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedMetric === metric.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-pink-600 font-medium">Your Average</p>
              <p className="text-2xl font-bold text-pink-700">{stats.yourAvg}%</p>
            </div>
            <Award className="w-8 h-8 text-pink-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Peer Average</p>
              <p className="text-2xl font-bold text-green-700">{stats.peerAvg}%</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Difference</p>
              <p className="text-2xl font-bold text-blue-700 flex items-center gap-1">
                {getComparisonIcon(stats.difference)}
                {Math.abs(stats.difference)}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Leading In</p>
              <p className="text-2xl font-bold text-purple-700">
                {stats.betterSubjects}/{stats.totalSubjects}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={currentData}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#64748b' }} />
          <PolarRadiusAxis tick={{ fontSize: 10, fill: '#64748b' }} />
          <Radar
            name="Your Score"
            dataKey="yourScore"
            stroke="#F67280"
            fill="#F67280"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name="Peer Median"
            dataKey="peerScore"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.2}
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>

      {/* Subject-wise Performance */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject-wise Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentData.map((subject, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900 text-sm">{subject.subject}</span>
                {getComparisonIcon(subject.yourScore - subject.peerScore)}
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>You: {subject.yourScore}%</span>
                <span>Peer: {subject.peerScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${subject.yourScore}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PeerMetrics;
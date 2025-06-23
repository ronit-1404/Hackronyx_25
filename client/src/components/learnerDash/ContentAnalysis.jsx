import React, { useState } from 'react';
import { Eye, AlertTriangle, TrendingUp, Clock, RotateCcw, Target } from 'lucide-react';

const ContentAnalysis = () => {
  const [selectedView, setSelectedView] = useState('overview');

  const struggleZones = [
    {
      subject: 'Calculus: Derivatives',
      pauses: 3,
      severity: 'high',
      color: 'red',
      details: [
        { time: '4:23', duration: 15, rewatches: 2 },
        { time: '7:41', duration: 8, rewatches: 1 },
        { time: '12:15', duration: 22, rewatches: 3 }
      ]
    },
    {
      subject: 'Physics: Quantum Mechanics',
      pauses: 2,
      severity: 'medium',
      color: 'yellow',
      details: [
        { time: '9:12', duration: 12, rewatches: 1 },
        { time: '15:30', duration: 6, rewatches: 2 }
      ]
    },
    {
      subject: 'Chemistry: Organic Reactions',
      pauses: 1,
      severity: 'low',
      color: 'orange',
      details: [
        { time: '6:45', duration: 9, rewatches: 1 }
      ]
    }
  ];

  const resourceEffectiveness = [
    {
      type: 'Interactive Labs',
      score: 85,
      color: 'green-600',
      bgColor: 'green',
      recommendation: 'Outstanding results, preferred learning method'
    },
    {
      type: 'Quizzes',
      score: 80,
      color: 'green-500',
      bgColor: 'green',
      recommendation: 'Excellent performance, increase frequency'
    },
    {
      type: 'Videos',
      score: 70,
      color: 'blue-500',
      bgColor: 'blue',
      recommendation: 'Good retention, consider interactive elements'
    },
    {
      type: 'Articles',
      score: 60,
      color: 'yellow-500',
      bgColor: 'yellow',
      recommendation: 'Moderate engagement, try shorter formats'
    },
    {
      type: 'Flashcards',
      score: 45,
      color: 'red-500',
      bgColor: 'red',
      recommendation: 'Low effectiveness, consider alternatives'
    }
  ];

  const getColorClasses = (color, type = 'bg') => {
    const colorMap = {
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        badge: 'bg-red-100 text-red-600',
        detail: 'text-red-700',
        accent: 'text-red-500'
      },
      yellow: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-800',
        badge: 'bg-yellow-100 text-yellow-600',
        detail: 'text-yellow-700',
        accent: 'text-yellow-600'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-800',
        badge: 'bg-orange-100 text-orange-600',
        detail: 'text-orange-700',
        accent: 'text-orange-600'
      }
    };
    return colorMap[color] || colorMap.red;
  };

  const getSeverityIcon = (severity) => {
    switch(severity) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <Target className="w-4 h-4 text-orange-500" />;
    }
  };

  const totalPauses = struggleZones.reduce((sum, zone) => sum + zone.pauses, 0);
  const averageEffectiveness = Math.round(
    resourceEffectiveness.reduce((sum, resource) => sum + resource.score, 0) / resourceEffectiveness.length
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Eye className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Content Analysis</h2>
            <p className="text-sm text-gray-600">Deep dive into learning patterns and resource effectiveness</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{totalPauses}</div>
            <div className="text-xs text-gray-500">Total Pauses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{averageEffectiveness}%</div>
            <div className="text-xs text-gray-500">Avg Effectiveness</div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Struggle Zones */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <h3 className="text-lg font-semibold text-gray-900">Struggle Zones</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Video timestamps</span>
          </div>
          
          <div className="space-y-3">
            {struggleZones.map((zone, index) => {
              const colors = getColorClasses(zone.color);
              return (
                <div key={index} className={`${colors.bg} ${colors.border} border rounded-lg p-4 hover:shadow-md transition-shadow`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(zone.severity)}
                      <span className={`text-sm font-medium ${colors.text}`}>{zone.subject}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${colors.badge}`}>
                      {zone.pauses} pause{zone.pauses !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className={`text-xs ${colors.detail} space-y-1`}>
                    {zone.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex justify-between items-center">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Paused at {detail.time} ({detail.duration} seconds)
                        </span>
                        <span className={`flex items-center gap-1 ${colors.accent}`}>
                          <RotateCcw className="w-3 h-3" />
                          Rewatched {detail.rewatches}x
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Resource Effectiveness */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <h3 className="text-lg font-semibold text-gray-900">Resource Effectiveness</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Engagement rates</span>
          </div>
          
          <div className="space-y-4">
            {resourceEffectiveness
              .sort((a, b) => b.score - a.score)
              .map((resource, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">{resource.type}</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{resource.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`bg-${resource.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${resource.score}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600">{resource.recommendation}</p>
                    <div className={`w-2 h-2 rounded-full bg-${resource.color}`}></div>
                  </div>
                </div>
              ))}
          </div>
          
          {/* Insights Summary */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Key Insights
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Interactive content shows 85% effectiveness - your preferred learning style</li>
              <li>• Calculus derivatives need extra attention (6 total rewatches)</li>
              <li>• Consider replacing flashcards with interactive alternatives</li>
              <li>• Quiz frequency should be increased based on high engagement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentAnalysis;
import React from 'react';
import { Calendar, Users, MessageSquare } from 'lucide-react';

const Heatmap = () => {
  // Sample engagement data for the week
  const engagementHeatmap = [
    { day: 'Mon', score: 85, students: 142, interventions: 8 },
    { day: 'Tue', score: 92, students: 156, interventions: 5 },
    { day: 'Wed', score: 78, students: 138, interventions: 12 },
    { day: 'Thu', score: 88, students: 149, interventions: 7 },
    { day: 'Fri', score: 95, students: 163, interventions: 3 },
    { day: 'Sat', score: 45, students: 89, interventions: 18 },
    { day: 'Sun', score: 38, students: 67, interventions: 22 }
  ];

  // Function to determine heatmap color based on engagement score
  const getHeatmapColor = (score) => {
    if (score >= 90) return '#10B981'; // Green - Excellent
    if (score >= 80) return '#3B82F6'; // Blue - Good
    if (score >= 70) return '#F59E0B'; // Yellow - Average
    if (score >= 60) return '#F97316'; // Orange - Below Average
    if (score >= 50) return '#EF4444'; // Red - Poor
    return '#6B7280'; // Gray - Very Poor
  };

  // Function to get engagement level text
  const getEngagementLevel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Average';
    if (score >= 60) return 'Below Avg';
    if (score >= 50) return 'Poor';
    return 'Very Poor';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Calendar className="w-6 h-6 mr-3" style={{ color: "#F67280" }} />
          <h2 className="text-xl font-semibold text-gray-900">
            Weekly Engagement Heatmap
          </h2>
        </div>
        <div className="text-sm text-gray-500">
          Current Week
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4 mb-6">
        {engagementHeatmap.map((day) => (
          <div key={day.day} className="text-center">
            <div className="mb-2">
              <div
                className="w-16 h-16 mx-auto rounded-xl flex flex-col items-center justify-center text-white font-bold shadow-lg transition-all hover:scale-105 cursor-pointer group relative"
                style={{ backgroundColor: getHeatmapColor(day.score) }}
                title={`${day.day}: ${getEngagementLevel(day.score)} engagement`}
              >
                <span className="text-lg">{day.score}</span>
                <span className="text-xs opacity-90">pts</span>
                
                {/* Hover tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10">
                  {getEngagementLevel(day.score)} Engagement
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">
              {day.day}
            </h3>
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex items-center justify-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{day.students}</span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <MessageSquare className="w-3 h-3" />
                <span>{day.interventions}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Engagement Level:</span>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#10B981' }}></div>
                <span className="text-xs text-gray-600">90+</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#3B82F6' }}></div>
                <span className="text-xs text-gray-600">80-89</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#F59E0B' }}></div>
                <span className="text-xs text-gray-600">70-79</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#F97316' }}></div>
                <span className="text-xs text-gray-600">60-69</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#EF4444' }}></div>
                <span className="text-xs text-gray-600">50-59</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#6B7280' }}></div>
                <span className="text-xs text-gray-600">&lt;50</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>Active Students</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="w-3 h-3" />
              <span>Interventions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="mt-4 bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">
              {Math.round(engagementHeatmap.reduce((sum, day) => sum + day.score, 0) / engagementHeatmap.length)}
            </div>
            <div className="text-xs text-gray-600">Avg Score</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">
              {Math.max(...engagementHeatmap.map(day => day.score))}
            </div>
            <div className="text-xs text-gray-600">Peak Day</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">
              {engagementHeatmap.reduce((sum, day) => sum + day.students, 0)}
            </div>
            <div className="text-xs text-gray-600">Total Students</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-600">
              {engagementHeatmap.reduce((sum, day) => sum + day.interventions, 0)}
            </div>
            <div className="text-xs text-gray-600">Interventions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
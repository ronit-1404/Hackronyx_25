import React, { useState } from 'react';
import { ThermometerSun } from 'lucide-react';

const FocusHeatmap = () => {
  const [hoveredCell, setHoveredCell] = useState(null);

  // Time slots (X-axis) - 24 hours
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    return hour === 0 ? '12 AM' : 
           hour < 12 ? `${hour} AM` : 
           hour === 12 ? '12 PM' : 
           `${hour - 12} PM`;
  });

  // Days of week labels (Y-axis)
  const daysOfWeek = [
    'Monday',
    'Tuesday', 
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  // Generate sample heatmap data - days × hours
  const generateHeatmapData = () => {
    return daysOfWeek.map((day, dayIndex) => {
      const dayData = { day };
      timeSlots.forEach((_, hourIndex) => {
        // Generate realistic focus patterns
        let baseScore = 2;
        
        // Different patterns for weekdays vs weekends
        const isWeekend = dayIndex >= 5; // Saturday and Sunday
        
        if (isWeekend) {
          // Weekend pattern - more relaxed, later start
          if (hourIndex >= 10 && hourIndex <= 16) {
            baseScore = 2.5 + Math.random() * 2;
          } else if (hourIndex < 8 || hourIndex > 20) {
            baseScore = 0.5 + Math.random() * 1.5;
          } else {
            baseScore = 1.5 + Math.random() * 2;
          }
        } else {
          // Weekday pattern - traditional work hours
          if (hourIndex >= 9 && hourIndex <= 17) {
            baseScore = 3.5 + Math.random() * 1.5;
          } else if (hourIndex < 6 || hourIndex > 22) {
            baseScore = 0.5 + Math.random() * 1.5;
          } else {
            baseScore = 1.5 + Math.random() * 2;
          }
        }
        
        // Add some daily variation
        const dailyVariation = (Math.sin(dayIndex * 0.5) * 0.3);
        const finalScore = Math.max(0, Math.min(5, baseScore + dailyVariation));
        
        dayData[hourIndex] = Math.round(finalScore * 10) / 10;
      });
      return dayData;
    });
  };

  const heatmapData = generateHeatmapData();

  // Color mapping function
  const getHeatmapColor = (value) => {
    if (value === 0) return '#f3f4f6'; // gray-100
    if (value <= 1) return '#fca5a5'; // red-300
    if (value <= 2) return '#fde047'; // yellow-300
    if (value <= 3) return '#86efac'; // green-300
    if (value <= 4) return '#4ade80'; // green-400
    return '#22c55e'; // green-500
  };

  // Intensity mapping for opacity
  const getHeatmapIntensity = (value) => {
    return Math.min(value / 5, 1);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <ThermometerSun className="w-6 h-6 mr-3" style={{ color: '#F67280' }} />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Focus Heatmap</h2>
            <p className="text-sm text-gray-600">Daily focus patterns throughout the day</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <span>Low</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded-sm bg-gray-200"></div>
              <div className="w-3 h-3 rounded-sm bg-red-300"></div>
              <div className="w-3 h-3 rounded-sm bg-yellow-300"></div>
              <div className="w-3 h-3 rounded-sm bg-green-300"></div>
              <div className="w-3 h-3 rounded-sm bg-green-500"></div>
            </div>
            <span>High</span>
          </div>
        </div>
      </div>
      
      {/* Custom Heatmap - Time on X-axis, Days on Y-axis */}
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Time header */}
          <div className="flex mb-2">
            <div className="w-24"></div>
            {timeSlots.map((time, index) => (
              <div key={index} className="w-12 text-center text-xs font-medium text-gray-600 px-1">
                <div className="transform -rotate-45 origin-center whitespace-nowrap">
                  {time}
                </div>
              </div>
            ))}
          </div>
          
          {/* Heatmap grid */}
          <div className="space-y-1">
            {heatmapData.map((dayData, dayIndex) => (
              <div key={dayIndex} className="flex items-center">
                <div className="w-24 text-sm text-gray-700 text-right pr-3 font-medium">
                  {dayData.day}
                </div>
                {timeSlots.map((_, hourIndex) => (
                  <div
                    key={`${dayIndex}-${hourIndex}`}
                    className="w-12 px-1"
                    onMouseEnter={() => setHoveredCell({ 
                      day: dayData.day, 
                      time: timeSlots[hourIndex], 
                      value: dayData[hourIndex] 
                    })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    <div
                      className="w-10 h-8 rounded-sm cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg flex items-center justify-center text-xs font-medium border border-gray-100"
                      style={{
                        backgroundColor: getHeatmapColor(dayData[hourIndex]),
                        opacity: 0.4 + (getHeatmapIntensity(dayData[hourIndex]) * 0.6),
                        color: dayData[hourIndex] >= 3 ? 'white' : '#374151'
                      }}
                    >
                      {dayData[hourIndex].toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Heatmap tooltip */}
      {hoveredCell && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-400">
          <p className="text-sm text-gray-700">
            <span className="font-medium">{hoveredCell.day} at {hoveredCell.time}:</span> 
            <span className="ml-2 px-2 py-1 bg-white rounded text-blue-600 font-semibold">
              Focus Score {hoveredCell.value}/5
            </span>
          </p>
        </div>
      )}
      
      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 text-sm mb-1">Weekday Peak</h3>
          <p className="text-blue-600 text-xs">9 AM - 5 PM highest focus</p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 text-sm mb-1">Weekend Pattern</h3>
          <p className="text-green-600 text-xs">Later start, more relaxed</p>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800 text-sm mb-1">Low Activity</h3>
          <p className="text-purple-600 text-xs">Early morning & late night</p>
        </div>
      </div>
    </div>
  );
};

export default FocusHeatmap;
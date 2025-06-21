import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import AudioAnalyzer from '../components/AudioAnalyzer';
import EngagementAnalyzer from '../components/EngagementAnalyzer';
import ContextAnalyzer from '../components/ContextAnalyzer';
import ScreenAnalyzer from '../components/ScreenAnalyzer';

const AnalysisPage = () => {
  const [emotion, setEmotion] = useState('');
  const [engagementScore, setEngagementScore] = useState(0);
  const [context, setContext] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [activeApp, setActiveApp] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const toggleAnalysis = () => {
    setIsAnalyzing(!isAnalyzing);
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] flex flex-col items-center py-10 px-2">
      {/* Header Bar */}
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-md border border-gray-200 mb-8 flex flex-col md:flex-row items-center justify-between px-8 py-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            Emotion, Engagement & Context Analyzer
          </h1>
          <p className="text-gray-500 text-sm">Real-time analysis powered by AI</p>
        </div>
        <button
          onClick={toggleAnalysis}
          className={`mt-4 md:mt-0 px-8 py-3 rounded-lg font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#F67280] focus:ring-offset-2 ${
            isAnalyzing
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-[#F67280] hover:bg-pink-600 text-white'
          }`}
        >
          {isAnalyzing ? 'Stop Analysis' : 'Start Analysis'}
        </button>
      </div>

      <DashboardLayout>
        <div className="grid grid-cols-1 gap-8 max-w-6xl mx-auto">
          {/* First row - 3 small analyzers */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col">
              <AudioAnalyzer 
                isAnalyzing={isAnalyzing} 
                onEmotionDetected={setEmotion} 
              />
            </div>
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col">
              <EngagementAnalyzer 
                isAnalyzing={isAnalyzing} 
                onEngagementScore={setEngagementScore} 
              />
            </div>
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col">
              <ContextAnalyzer 
                isAnalyzing={isAnalyzing}
                onContextDetected={setContext}
                onSentimentDetected={setSentiment}
                onActiveAppDetected={setActiveApp}
              />
            </div>
          </div>
          
          {/* Second row - Screen analyzer */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <ScreenAnalyzer isAnalyzing={isAnalyzing} />
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default AnalysisPage;
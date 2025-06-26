import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import AudioAnalyzer from '../components/AudioAnalyzer';
import EngagementAnalyzer from '../components/EngagementAnalyzer';
import ContextAnalyzer from '../components/ContextAnalyzer';
import ScreenAnalyzer from '../components/ScreenAnalyzer';

const AnalysisPage = () => {
  const navigate = useNavigate();
  const [emotion, setEmotion] = useState('');
  const [engagementScore, setEngagementScore] = useState(0);
  const [context, setContext] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [activeApp, setActiveApp] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const toggleAnalysis = () => {
    setIsAnalyzing(!isAnalyzing);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] flex flex-col items-center py-10 px-2">
      {/* Back Button */}
      <div className="w-full max-w-6xl mb-4">
        <button 
          onClick={handleGoBack}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 text-gray-700 font-medium transition-colors duration-150"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
      </div>
      
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
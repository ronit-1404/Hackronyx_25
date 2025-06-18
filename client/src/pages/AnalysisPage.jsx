import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import AudioAnalyzer from '../components/AudioAnalyzer';
import EngagementAnalyzer from '../components/EngagementAnalyzer';
import ContextAnalyzer from '../components/ContextAnalyzer';

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
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Emotion, Engagement & Context Analyzer
        </h1>
        <button
          onClick={toggleAnalysis}
          className={`px-6 py-2 rounded-md font-medium ${
            isAnalyzing
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isAnalyzing ? 'Stop Analysis' : 'Start Analysis'}
        </button>
      </header>

      <DashboardLayout>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AudioAnalyzer 
            isAnalyzing={isAnalyzing} 
            onEmotionDetected={setEmotion} 
          />
          <EngagementAnalyzer 
            isAnalyzing={isAnalyzing} 
            onEngagementScore={setEngagementScore} 
          />
          <ContextAnalyzer 
            isAnalyzing={isAnalyzing}
            onContextDetected={setContext}
            onSentimentDetected={setSentiment}
            onActiveAppDetected={setActiveApp}
          />
        </div>
      </DashboardLayout>
    </div>
  );
};

export default AnalysisPage;
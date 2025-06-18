import React, { useEffect, useState } from 'react';

const ContextAnalyzer = ({ 
  isAnalyzing, 
  onContextDetected, 
  onSentimentDetected, 
  onActiveAppDetected 
}) => {
  const [analysisCount, setAnalysisCount] = useState(0);

  useEffect(() => {
    let interval;
    if (isAnalyzing) {
      interval = setInterval(() => {
        simulateContextAnalysis();
        setAnalysisCount(prev => prev + 1);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const simulateContextAnalysis = () => {
    const contexts = ['coding', 'reading', 'meeting', 'browsing'];
    const sentiments = ['positive', 'neutral', 'negative'];
    const apps = ['VS Code', 'Chrome', 'Zoom', 'Outlook'];
    
    const context = contexts[Math.floor(Math.random() * contexts.length)];
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    const activeApp = apps[Math.floor(Math.random() * apps.length)];
    
    onContextDetected(context);
    onSentimentDetected(sentiment);
    onActiveAppDetected(activeApp);
  };

  const getSentimentColor = (sentiment) => {
    switch(sentiment) {
      case 'positive': return 'text-green-500';
      case 'neutral': return 'text-yellow-500';
      case 'negative': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Context Analysis</h2>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500">Active Application</p>
          <p className="font-medium">{isAnalyzing ? 'VS Code' : 'Not analyzing'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Current Context</p>
          <p className="font-medium capitalize">{isAnalyzing ? 'coding' : 'idle'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Sentiment</p>
          <p className={`font-medium capitalize ${getSentimentColor('positive')}`}>
            {isAnalyzing ? 'positive' : 'neutral'}
          </p>
        </div>
        <div className="pt-2">
          <p className="text-xs text-gray-400">
            Analyses performed: {analysisCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContextAnalyzer;
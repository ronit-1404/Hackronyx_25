import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const ScreenAnalyzer = ({ isAnalyzing }) => {
  const [status, setStatus] = useState({});
  const [screenData, setScreenData] = useState(null);
  const [sessionStats, setSessionStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState({
    status: false,
    screen: false,
    stats: false
  });
  const intervalRef = useRef(null);

  const API_URL = 'http://127.0.0.1:5001/api';

  useEffect(() => {
    fetchStatus();
    fetchSessionStats();
  }, []);

  useEffect(() => {
    if (isAnalyzing) {
      startAnalysis();
    } else {
      stopAnalysis();
    }
    return () => stopAnalysis();
  }, [isAnalyzing]);

  const startAnalysis = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      fetchScreenAnalysis();
      fetchStatus();
      fetchSessionStats();
    }, 5000);
    fetchScreenAnalysis();
  };

  const stopAnalysis = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const fetchStatus = async () => {
    setLoading(prev => ({ ...prev, status: true }));
    try {
      const response = await axios.get(`${API_URL}/status`);
      setStatus(response.data);
    } catch (err) {
      setError(`Error fetching status: ${err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, status: false }));
    }
  };

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const saveScreenAnalysisToServer = async (screenData) => {
    try {
      setIsSaving(true);
      setSaveSuccess(false);
      const response = await fetch('/api/analytics/screen-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ screenData })
      });
      const data = await response.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        console.error('Failed to save screen analysis data', data);
      }
      return data;
    } catch (error) {
      console.error('Error saving screen analysis data:', error);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const fetchScreenAnalysis = async () => {
    setLoading(prev => ({ ...prev, screen: true }));
    try {
      const response = await axios.get(`${API_URL}/analyze-screen`);
      setScreenData(response.data);
      setError('');
    } catch (err) {
      setError(`Error analyzing screen: ${err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, screen: false }));
    }
  };

  const fetchSessionStats = async () => {
    setLoading(prev => ({ ...prev, stats: true }));
    try {
      const response = await axios.get(`${API_URL}/session-stats`);
      setSessionStats(response.data);
    } catch (err) {
      setError(`Error fetching session stats: ${err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  const resetSession = async () => {
    try {
      await axios.post(`${API_URL}/reset-session`);
      fetchStatus();
      fetchSessionStats();
      setError('');
    } catch (err) {
      setError(`Error resetting session: ${err.message}`);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0s';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs > 0 ? `${hrs}h ` : ''}${mins > 0 ? `${mins}m ` : ''}${secs}s`;
  };

  const getSentimentColor = (sentiment) => {
    if (!sentiment) return 'bg-gray-500';
    sentiment = sentiment.toLowerCase();
    if (sentiment.includes('positive')) return 'bg-green-500';
    if (sentiment.includes('negative')) return 'bg-red-500';
    if (sentiment.includes('neutral')) return 'bg-blue-500';
    return 'bg-gray-500';
  };

  // Format ISO timestamp to readable string
  const formatTimestamp = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString();
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <div className={`h-3 w-3 rounded-full mr-2 ${isAnalyzing ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          Screen Activity Analysis
        </h2>
        <button
          onClick={resetSession}
          className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset Session
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5 rounded shadow-sm">
          <div className="flex">
            <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Current Status */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl shadow-sm border border-blue-100 relative">
          {loading.status && (
            <div className="absolute top-3 right-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
            </div>
          )}
          <h3 className="font-semibold text-blue-800 mb-3 text-lg">Current Status</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Application</p>
                <p className="font-medium">{status.active_app || 'Unknown'}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Context</p>
                <p className="font-medium">{status.current_context || 'Unknown'}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{formatDuration(status.context_duration)}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Idle Time</p>
                <p className="font-medium">{status.idle_time ? `${Math.round(status.idle_time)}s` : 'Unknown'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Screenshot & Analysis */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl shadow-sm border border-gray-200 relative">
          {loading.screen && (
            <div className="absolute top-3 right-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
            </div>
          )}
          <h3 className="font-semibold text-gray-800 mb-3 text-lg">Screen Analysis</h3>
          {screenData ? (
            <>
              {/* Timestamp */}
              {screenData.timestamp && (
                <div className="mb-2 text-xs text-gray-500">
                  <span className="font-semibold">Timestamp:</span> {formatTimestamp(screenData.timestamp)}
                </div>
              )}

              {/* Chrome Tab Info */}
              {(screenData.chrome_title || screenData.chrome_url) && (
                <div className="mb-2 text-xs text-gray-700">
                  <span className="font-semibold">Chrome Tab:</span>{' '}
                  {screenData.chrome_title && <span>{screenData.chrome_title} </span>}
                  {screenData.chrome_url && (
                    <a href={screenData.chrome_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      {screenData.chrome_url}
                    </a>
                  )}
                </div>
              )}

              {/* Context Change Duration */}
              {screenData.context_change_duration && (
                <div className="mb-2 text-xs text-purple-700">
                  <span className="font-semibold">Previous Context Duration:</span> {formatDuration(screenData.context_change_duration)}
                </div>
              )}

              {screenData.screenshot && (
                <div className="mb-4 rounded-lg overflow-hidden shadow-sm border border-gray-300">
                  <img 
                    src={screenData.screenshot} 
                    alt="Screenshot" 
                    className="w-full object-contain" 
                    style={{ maxHeight: '160px' }}
                  />
                </div>
              )}
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-gray-500 mr-2"></div>
                  <span className="text-sm text-gray-500 mr-2">Context:</span>
                  <span className="font-medium">{screenData.context}</span>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full ${getSentimentColor(screenData.sentiment)} mr-2`}></div>
                  <span className="text-sm text-gray-500 mr-2">Sentiment:</span>
                  <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${
                    getSentimentColor(screenData.sentiment).replace('bg-', 'bg-opacity-20 text-').replace('-500', '-700')
                  }`}>
                    {screenData.sentiment}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm text-gray-500 mr-2">Idle Time:</span>
                  <span className="font-medium">{screenData.idle_time ? `${Math.round(screenData.idle_time)}s` : 'Unknown'}</span>
                </div>

                {screenData.insights && screenData.insights.length > 0 && (
                  <div>
                    <div className="flex items-center mb-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm text-gray-500">Insights:</span>
                    </div>
                    <ul className="space-y-1 pl-4">
                      {screenData.insights.map((insight, index) => (
                        <li key={index} className="text-xs bg-blue-50 px-3 py-1 rounded-md text-gray-700">{insight}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Context Change Log */}
                {screenData.context_log && screenData.context_log.length > 0 && (
                  <div>
                    <div className="flex items-center mb-1">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                      <span className="text-sm text-gray-500">Recent Context Changes:</span>
                    </div>
                    <ul className="space-y-1 pl-4">
                      {screenData.context_log.slice(-5).reverse().map((item, idx) => (
                        <li key={idx} className="text-xs text-gray-700">
                          <span className="font-semibold">{item.context}</span> for {formatDuration(item.duration)} at {formatTimestamp(item.timestamp)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Save Analysis Button */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => saveScreenAnalysisToServer(screenData)}
                  disabled={isSaving || !isAnalyzing}
                  className={`flex items-center px-4 py-2 rounded-lg text-white text-sm font-medium transition-all
                    ${isSaving 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : saveSuccess
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Saving...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Saved!
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h1a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h2v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                      </svg>
                      Save Analysis
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p>No screen data available</p>
              <p className="text-xs mt-1">Start analysis to capture screen</p>
            </div>
          )}
        </div>

        {/* Session Statistics - Enhanced */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl shadow-sm border border-green-100 md:col-span-2 relative">
          {loading.stats && (
            <div className="absolute top-3 right-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-700"></div>
            </div>
          )}
          <h3 className="font-semibold text-green-800 mb-4 text-lg">Context Summary</h3>
          {sessionStats && sessionStats.context_durations && sessionStats.context_durations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sessionStats.context_durations.slice(0, 6).map((item, index) => (
                <div key={index} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-800 truncate" title={item.context || 'unknown'}>
                      {item.context || 'unknown'}
                    </span>
                    <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      {formatDuration(item.duration)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (item.duration / sessionStats.session_duration) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {Math.round((item.duration / sessionStats.session_duration) * 100)}% of session
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400">
              <svg className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p>No session data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScreenAnalyzer;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeUser, setActiveUser] = useState('student_001');
  const [pollInterval, setPollInterval] = useState(30); // seconds
  const [lastPoll, setLastPoll] = useState(null);
  const [countdownTime, setCountdownTime] = useState(pollInterval);
  
  // Fetch recommendations on mount and set up polling
  useEffect(() => {
    fetchRecommendations();
    
    // Set up polling interval
    const intervalId = setInterval(() => {
      setCountdownTime((prevTime) => {
        if (prevTime <= 1) {
          fetchRecommendations();
          return pollInterval;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [pollInterval]);
  
  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/get-recommendations?user_id=${activeUser}`);
      const data = await response.json();
      
      if (data.success) {
        setRecommendations(data.recommendations || []);
        setLastPoll(new Date());
      } else {
        setError(data.error || 'Failed to fetch recommendations');
      }
    } catch (err) {
      setError('Error connecting to recommendation service');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChangePollInterval = (e) => {
    const newInterval = parseInt(e.target.value, 10);
    setPollInterval(newInterval);
    setCountdownTime(newInterval);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h1 className="text-2xl font-bold">Learning Recommendations</h1>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/"
                className="text-white hover:text-blue-100 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Dashboard
              </Link>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Poll every:</span>
                <select 
                  value={pollInterval}
                  onChange={handleChangePollInterval}
                  className="bg-blue-700 text-white border-blue-500 rounded px-2 py-1 text-sm"
                >
                  <option value={10}>10s</option>
                  <option value={30}>30s</option>
                  <option value={60}>1m</option>
                  <option value={300}>5m</option>
                </select>
                
                <div className="text-sm bg-blue-800 rounded-full px-3 py-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{countdownTime}s</span>
                </div>
                
                <button
                  onClick={fetchRecommendations}
                  className="bg-white text-blue-700 hover:bg-blue-50 rounded-md px-3 py-1 text-sm font-medium flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-800">
                Current Recommendations
              </h2>
              {lastPoll && (
                <span className="text-xs text-gray-500">
                  Last updated: {lastPoll.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="p-12 flex justify-center">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
                <p className="text-gray-500">Fetching recommendations...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Recommendations</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={fetchRecommendations}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Yet</h3>
              <p className="text-gray-600">
                We don't have any recommendations for you at this time.<br />
                Continue using your applications, and we'll suggest relevant content soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {recommendations.map((rec, index) => (
                <RecommendationCard key={index} recommendation={rec} />
              ))}
            </div>
          )}
        </div>
        
        {recommendations.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Why am I seeing these recommendations?
            </h3>
            <div className="bg-white shadow-md rounded-lg p-4">
              <p className="text-gray-600 mb-3">
                Based on your screen activity analysis, we've detected patterns in your attention and focus.
                These suggestions are personalized to help you learn more effectively about the topics you've been engaged with.
              </p>
              
              <div className="flex flex-wrap gap-2">
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Personalized for your learning style
                </div>
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Updated regularly based on your focus
                </div>
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Designed to improve your productivity
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Individual recommendation card component
function RecommendationCard({ recommendation }) {
  const [expanded, setExpanded] = useState(false);

  // Determine the icon based on content type
  const getContentIcon = (contentType) => {
    const type = (contentType || "").toLowerCase();
    
    if (type.includes("video") || type.includes("youtube")) {
      return (
        <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
        </svg>
      );
    } else if (type.includes("blog") || type.includes("article") || type.includes("post")) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      );
    } else if (type.includes("book") || type.includes("pdf")) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.581.814L12 14.638 8.581 16.814A1 1 0 017 16V4z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  return (
    <div className={`bg-white border rounded-lg overflow-hidden shadow-sm transition-all duration-300 ${expanded ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-blue-50 rounded-md p-2">
            {getContentIcon(recommendation.content_type)}
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
              {recommendation.title}
            </h3>
            <p className="text-sm text-gray-500 mb-2 truncate">
              {recommendation.url}
            </p>
          </div>
        </div>
        
        <div className={`mt-3 ${expanded ? '' : 'line-clamp-3'}`}>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Why:</span> {recommendation.reason}
          </p>
        </div>
        
        {recommendation.reason && recommendation.reason.length > 150 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center"
          >
            {expanded ? (
              <>
                <span>Show less</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </>
            ) : (
              <>
                <span>Show more</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </button>
        )}
        
        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => window.open(recommendation.url, '_blank')}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Open
          </button>
          
          <button
            className="flex items-center justify-center p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            title="Save for later"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          </button>
        </div>
      </div>
      
      {recommendation.content_type && (
        <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-500 flex justify-between">
          <span>{recommendation.content_type}</span>
          {recommendation.length_minutes && (
            <span>{recommendation.length_minutes} min</span>
          )}
        </div>
      )}
    </div>
  );
}

export default RecommendationsPage;
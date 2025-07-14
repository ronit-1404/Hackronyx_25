import React, { useState, useEffect } from "react";
import {
  Play,
  FileText,
  Download,
  Copy,
  Clock,
  Eye,
  AlertCircle,
  CheckCircle,
  Loader,
  Youtube,
  Search,
  RefreshCw,
  Zap,
  BarChart3,
  BookOpen,
  Activity,
  TrendingUp,
} from "lucide-react";

const YouTubeTranscriptAnalyzer = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [videoInfo, setVideoInfo] = useState(null);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [timestamps, setTimestamps] = useState([]);
  const [stats, setStats] = useState({
    totalWords: 0,
    readingTime: 0,
    keyTopics: [],
    sentiment: "neutral"
  });

  // Backend API configuration
  const API_BASE_URL = 'http://localhost:5001';

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    setIsVisible(true);
    return () => clearInterval(timer);
  }, []);

  // Function to extract key topics from analysis text
  const extractKeyTopics = (analysisText) => {
    const topics = [];
    const lines = analysisText.split('\n');
    
    // Look for topics section or extract from content
    const topicsSection = lines.find(line => 
      line.toLowerCase().includes('topics') || 
      line.toLowerCase().includes('subjects') ||
      line.toLowerCase().includes('themes')
    );
    
    if (topicsSection) {
      // Extract topics from the topics section
      const topicMatches = topicsSection.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
      if (topicMatches) {
        topics.push(...topicMatches.slice(0, 5)); // Limit to 5 topics
      }
    } else {
      // Fallback: extract capitalized words as potential topics
      const allMatches = analysisText.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
      if (allMatches) {
        const uniqueTopics = [...new Set(allMatches)];
        topics.push(...uniqueTopics.slice(0, 5));
      }
    }
    
    return topics.length > 0 ? topics : ["General Content"];
  };

  // Function to determine sentiment from analysis
  const determineSentiment = (analysisText) => {
    const positiveWords = ['positive', 'good', 'excellent', 'great', 'beneficial', 'useful', 'helpful'];
    const negativeWords = ['negative', 'bad', 'poor', 'critical', 'problematic', 'concerning'];
    
    const lowerText = analysisText.toLowerCase();
    const positiveCount = positiveWords.reduce((count, word) => 
      count + (lowerText.includes(word) ? 1 : 0), 0);
    const negativeCount = negativeWords.reduce((count, word) => 
      count + (lowerText.includes(word) ? 1 : 0), 0);
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  // Real function to call backend API
  const analyzeVideo = async (url) => {
    setIsLoading(true);
    setError("");
    
    try {
      // Validate YouTube URL
      const youtubeRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
      if (!youtubeRegex.test(url)) {
        throw new Error("Please enter a valid YouTube URL");
      }

      // Call backend API
      const response = await fetch('http://localhost:5001/api/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',   
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Process the response data
      const fullTranscript = data.timestamps
        ? data.timestamps.map(t => t.text).join(' ')
        : "Transcript not available";

      const keyTopics = extractKeyTopics(data.analysis);
      const sentiment = determineSentiment(data.analysis);

      // Set video info
      const videoInfoData = {
        title: data.title || "Unknown Title",
        duration: "N/A", // Duration not directly available from this API response
        views: "N/A", // Views not available from this API response
        channel: data.channelTitle || "Unknown Channel",
        publishedAt: data.publishedAt ? new Date(data.publishedAt).toLocaleDateString() : "Unknown Date"
      };

      // Calculate stats
      const words = fullTranscript.split(' ').filter(word => word.trim().length > 0);
      const statsData = {
        totalWords: words.length,
        readingTime: Math.ceil(words.length / 200), // Average reading speed: 200 words per minute
        keyTopics: keyTopics,
        sentiment: sentiment
      };

      // Update state
      setVideoInfo(videoInfoData);
      setTranscript(fullTranscript);
      setAnalysis(data.analysis);
      setTimestamps(data.timestamps || []);
      setStats(statsData);

    } catch (err) {
      console.error('Error analyzing video:', err);
      setError(err.message || 'An error occurred while analyzing the video');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      const contentToCopy = analysis ? 
        `${transcript}\n\n--- ANALYSIS ---\n${analysis}` : 
        transcript;
      await navigator.clipboard.writeText(contentToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadTranscript = () => {
    const element = document.createElement("a");
    const contentToDownload = analysis ? 
      `${transcript}\n\n--- ANALYSIS ---\n${analysis}` : 
      transcript;
    const file = new Blob([contentToDownload], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `transcript-${videoInfo?.title?.replace(/[^a-z0-9]/gi, '_') || 'video'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSubmit = () => {
    if (videoUrl.trim()) {
      analyzeVideo(videoUrl);
    }
  };

  // Function to format timestamp
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={`min-h-screen transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ backgroundColor: "#F5EFE6" }}
    >
      <style jsx>{`
        .card-hover {
          transition: all 0.2s ease-out;
        }
        .card-hover:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-in {
          animation: slideIn 0.6s ease-out;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .pulse-animation {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-6 slide-in">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-black text-white p-3 rounded-xl">
                <Youtube className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  YouTube Transcript Analyzer
                </h1>
                <p className="text-gray-600">
                  Extract and analyze video transcripts with AI
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                {currentTime.toLocaleTimeString()}
              </p>
              <p className="text-xs text-gray-400">
                {currentTime.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 card-hover fade-in stagger-1">
            <div className="flex items-center justify-between mb-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                Words
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalWords.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Words</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 card-hover fade-in stagger-2">
            <div className="flex items-center justify-between mb-3">
              <Clock className="w-8 h-8 text-emerald-600" />
              <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                Time
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.readingTime} min
            </p>
            <p className="text-sm text-gray-600">Reading Time</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 card-hover fade-in stagger-3">
            <div className="flex items-center justify-between mb-3">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              <span className={`text-xs px-2 py-1 rounded-full ${
                stats.sentiment === 'positive' ? 'text-green-600 bg-green-50' :
                stats.sentiment === 'negative' ? 'text-red-600 bg-red-50' :
                'text-gray-600 bg-gray-50'
              }`}>
                {stats.sentiment}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.keyTopics.length}
            </p>
            <p className="text-sm text-gray-600">Key Topics</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 card-hover fade-in stagger-4">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                Status
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {transcript ? "Ready" : "Waiting"}
            </p>
            <p className="text-sm text-gray-600">Analysis</p>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 card-hover fade-in">
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Enter YouTube URL
            </h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                disabled={isLoading}
              />
              <button
                onClick={handleSubmit}
                disabled={isLoading || !videoUrl.trim()}
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2 font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Analyze</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Video Info */}
        {videoInfo && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 card-hover fade-in">
            <div className="flex items-center space-x-2 mb-4">
              <Eye className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Video Information
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">{videoInfo.title}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Channel:</span>
                    <span className="font-medium">{videoInfo.channel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{videoInfo.duration}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Views:</span>
                    <span className="font-medium">{videoInfo.views}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Published:</span>
                    <span className="font-medium">{videoInfo.publishedAt}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Key Topics */}
        {stats.keyTopics.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 card-hover fade-in">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Key Topics
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {stats.keyTopics.map((topic, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* AI Analysis */}
        {analysis && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 card-hover fade-in">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                AI Analysis
              </h2>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
              <pre className="text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                {analysis}
              </pre>
            </div>
          </div>
        )}

        {/* Transcript with Timestamps */}
        {transcript && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 card-hover fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Transcript {timestamps.length > 0 && "(with Timestamps)"}
                </h2>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
                >
                  {copySuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 text-sm">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-600 text-sm">Copy</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={downloadTranscript}
                  className="flex items-center space-x-2 px-4 py-2 bg-black text-white hover:bg-gray-800 rounded-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Download</span>
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              {timestamps.length > 0 ? (
                <div className="space-y-2">
                  {timestamps.map((item, index) => (
                    <div key={index} className="flex">
                      <span className="text-blue-600 text-sm font-mono mr-3 flex-shrink-0">
                        {formatTime(item.time)}
                      </span>
                      <span className="text-gray-700">{item.text}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {transcript}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 card-hover fade-in">
            <div className="flex items-center justify-center space-x-3">
              <Loader className="w-6 h-6 animate-spin text-blue-600" />
              <p className="text-gray-600">Analyzing video and extracting transcript...</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Built with React • Powered by AI • Made for content creators</p>
        </div>
      </div>
    </div>
  );
};

export default YouTubeTranscriptAnalyzer;
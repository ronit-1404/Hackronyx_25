import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const AudioAnalyzer = ({ isAnalyzing, onEmotionDetected }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioEngagement, setAudioEngagement] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(5); // in seconds
  const [recordingTimer, setRecordingTimer] = useState(0);
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);

  // Auto-record when analysis is active (optional, can be removed if you prefer manual recording)
  useEffect(() => {
    let autoRecordInterval;
    
    if (isAnalyzing && !isRecording) {
      // Start auto-recording at intervals when analyzing is active
      autoRecordInterval = setInterval(() => {
        if (!isRecording) {
          startRecording();
        }
      }, 30000); // Auto record every 30 seconds
      
      // Start recording immediately when analysis begins
      startRecording();
    }
    
    return () => {
      clearInterval(autoRecordInterval);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isAnalyzing, isRecording]);

  const startRecording = () => {
    if (isRecording) return;
    
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        setIsRecording(true);
        setRecordingTimer(recordingDuration);
        
        // Start the recording timer
        timerRef.current = setInterval(() => {
          setRecordingTimer(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        const audioChunks = [];
        
        mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });
        
        mediaRecorder.addEventListener("stop", async () => {
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
          
          const blob = new Blob(audioChunks);
          await analyzeEmotion(blob);
          setIsRecording(false);
        });
        
        mediaRecorder.start();
        setTimeout(() => {
          if (mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
          }
        }, recordingDuration * 1000);
      })
      .catch(error => {
        console.error("Error accessing microphone:", error);
        setIsRecording(false);
      });
  };

  const analyzeEmotion = async (blob) => {
    try {
      const base64Audio = await convertToBase64(blob);
      const response = await axios.post('http://127.0.0.1:5002/predict_emotion', {
        audio_data: base64Audio.split(',')[1],
        file_format: 'wav'
      });
      
      // Calculate engagement score based on emotion
      const emotion = response.data.emotion;
      let engagementScore = 0.5; // Default engagement (neutral)
      
      // Map emotions to engagement levels
      const emotionEngagementMap = {
        'happy': 0.8,
        'excited': 0.9,
        'neutral': 0.5,
        'sad': 0.3,
        'angry': 0.4,
        'frustrated': 0.35,
        'confused': 0.4,
        'bored': 0.2
      };
      
      engagementScore = emotionEngagementMap[emotion.toLowerCase()] || 0.5;
      
      // Set the audio engagement state
      setAudioEngagement({
        emotion: emotion,
        engagementScore: engagementScore,
        timestamp: new Date().toISOString()
      });
      
      // Notify parent component
      onEmotionDetected(emotion, engagementScore);
      
    } catch (error) {
      console.error('Emotion analysis failed:', error);
      setAudioEngagement({
        emotion: 'error',
        engagementScore: null,
        error: error.message
      });
    }
  };

  const saveAudioEngagement = async () => {
    if (!audioEngagement) return;
    
    try {
      setIsSaving(true);
      setSaveSuccess(false);
      
      const response = await fetch('/api/engagement/audio-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          audioData: {
            emotion: audioEngagement.emotion,
            engagementScore: audioEngagement.engagementScore,
            timestamp: audioEngagement.timestamp
          }
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000); // Reset success state after 3 seconds
      } else {
        console.error('Failed to save audio engagement data:', data.message);
      }
      
    } catch (error) {
      console.error('Error saving audio engagement data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Get color for engagement visualization
  const getEngagementColor = (score) => {
    if (!score && score !== 0) return 'bg-gray-300';
    if (score >= 0.7) return 'bg-green-500';
    if (score >= 0.4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Get emotion emoji
  const getEmotionEmoji = (emotion) => {
    if (!emotion) return '😐';
    
    const emojiMap = {
      'happy': '😊',
      'excited': '😃',
      'neutral': '😐',
      'sad': '😢',
      'angry': '😠',
      'frustrated': '😤',
      'confused': '😕',
      'bored': '😑',
      'error': '❓'
    };
    
    return emojiMap[emotion.toLowerCase()] || '😐';
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Audio Engagement Analysis</h2>
      
      <div className="flex flex-col items-center">
        <button
          onClick={startRecording}
          disabled={!isAnalyzing || isRecording}
          className={`px-4 py-2 rounded-md mb-2 ${
            !isAnalyzing || isRecording
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isRecording ? `Recording... ${recordingTimer}s` : 'Record Audio'}
        </button>
        
        <div className="w-full h-8 flex items-center justify-center">
          {isRecording && (
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1 h-6 bg-red-500 animate-pulse" style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1s'
                }} />
              ))}
            </div>
          )}
        </div>
        
        {audioEngagement && (
          <div className="w-full mt-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <span className="text-2xl mr-2">{getEmotionEmoji(audioEngagement.emotion)}</span>
                <span className="text-gray-700 font-medium">{audioEngagement.emotion}</span>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(audioEngagement.timestamp).toLocaleTimeString()}
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Low Engagement</span>
                <span>High Engagement</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`${getEngagementColor(audioEngagement.engagementScore)} h-4 rounded-full transition-all duration-500`}
                  style={{ width: `${(audioEngagement.engagementScore || 0) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={saveAudioEngagement}
                disabled={isSaving || !audioEngagement}
                className={`px-3 py-1 text-sm rounded flex items-center ${
                  saveSuccess 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : isSaving
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : saveSuccess ? (
                  <>
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Saved
                  </>
                ) : (
                  'Save Analysis'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Your voice tone helps us understand your engagement level.</p>
      </div>
    </div>
  );
};

export default AudioAnalyzer;
import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios'; // Make sure axios is installed

const EngagementAnalyzer = ({ isAnalyzing, onEngagementScore }) => {
  const webcamRef = useRef(null);
  const intervalRef = useRef(null);
  const [engagementLevel, setEngagementLevel] = useState(0);
  const [emotion, setEmotion] = useState('');
  const [isAttentive, setIsAttentive] = useState(false);

  useEffect(() => {
    if (isAnalyzing) {
      startAnalyzing();
    } else {
      stopAnalyzing();
    }

    return () => {
      stopAnalyzing();
    };
  }, [isAnalyzing]);

  const startAnalyzing = () => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Start a new interval to analyze webcam frames every 1 second
    intervalRef.current = setInterval(() => {
      captureAndAnalyze();
    }, 1000); // Adjust interval as needed (1000ms = 1 second)
  };

  const stopAnalyzing = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const captureAndAnalyze = async () => {
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      // Capture webcam image
      const imageSrc = webcamRef.current.getScreenshot();
      
      try {
        // Send image to Flask API
        const response = await axios.post('http://127.0.0.1:5000/api/analyze-engagement', {
          image: imageSrc
        });
        
        // Update states with API response
        const { engagement_score, emotion: detectedEmotion, attentive } = response.data;
        setEngagementLevel(engagement_score);
        setEmotion(detectedEmotion);
        setIsAttentive(attentive);
        
        // Call the parent's callback with the engagement score
        onEngagementScore(engagement_score);
      } catch (error) {
        console.error('Error analyzing engagement:', error);
      }
    }
  };

  // Calculate engagement percentage for display
  const engagementPercentage = Math.round(engagementLevel * 100);
  
  // Determine color class based on engagement level
  const getColorClass = (level) => {
    if (level < 0.3) return 'bg-red-500';
    if (level < 0.7) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Engagement Level</h2>
      <div className="relative">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          className="w-full h-auto rounded-lg"
        />
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className={`${getColorClass(engagementLevel)} h-4 rounded-full transition-all duration-300`} 
              style={{ width: `${isAnalyzing ? engagementPercentage : 0}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-gray-600">
              {isAnalyzing ? (
                <span>
                  {isAttentive ? 'Attentive' : 'Not attentive'} - {emotion || 'Analyzing...'}
                </span>
              ) : 'Paused'}
            </p>
            <p className="text-right text-gray-600">
              {isAnalyzing ? `${engagementPercentage}%` : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagementAnalyzer;
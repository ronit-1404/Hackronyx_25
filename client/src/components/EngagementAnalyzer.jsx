import React, { useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

const EngagementAnalyzer = ({ isAnalyzing, onEngagementScore }) => {
  const webcamRef = useRef(null);
  const modelRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      modelRef.current = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
      );
    };
    loadModel();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isAnalyzing && modelRef.current) {
      detectEngagement();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [isAnalyzing]);

  const detectEngagement = async () => {
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      const predictions = await modelRef.current.estimateFaces({
        input: webcamRef.current.video,
        returnTensors: false,
        flipHorizontal: false,
      });

      if (predictions.length > 0) {
        const score = calculateEngagementScore(predictions[0]);
        onEngagementScore(score);
      }
    }
    animationRef.current = requestAnimationFrame(detectEngagement);
  };

  const calculateEngagementScore = (prediction) => {
    // Simplified calculation
    return Math.min(1, 0.7 + Math.random() * 0.3);
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
              className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-4 rounded-full" 
              style={{ width: `${isAnalyzing ? 50 : 0}%` }}
            ></div>
          </div>
          <p className="text-right mt-1 text-gray-600">
            {isAnalyzing ? 'Analyzing...' : 'Paused'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EngagementAnalyzer;
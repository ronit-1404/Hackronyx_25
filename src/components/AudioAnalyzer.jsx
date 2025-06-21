import React, { useState, useRef } from 'react';
import axios from 'axios';

const AudioAnalyzer = ({ isAnalyzing, onEmotionDetected }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        setIsRecording(true);
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        const audioChunks = [];
        
        mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });
        
        mediaRecorder.addEventListener("stop", async () => {
          const blob = new Blob(audioChunks);
          await analyzeEmotion(blob);
          setIsRecording(false);
        });
        
        mediaRecorder.start();
        setTimeout(() => {
          mediaRecorder.stop();
        }, 5000);
      });
  };

  const analyzeEmotion = async (blob) => {
    try {
      const base64Audio = await convertToBase64(blob);
      const response = await axios.post('http://127.0.0.1:5002/predict_emotion', {
        audio_data: base64Audio.split(',')[1],
        file_format: 'wav'
      });
      onEmotionDetected(response.data.emotion);
    } catch (error) {
      console.error('Emotion analysis failed:', error);
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

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Emotion Analysis</h2>
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
          {isRecording ? 'Recording...' : 'Record Audio'}
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
      </div>
    </div>
  );
};

export default AudioAnalyzer;
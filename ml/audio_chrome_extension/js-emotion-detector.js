/**
 * Simple Audio Emotion Detector for Chrome Extension
 * This is a JavaScript implementation of basic audio analysis
 * to simulate the Python model without requiring an API server
 */

// Audio feature extraction and emotion classification
class AudioEmotionDetector {
  constructor() {
    // Initialize state
    this.audioContext = null;
    this.analyser = null;
    this.bufferSize = 4096;
    this.sampleRate = 44100;
    
    // Simple rule-based classification parameters
    this.featureThresholds = {
      energy: {
        high: 0.7,
        low: 0.3
      },
      zeroCrossingRate: {
        high: 0.6,
        low: 0.2
      }
    };
  }
  
  /**
   * Detect emotion from audio buffer
   * @param {AudioBuffer} audioBuffer - The audio buffer to analyze
   * @return {Object} Object with emotion and engagement level
   */
  detectEmotion(audioBuffer) {
    // Extract simple audio features
    const features = this._extractFeatures(audioBuffer);
    
    // Classify based on simple rules
    const emotion = this._classifyEmotion(features);
    
    // Map emotion to engagement level
    const engagement = this._mapToEngagement(emotion);
    
    return {
      emotion: emotion,
      engagement: engagement,
      features: features
    };
  }
  
  /**
   * Extract audio features from an audio buffer
   * @param {Float32Array} audioData - Audio data to analyze
   * @return {Object} Extracted features
   */
  _extractFeatures(audioData) {
    // 1. Calculate RMS energy
    let sumSquares = 0;
    for (let i = 0; i < audioData.length; i++) {
      sumSquares += audioData[i] * audioData[i];
    }
    const rmsEnergy = Math.sqrt(sumSquares / audioData.length);
    
    // 2. Calculate zero-crossing rate
    let zeroCrossings = 0;
    for (let i = 1; i < audioData.length; i++) {
      if ((audioData[i] >= 0 && audioData[i - 1] < 0) || 
          (audioData[i] < 0 && audioData[i - 1] >= 0)) {
        zeroCrossings++;
      }
    }
    const zeroCrossingRate = zeroCrossings / (audioData.length - 1);
    
    // 3. Calculate spectral centroid (simplified)
    let spectralVariance = 0;
    for (let i = 0; i < audioData.length; i++) {
      const normalized = Math.abs(audioData[i]);
      spectralVariance += normalized > 0.2 ? normalized : 0;
    }
    
    return {
      energy: this._normalize(rmsEnergy, 0, 0.3),
      zeroCrossingRate: this._normalize(zeroCrossingRate, 0, 0.5),
      spectralVariance: this._normalize(spectralVariance, 0, audioData.length * 0.05)
    };
  }
  
  /**
   * Normalize a value between 0 and 1
   */
  _normalize(value, min, max) {
    const normalized = (value - min) / (max - min);
    return Math.max(0, Math.min(1, normalized));
  }
  
  /**
   * Classify emotion based on extracted features
   * @param {Object} features - The extracted audio features
   * @return {String} Detected emotion
   */
  _classifyEmotion(features) {
    const { energy, zeroCrossingRate, spectralVariance } = features;
    
    // Simple rule-based classification
    if (energy > this.featureThresholds.energy.high) {
      // High energy can indicate strong emotion
      if (zeroCrossingRate > this.featureThresholds.zeroCrossingRate.high) {
        return 'distress'; // High energy + high ZCR = distress
      } else {
        return 'confusion'; // High energy + low ZCR = confusion
      }
    } else if (energy < this.featureThresholds.energy.low) {
      // Low energy
      if (spectralVariance < 0.3) {
        return 'boredom'; // Low energy + low variance = boredom
      } else {
        return 'neutral'; // Low energy + some variance = neutral
      }
    } else {
      // Medium energy levels
      return 'neutral';
    }
  }
  
  /**
   * Map emotion to engagement level
   * @param {String} emotion - Detected emotion
   * @return {String} Engagement level
   */
  _mapToEngagement(emotion) {
    const engagementMap = {
      'neutral': 'Engaged',
      'confusion': 'Not Fully Engaged',
      'boredom': 'Not Engaged',
      'distress': 'Not Engaged'
    };
    
    return engagementMap[emotion] || 'Unknown';
  }
  
  /**
   * Process a complete audio blob
   * @param {Blob} audioBlob - WAV audio blob
   * @return {Promise} Promise resolving to emotion analysis
   */
  async processAudioBlob(audioBlob) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      
      fileReader.onloadend = async () => {
        try {
          const arrayBuffer = fileReader.result;
          
          // Create audio context if it doesn't exist
          if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
          }
          
          // Decode the audio
          this.audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
            // Get audio data from the first channel
            const audioData = audioBuffer.getChannelData(0);
            
            // Detect emotion
            const result = this.detectEmotion(audioData);
            
            resolve(result);
          }, (error) => {
            reject(new Error('Error decoding audio: ' + error));
          });
        } catch (error) {
          reject(error);
        }
      };
      
      fileReader.onerror = () => {
        reject(new Error('Error reading audio file'));
      };
      
      fileReader.readAsArrayBuffer(audioBlob);
    });
  }
}

// Export the detector
window.AudioEmotionDetector = AudioEmotionDetector;

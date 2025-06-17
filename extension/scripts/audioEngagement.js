class AudioEngagement {
  constructor(api) {
    this.api = api;
    this.isRecording = false;
    this.audioContext = null;
    this.mediaRecorder = null;
    this.audioStream = null;
    this.analyser = null;
    this.session = null;
    this.audioData = [];
    this.analysisInterval = null;
    this.emotionDetector = null;
  }

  /**
   * Initialize audio engagement tracking
   */
  async initialize() {
    try {
      // Load emotion detector if available
      if (window.EmotionDetector) {
        this.emotionDetector = new window.EmotionDetector();
        await this.emotionDetector.initialize();
        console.log('Emotion detector initialized');
      } else {
        console.log('EmotionDetector not available');
      }
      return true;
    } catch (error) {
      console.error('Failed to initialize audio engagement:', error);
      return false;
    }
  }

  /**
   * Start audio recording and analysis
   * @param {Object} session Current session data
   * @returns {Promise<boolean>} Success status
   */
  async start(session) {
    if (this.isRecording) {
      return true;
    }

    try {
      this.session = session;
      
      // Request microphone permission
      this.audioStream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      
      // Set up audio context
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      
      // Connect microphone to analyser
      const source = this.audioContext.createMediaStreamSource(this.audioStream);
      source.connect(this.analyser);
      
      // Start recording
      this.mediaRecorder = new MediaRecorder(this.audioStream);
      this.mediaRecorder.addEventListener('dataavailable', (e) => {
        if (e.data.size > 0) {
          this.audioData.push(e.data);
          this.analyzeAudioChunk(e.data);
        }
      });
      
      this.mediaRecorder.start(1000); // Collect chunks every second
      this.isRecording = true;
      
      // Start periodic analysis
      this.startAnalysis();
      
      console.log('Audio tracking started');
      return true;
    } catch (error) {
      console.error('Failed to start audio tracking:', error);
      this.stop();
      return false;
    }
  }

  /**
   * Stop audio recording
   */
  async stop() {
    try {
      if (this.analysisInterval) {
        clearInterval(this.analysisInterval);
        this.analysisInterval = null;
      }
      
      if (this.mediaRecorder && this.isRecording) {
        this.mediaRecorder.stop();
      }
      
      if (this.audioStream) {
        this.audioStream.getTracks().forEach(track => track.stop());
      }
      
      if (this.audioContext) {
        await this.audioContext.close();
      }
      
      this.audioContext = null;
      this.mediaRecorder = null;
      this.audioStream = null;
      this.analyser = null;
      this.isRecording = false;
      this.session = null;
      
      // Process final data
      await this.sendAudioData();
      
      console.log('Audio tracking stopped');
      return true;
    } catch (error) {
      console.error('Error stopping audio tracking:', error);
      return false;
    }
  }

  /**
   * Start periodic audio analysis
   */
  startAnalysis() {
    this.analysisInterval = setInterval(() => {
      if (!this.isRecording || !this.analyser) return;
      
      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(dataArray);
      
      // Calculate audio metrics
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const normalized = average / 255;
      
      // Calculate engagement score based on audio activity
      // A very basic approach - more activity indicates more engagement
      // This should be replaced with proper ML-based analysis
      const engagementScore = Math.min(Math.max(normalized * 1.5, 0), 1);
      
      // Log metrics
      this.logAnalysis({
        timestamp: Date.now(),
        audioLevel: normalized,
        engagementScore
      });
      
    }, 5000); // Analyze every 5 seconds
  }

  /**
   * Analyze audio chunk
   * @param {Blob} audioChunk Audio data chunk
   */
  async analyzeAudioChunk(audioChunk) {
    try {
      if (this.emotionDetector && this.session) {
        const emotion = await this.emotionDetector.detectEmotion(audioChunk);
        if (emotion) {
          // Map emotion to engagement
          let engagementScore = 0.5; // Default neutral
          
          // Very simple mapping - should be replaced with proper algorithm
          switch (emotion.dominant) {
            case 'happy':
            case 'excited':
              engagementScore = 0.9;
              break;
            case 'interested':
              engagementScore = 0.8;
              break;
            case 'neutral':
              engagementScore = 0.5;
              break;
            case 'bored':
              engagementScore = 0.3;
              break;
            case 'confused':
              engagementScore = 0.4;
              break;
            case 'distracted':
              engagementScore = 0.2;
              break;
          }
          
          // Log the analysis
          this.logAnalysis({
            timestamp: Date.now(),
            emotion: emotion.dominant,
            confidence: emotion.confidence,
            engagementScore
          });
        }
      }
    } catch (error) {
      console.error('Audio analysis error:', error);
    }
  }

  /**
   * Log audio analysis results
   * @param {Object} analysis Analysis data
   */
  async logAnalysis(analysis) {
    try {
      if (!this.session || !this.session._id) return;
      
      // Send to background script
      chrome.runtime.sendMessage({
        type: 'LOG_AUDIO_ENGAGEMENT',
        sessionId: this.session._id,
        data: analysis
      });
      
    } catch (error) {
      console.error('Failed to log audio analysis:', error);
    }
  }

  /**
   * Send collected audio data to server
   */
  async sendAudioData() {
    if (this.audioData.length === 0 || !this.session || !this.session._id) {
      return;
    }
    
    try {
      // Create a blob from all audio chunks
      const audioBlob = new Blob(this.audioData, { type: 'audio/webm' });
      
      // Send to server if size is reasonable
      if (audioBlob.size < 10 * 1024 * 1024) { // 10MB limit
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        formData.append('sessionId', this.session._id);
        
        // Send to server
        await this.api.sendAudioData(this.session._id, formData);
      } else {
        console.log('Audio data too large to send');
      }
      
      // Clear audio data
      this.audioData = [];
    } catch (error) {
      console.error('Failed to send audio data:', error);
    }
  }
}

// Export the class
if (typeof module !== 'undefined') {
  module.exports = AudioEngagement;
}
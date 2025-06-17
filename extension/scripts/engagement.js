class EngagementTracker {
  constructor(api) {
    this.api = api;
    this.tracking = false;
    this.sessionId = null;
    this.userId = null;
    this.settings = null;
    this.engagementScore = 0;
    this.lastDataTime = 0;
    this.intervalIds = [];
    this.batchedActivity = [];
    this.audioEngagement = null;
  }

  /**
   * Start tracking engagement
   * @param {Object} settings Tracking settings
   * @returns {Promise<Object>} Session info
   */
  async startTracking(settings = {}) {
    if (this.tracking) {
      return { success: true, sessionId: this.sessionId };
    }
    
    try {
      // Get user ID
      this.userId = await auth.getUserId();
      if (settings.enableAudio) {
      await this.initializeAudioTracking();
      await this.audioEngagement.start(this.session);
    }
      if (!this.userId) {
        throw new Error('User not authenticated');
      }
      
      // Save settings
      this.settings = {
        enableWebcam: settings.enableWebcam || false,
        enableAudio: settings.enableAudio || false,
        interventionFrequency: settings.interventionFrequency || 'medium'
      };
      
      // Start a new session
      const sessionData = {
        url: window.location.href,
        platform: this.detectPlatform(window.location.href),
        deviceInfo: {
          browser: 'Chrome',
          device: this.detectDevice(),
          os: this.detectOS()
        }
      };
      
      const response = await this.api.startSession(sessionData);
      this.sessionId = response.session._id;
      
      // Set up trackers
      this.setupTracking();
      
      // Notify content script to start tracking
      await chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { 
          type: 'START_TRACKING',
          sessionId: this.sessionId,
          settings: this.settings
        });
      });
      
      // Notify AI service about session
      await this.api.aiRequest('/analyze/start', {
        method: 'POST',
        body: JSON.stringify({
          userId: this.userId,
          sessionId: this.sessionId,
          enableWebcam: this.settings.enableWebcam,
          enableAudio: this.settings.enableAudio,
          interventionFrequency: this.settings.interventionFrequency
        })
      });
      
      this.tracking = true;
      return { success: true, sessionId: this.sessionId };
    } catch (error) {
      console.error('Failed to start tracking:', error);
      return { success: false, error: error.message };
    }
  }
  

  async initializeAudioTracking() {
    try {
      if (!this.audioEngagement) {
        // Dynamically import AudioEngagement
        const AudioEngagement = (await import('./audioEngagement.js')).default;
        this.audioEngagement = new AudioEngagement(this.api);
        await this.audioEngagement.initialize();
      }
      return true;
    } catch (error) {
      console.error('Failed to initialize audio tracking:', error);
      return false;
    }
}

  /**
   * Stop tracking engagement
   * @returns {Promise<boolean>} Success status
   */
  async stopTracking() {
    if (!this.tracking || !this.sessionId) {
      return { success: false, message: 'No active session' };
    }
    
    try {
      // Clear all intervals
      this.intervalIds.forEach(id => clearInterval(id));
      this.intervalIds = [];
      
      // Send any remaining batched activity
      if (this.batchedActivity.length > 0) {
        await this.sendBatchedActivity();
      }
      if (this.audioEngagement) {
      await this.audioEngagement.stop();
      }
      // End session in backend
      await this.api.endSession(this.sessionId);
      
      // Notify AI service
      await this.api.aiRequest('/analyze/stop', {
        method: 'POST',
        body: JSON.stringify({
          userId: this.userId
        })
      });
      
      // Notify content script
      await chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'STOP_TRACKING' });
      });
      
      this.tracking = false;
      this.sessionId = null;
      this.engagementScore = 0;
      
      return { success: true };
    } catch (error) {
      console.error('Failed to stop tracking:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Set up tracking intervals
   */
  setupTracking() {
    // Set up webcam capture if enabled
    if (this.settings.enableWebcam) {
      const webcamInterval = setInterval(() => this.requestWebcamCapture(), 10000);
      this.intervalIds.push(webcamInterval);
    }
    
    // Set up engagement polling
    const engagementInterval = setInterval(() => this.pollEngagement(), 15000);
    this.intervalIds.push(engagementInterval);
    
    // Set up activity data sending
    const activityInterval = setInterval(() => this.sendBatchedActivity(), 5000);
    this.intervalIds.push(activityInterval);
  }
  
  /**
   * Request webcam capture from active tab
   */
  async requestWebcamCapture() {
    if (!this.tracking) return;
    
    try {
      await chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'CAPTURE_WEBCAM' });
      });
    } catch (error) {
      console.error('Failed to request webcam capture:', error);
    }
  }
  
  /**
   * Process webcam data
   * @param {string} imageData Base64 image data
   */
  async processWebcamData(imageData) {
    if (!this.tracking) return;
    
    try {
      // Send to both backend and AI service
      const [backendResponse, aiResponse] = await Promise.all([
        this.api.analyzeWebcam(this.sessionId, imageData),
        this.api.aiAnalyzeFace(this.userId, imageData)
      ]);
      
      // Use AI response for real-time feedback
      if (aiResponse && aiResponse.success) {
        this.updateEngagementScore(aiResponse.analysis.engagement_score || 0.5);
      }
    } catch (error) {
      console.error('Failed to process webcam data:', error);
    }
  }
  
  /**
   * Track user activity
   * @param {string} activityType Type of activity
   * @param {Object} data Activity data
   */
  async trackActivity(activityType, data) {
    if (!this.tracking) return;
    
    // Add to batch
    this.batchedActivity.push({
      type: activityType,
      data,
      timestamp: Date.now()
    });
  }
  
  /**
   * Send batched activity data
   */
  async sendBatchedActivity() {
    if (!this.tracking || this.batchedActivity.length === 0) return;
    
    try {
      const activityBatch = [...this.batchedActivity];
      this.batchedActivity = [];
      
      // Send to backend
      await this.api.logEngagementData(this.sessionId, {
        type: 'activity_batch',
        data: activityBatch
      });
      
      // Send to AI service
      await this.api.aiTrackActivity(this.userId, 'batch_activity', activityBatch);
      
    } catch (error) {
      console.error('Failed to send activity data:', error);
      // Put activities back in batch to try again
      this.batchedActivity = [...activityBatch, ...this.batchedActivity];
    }
  }
  
  /**
   * Poll for overall engagement score
   */
  async pollEngagement() {
    if (!this.tracking) return;
    
    try {
      // Get engagement from AI service
      const response = await this.api.aiGetEngagement(this.userId);
      
      if (response && response.success && response.analysis) {
        // Update engagement score
        this.updateEngagementScore(response.analysis.overall_engagement);
      }
    } catch (error) {
      console.error('Failed to poll engagement:', error);
    }
  }
  
  /**
   * Update engagement score and broadcast to UI
   * @param {number} score New engagement score
   */
  updateEngagementScore(score) {
    this.engagementScore = score;
    
    // Broadcast to popup
    chrome.runtime.sendMessage({
      type: 'ENGAGEMENT_UPDATE',
      data: { score }
    });
  }
  
  /**
   * Detect platform based on URL
   */
  detectPlatform(url) {
    if (url.includes('youtube.com')) return 'youtube';
    if (url.includes('coursera.org')) return 'coursera';
    if (url.includes('udemy.com')) return 'udemy';
    if (url.includes('pw.live')) return 'physics_wallah';
    return 'other';
  }
  
  /**
   * Detect device type
   */
  detectDevice() {
    const userAgent = navigator.userAgent;
    if (/iPhone|iPad|iPod/i.test(userAgent)) return 'ios';
    if (/Android/i.test(userAgent)) return 'android';
    return 'desktop';
  }
  
  /**
   * Detect operating system
   */
  detectOS() {
    const userAgent = navigator.userAgent;
    if (/Windows/i.test(userAgent)) return 'Windows';
    if (/Mac/i.test(userAgent)) return 'MacOS';
    if (/Linux/i.test(userAgent)) return 'Linux';
    if (/Android/i.test(userAgent)) return 'Android';
    if (/iPhone|iPad|iPod/i.test(userAgent)) return 'iOS';
    return 'Unknown';
  }
}

// Create tracker instance with API dependency
const engagementTracker = new EngagementTracker(api);
/**
 * Content Script - Engagement Detection Integration
 * 
 * This script integrates all engagement detection modules:
 * - Cursor tracking
 * - Audio detection
 * - Video detection
 * 
 * It listens for messages from each module and combines
 * the data into a comprehensive engagement analysis.
 */

// Debug flag - set to true to enable console logging
const DEBUG_MODE = true;

function debugLog(...args) {
  if (DEBUG_MODE) {
    console.log('[Engagement Detector]', ...args);
  }
}

// Initialize Engagement Analyzer
class EngagementAnalyzer {  constructor() {
    // Storage for the latest data from each module
    this.data = {
      cursor: null,
      audio: null,
      video: null
    };
    
    // Media state tracking
    this.mediaState = {
      isVideoPlaying: false,
      isFullscreen: false,
      isMainContent: false, // Is video the main content on the page
      videoElement: null,
      lastVideoCheck: 0,
      videoCheckInterval: 3000, // Check video status every 3 seconds
      videoDimensions: { width: 0, height: 0 },
      videoPosition: { top: 0, left: 0 },
      videoPlaybackStats: {
        detectionCount: 0,      // Number of times video was detected
        totalPlaybackTime: 0,   // Total time spent watching videos
        lastStateChange: 0      // Timestamp of last state change
      }
    };
    
    // Listen for messages from our trackers
    this.setupMessageListeners();
    
    // Report combined data at regular intervals
    this.reportingInterval = setInterval(() => this.reportEngagement(), 5000);
    
    // Start checking for video playback
    this.videoDetectionInterval = setInterval(() => this.checkVideoPlayback(), this.mediaState.videoCheckInterval);
    
    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
    document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
    document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
    document.addEventListener('MSFullscreenChange', () => this.handleFullscreenChange());
    
    // Log initialization if in debug mode
    if (DEBUG_MODE) {
      debugLog('Initialized at', new Date().toISOString());
      this.addDebugOverlay();
    }
  }
  
  setupMessageListeners() {
    window.addEventListener('message', (event) => {
      // Only process messages from our extension modules
      if (event.source !== window) return;
      
      const data = event.data;
      
      // Route data to the appropriate handler based on type
      switch (data.type) {
        case 'CURSOR_DATA':
          this.handleCursorData(data);
          break;
        case 'AUDIO_DATA':
          this.handleAudioData(data);
          break;
        case 'VIDEO_DATA':
          this.handleVideoData(data);
          break;
      }
    });
    
    debugLog('Message listeners initialized');
  }
  
  handleCursorData(data) {
    // Store the latest cursor data
    this.data.cursor = data;
    
    // Update debug overlay if enabled
    if (DEBUG_MODE) {
      debugLog('Received cursor data', data);
      this.updateDebugOverlay();
    }
    
    // Real-time reactions to cursor data can go here
    // Only consider as disengagement if not watching video
    if (data.engagement.attentionState === 'disengaged' && !this.mediaState.isVideoPlaying) {
      this.notifyDisengagement('cursor');
    }
  }
  
  handleAudioData(data) {
    // Store the latest audio data
    this.data.audio = data;
    
    if (DEBUG_MODE) {
      debugLog('Received audio data', data);
    }
    
    // Real-time reactions to audio data can go here
  }
  
  handleVideoData(data) {
    // Store the latest video data
    this.data.video = data;
    
    if (DEBUG_MODE) {
      debugLog('Received video data', data);
    }
    
    // Real-time reactions to video data can go here
    if (data && data.eyeOpenness < 0.3) {
      this.notifyDisengagement('video');
    }
  }
    // Check if video is currently playing on the page
  checkVideoPlayback() {
    const now = Date.now();
    if (now - this.mediaState.lastVideoCheck < this.mediaState.videoCheckInterval) {
      return;
    }
    
    this.mediaState.lastVideoCheck = now;
    
    // Find all video elements on the page
    const videos = Array.from(document.querySelectorAll('video'));
    
    // Check common video players by site-specific selectors
    const streamingServices = {
      // YouTube
      youtube: ['.html5-video-player', '.ytp-large-play-button', '.ytp-play-button'],
      // Netflix
      netflix: ['.nf-player-container', '.VideoContainer', '.watch-video'],
      // Vimeo
      vimeo: ['.vp-video', '.vp-player-ui-container', '.vp-controls'],
      // Disney+
      disney: ['.btm-media-player', '.controls__container'],
      // Twitch
      twitch: ['.video-player', '.player-controls', '.player-controls__right-control-group'],
      // Amazon Prime Video
      prime: ['.webPlayerContainer', '.webPlayerSDKUiContainer', '.atvwebplayersdk-overlays-container'],
      // Hulu
      hulu: ['.player-container', '.controls-bar'],
      // HBO Max
      hbo: ['.video-player', '.video-player__container'],
      // Generic video containers
      generic: [
        '[data-video-player]',
        '.video-player',
        '.player-container',
        '[role="video"]',
        '.media-player',
        '.video-wrapper',
        '.video-container',
        '.stream-player'
      ]
    };
    
    // Flatten all selectors into a single array and query them
    const allSelectors = Object.values(streamingServices).flat();
    const videoPlayers = allSelectors
      .map(selector => document.querySelector(selector))
      .filter(Boolean);
    
    // Function to check if element is visible and reasonably sized
    const isVisibleVideo = (el) => {
      const rect = el.getBoundingClientRect();
      const minSize = 200; // Minimum dimension to consider it a "main" video
      
      return (
        rect.width >= minSize &&
        rect.height >= minSize &&
        rect.top >= -rect.height / 2 &&
        rect.left >= -rect.width / 2 &&
        rect.bottom <= window.innerHeight + rect.height / 2 &&
        rect.right <= window.innerWidth + rect.width / 2
      );
    };
    
    // Look for streaming site URLs
    const isStreamingSite = () => {
      const url = window.location.href.toLowerCase();
      const streamingDomains = [
        'youtube.com', 'youtu.be',
        'netflix.com',
        'vimeo.com', 
        'disneyplus.com',
        'twitch.tv',
        'primevideo.com', 'amazon.com/gp/video',
        'hulu.com',
        'hbomax.com', 'max.com',
        'peacocktv.com',
        'spotify.com'
      ];
      
      return streamingDomains.some(domain => url.includes(domain));
    };
    
    // Check if any video is playing
    let playingVideo = videos.find(v => !v.paused && !v.ended && v.currentTime > 0 && isVisibleVideo(v));
    
    // Store previous state to check for changes
    const wasPlaying = this.mediaState.isVideoPlaying;
    
    // Update video playing state
    this.mediaState.isVideoPlaying = !!playingVideo;
    
    // If we found a playing video
    if (this.mediaState.isVideoPlaying) {
      this.mediaState.videoElement = playingVideo;
      
      // Get video dimensions and position
      const rect = playingVideo.getBoundingClientRect();
      this.mediaState.videoDimensions = {
        width: rect.width,
        height: rect.height
      };
      this.mediaState.videoPosition = {
        top: rect.top,
        left: rect.left
      };
      
      // Check if video is significantly sized (likely main content)
      const isMainContent = rect.width > window.innerWidth * 0.5 || rect.height > window.innerHeight * 0.5;
      this.mediaState.isMainContent = isMainContent;
      
      if (!wasPlaying) {
        debugLog('Video playback detected', {
          duration: playingVideo.duration,
          dimensions: this.mediaState.videoDimensions,
          isMainContent: isMainContent
        });
      }
    } else if (wasPlaying) {
      debugLog('Video playback ended');
      this.mediaState.videoElement = null;
    }
    
    // Check for video players even if no <video> element is playing
    if (!this.mediaState.isVideoPlaying) {
      // First check for visible video players
      if (videoPlayers.length > 0) {
        const visiblePlayer = videoPlayers.find(isVisibleVideo);
        if (visiblePlayer) {
          this.mediaState.isVideoPlaying = true;
          debugLog('Video player detected without direct video element');
        }
      }
      
      // If on a known streaming site, we can be more confident video is the main activity
      if (isStreamingSite()) {
        if (videos.some(isVisibleVideo)) {
          this.mediaState.isVideoPlaying = true;
          this.mediaState.isMainContent = true;
          debugLog('Streaming site detected with visible video element');
        }
      }
    }
    
    // Check for fullscreen
    this.mediaState.isFullscreen = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
    
    // Update debug overlay
    this.updateDebugOverlay();
  }
  
  handleFullscreenChange() {
    const fullscreenElement = 
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement;
      
    this.mediaState.isFullscreen = !!fullscreenElement;
    
    if (this.mediaState.isFullscreen) {
      debugLog('Entered fullscreen mode');
    } else {
      debugLog('Exited fullscreen mode');
    }
  }
  
  // Check if cursor is within video area (with margin)
  isCursorOverVideo(cursorX, cursorY) {
    if (!this.mediaState.videoElement) return false;
    
    const margin = 50; // px margin around video
    const rect = this.mediaState.videoElement.getBoundingClientRect();
    
    return (
      cursorX >= rect.left - margin &&
      cursorX <= rect.right + margin &&
      cursorY >= rect.top - margin &&
      cursorY <= rect.bottom + margin
    );
  }
    // Evaluate cursor engagement specifically during video playback
  evaluateVideoModeEngagement(cursor) {
    const result = {
      score: 0,
      factors: []
    };
    
    const isFullscreen = this.mediaState.isFullscreen;
    const cursorOverVideo = this.isCursorOverVideo(cursor.position.x, cursor.position.y);
    const idleState = cursor.engagement.attentionState;
    const idleDuration = cursor.metrics.idle.duration;
    const isSteady = cursor.engagement.focusQuality === 'steady';
    const activityLevel = cursor.engagement.activityLevel;
    
    // For video streaming, idle cursor is often a GOOD sign of engagement
    // The user is focused on content, not moving their cursor
    if (idleState === 'disengaged' || idleState === 'inactive') {
      // Long idle times during video are positive indicators
      result.score += 20;
      result.factors.push('steady/idle cursor during video (strong positive)');
    } else if (idleState === 'paused') {
      // Short pauses are neutral to positive
      result.score += 10;
      result.factors.push('occasional pauses during video (positive)');
    }
    
    // Steady cursor movement (not erratic) is also a good sign
    if (idleState !== 'disengaged' && isSteady) {
      result.score += 15;
      result.factors.push('steady cursor movement during video (positive)');
    }
    
    // High activity only makes sense when interacting with controls
    if (activityLevel === 'high') {
      if (cursorOverVideo) {
        // Could be interacting with video controls
        result.score += 5;
        result.factors.push('interactive video control usage');
      } else {
        // Excessive movement away from video may indicate distraction
        result.score -= 15;
        result.factors.push('excessive cursor activity away from video (negative)');
      }
    }
    
    // Special handling for fullscreen videos
    if (isFullscreen) {
      if (cursor.metrics.idle.isIdle) {
        // In fullscreen, idle cursor is ideal
        result.score += 15;
        result.factors.push('appropriate idle cursor during fullscreen video (strong positive)');
      }
      
      // Any minimal movement in fullscreen is likely engagement
      if (activityLevel === 'low' && !cursor.metrics.idle.isIdle) {
        result.score += 10;
        result.factors.push('minimal movement during fullscreen (positive)');
      }
    }
    
    // For streaming sites, consider occasional small movements as checks on progress
    if (activityLevel === 'low' && cursorOverVideo) {
      result.score += 5;
      result.factors.push('checking video progress (positive)');
    }
    
    return result;
  }

  // Combine data from all sources to determine overall engagement
  analyzeEngagement() {
    // Default to medium engagement if we don't have enough data
    if (!this.data.cursor && !this.data.audio && !this.data.video) {
      return { score: 50, confidence: 'low', state: 'unknown' };
    }
    
    let engagementScore = 50; // Default score (0-100)
    let confidenceLevel = 'medium';
    let factors = [];
    let isWatchingVideo = this.mediaState.isVideoPlaying;
    
    // Cursor-based engagement factors
    if (this.data.cursor) {
      const cursor = this.data.cursor;
      
      // If video is playing, use specialized video engagement evaluation
      if (isWatchingVideo) {
        const videoEngagement = this.evaluateVideoModeEngagement(cursor);
        engagementScore += videoEngagement.score;
        factors.push(...videoEngagement.factors);
      } else {
        // Normal webpage (no video) - use standard cursor metrics
        // Speed indicates activity level
        if (cursor.engagement.activityLevel === 'high') {
          engagementScore += 15;
          factors.push('high cursor activity');
        } else if (cursor.engagement.activityLevel === 'low') {
          engagementScore -= 10;
          factors.push('low cursor activity');
        }
        
        // Jitter may indicate focus quality
        if (cursor.engagement.focusQuality === 'erratic') {
          engagementScore -= 5;
          factors.push('erratic cursor movement');
        } else if (cursor.engagement.focusQuality === 'steady') {
          engagementScore += 5;
          factors.push('steady cursor movement');
        }
        
        // Idle time strongly indicates disengagement (when not watching video)
        if (cursor.engagement.attentionState === 'disengaged') {
          engagementScore -= 25;
          factors.push('cursor idle');
        } else if (cursor.engagement.attentionState === 'active') {
          engagementScore += 10;
          factors.push('cursor active');
        }
      }
      
      confidenceLevel = 'high';
    }
    
    // Audio-based engagement factors
    if (this.data.audio) {
      // Add audio engagement logic
      // Example: speech detection, noise levels, etc.
      confidenceLevel = 'high';
    }
    
    // Video-based engagement factors
    if (this.data.video) {
      // Add video engagement logic
      // Example: eye openness, gaze direction, etc.
      confidenceLevel = 'high';
    }
      // Ensure the score stays in the 0-100 range
    engagementScore = Math.max(0, Math.min(100, engagementScore));
    
    // Determine engagement state based on score
    let engagementState;
    if (engagementScore < 30) {
      engagementState = 'disengaged';
    } else if (engagementScore < 60) {
      engagementState = 'passive';
    } else if (engagementScore < 85) {
      engagementState = 'engaged';
    } else {
      engagementState = 'highly engaged';
    }
    
    // If watching video, adjust the state description with more detailed video states
    if (isWatchingVideo) {
      if (engagementScore < 30) {
        engagementState = 'distracted viewing';
      } else if (engagementScore < 60) {
        engagementState = 'casual viewing';
      } else if (engagementScore < 85) {
        engagementState = 'focused viewing';
      } else {
        engagementState = 'immersed viewing';
      }
      
      // Extra information for fullscreen
      if (this.mediaState.isFullscreen) {
        engagementState = 'fullscreen ' + engagementState;
      }
    }
    
    // Build engagement result object with detailed video metrics
    const result = {
      score: engagementScore,
      state: engagementState,
      confidence: confidenceLevel,
      factors: factors,
      timestamp: Date.now(),
      cursorData: this.data.cursor, // Include the cursor data directly
      mediaState: {
        isVideoPlaying: this.mediaState.isVideoPlaying,
        isFullscreen: this.mediaState.isFullscreen,
        isMainContent: this.mediaState.isMainContent || false
      }
    };
    
    // Add video-specific engagement metrics if watching video
    if (isWatchingVideo && this.data.cursor) {
      // Calculate percentage of time cursor was steady/idle during video
      const cursor = this.data.cursor;
      result.videoEngagement = {
        cursorIdle: cursor.metrics.idle.isIdle,
        idleDuration: cursor.metrics.idle.duration,
        cursorOverVideo: this.isCursorOverVideo(cursor.position.x, cursor.position.y),
        steadyCursor: cursor.engagement.focusQuality === 'steady',
        // Higher score means better video engagement based on our custom logic
        videoEngagementScore: Math.min(100, engagementScore + 10), // Slightly boost video engagement score
        timestamp: Date.now()
      };
    }
    
    return result;
  }
    notifyDisengagement(source) {
    // Special handling for cursor data during video playback
    if (source === 'cursor' && this.mediaState.isVideoPlaying) {
      // For video streaming, steady/idle cursor is a POSITIVE sign of engagement
      // We don't notify disengagement, and may even notify good engagement
      
      // Check if cursor is steady/idle and video is playing
      if (this.data.cursor && 
          (this.data.cursor.engagement.attentionState === 'disengaged' || 
           this.data.cursor.engagement.attentionState === 'inactive')) {
        
        // Video-specific engagement notification (positive)
        try {
          chrome.runtime.sendMessage({
            type: 'ENGAGEMENT_ALERT',
            source: 'video-cursor',
            level: 'engaged',  // This is a positive signal for videos
            details: 'Steady cursor during video playback indicates focused viewing',
            timestamp: Date.now()
          });
          
          if (DEBUG_MODE) {
            debugLog('Video engagement detected: steady cursor during playback', {
              isFullscreen: this.mediaState.isFullscreen,
              idleDuration: this.data.cursor.metrics.idle.duration
            });
          }
        } catch (error) {
          if (DEBUG_MODE) {
            debugLog('Error sending video engagement notification:', error);
          }
        }
      }
      
      // Don't continue with disengagement notification for cursor during video
      debugLog('Ignoring cursor disengagement during video playback - this is normal behavior');
      return;
    }
    
    // Regular disengagement notification for non-video scenarios
    // or non-cursor sources during video
    try {
      chrome.runtime.sendMessage({
        type: 'ENGAGEMENT_ALERT',
        source: source,
        level: 'disengagement',
        timestamp: Date.now()
      });
      
      if (DEBUG_MODE) {
        debugLog(`Disengagement detected from ${source} at ${new Date().toISOString()}`);
      }
    } catch (error) {
      if (DEBUG_MODE) {
        debugLog('Error sending disengagement notification:', error);
      }
    }
  }
  
  reportEngagement() {
    const engagementData = this.analyzeEngagement();
    
    // Send to background script
    try {
      chrome.runtime.sendMessage({
        type: 'ENGAGEMENT_UPDATE',
        data: engagementData
      });
      
      // Log for debugging
      if (DEBUG_MODE) {
        debugLog('Engagement update sent:', engagementData);
      }
    } catch (error) {
      if (DEBUG_MODE) {
        debugLog('Error sending engagement update:', error);
      }
    }
  }
  
  // Add a debug overlay to visualize tracking in real-time
  addDebugOverlay() {
    try {
      // Create overlay container
      const overlay = document.createElement('div');
      overlay.id = 'engagement-detector-debug';
      overlay.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        width: 200px;
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-family: monospace;
        font-size: 12px;
        z-index: 9999;
        opacity: 0.8;
        pointer-events: none;
      `;
      
      // Header
      const header = document.createElement('div');
      header.textContent = 'Engagement Detector';
      header.style.cssText = 'font-weight: bold; border-bottom: 1px solid #666; padding-bottom: 5px; margin-bottom: 5px;';
      overlay.appendChild(header);
      
      // Status indicator
      const status = document.createElement('div');
      status.id = 'ed-debug-status';
      status.style.cssText = 'color: #4CAF50;';
      status.textContent = 'Active';
      overlay.appendChild(status);
      
      // Cursor metrics
      const metrics = document.createElement('div');
      metrics.id = 'ed-debug-metrics';
      metrics.style.cssText = 'margin-top: 10px;';
      overlay.appendChild(metrics);
      
      // Video status
      const videoStatus = document.createElement('div');
      videoStatus.id = 'ed-video-status';
      videoStatus.style.cssText = 'margin-top: 10px; padding-top: 5px; border-top: 1px solid #666;';
      overlay.appendChild(videoStatus);
      
      // Add version info
      const version = document.createElement('div');
      version.style.cssText = 'margin-top: 5px; font-size: 10px; color: #999;';
      version.textContent = 'v1.0 - ' + new Date().toLocaleDateString();
      overlay.appendChild(version);
      
      // Add to document
      document.body.appendChild(overlay);
      
      // Flash status to indicate it's working
      setInterval(() => {
        const statusEl = document.getElementById('ed-debug-status');
        if (statusEl) {
          statusEl.style.color = '#4CAF50';
          setTimeout(() => {
            if (statusEl) statusEl.style.color = '#666';
          }, 500);
        }
      }, 2000);
      
      debugLog('Debug overlay added');
    } catch (error) {
      debugLog('Error adding debug overlay:', error);
    }
  }
    // Update the debug overlay with current metrics
  updateDebugOverlay() {
    try {
      // Update cursor metrics
      const metricsEl = document.getElementById('ed-debug-metrics');
      if (metricsEl && this.data.cursor) {
        const cursor = this.data.cursor;
        const metrics = cursor.metrics || {};
        
        const videoMode = this.mediaState.isVideoPlaying;
        const stateColor = videoMode && (cursor.engagement.attentionState === 'disengaged' || 
                           cursor.engagement.attentionState === 'inactive') ? 
                           '#4CAF50' : // Green for good in video mode
                           (cursor.engagement.attentionState === 'disengaged' ? '#FF5252' : '#4CAF50');
        
        // Add indication if this is good or bad based on context
        const idleIndicator = videoMode && metrics.idle && metrics.idle.isIdle ? 
                             '<span style="color: #4CAF50">✓</span>' : // Green checkmark for good
                             (!videoMode && metrics.idle && metrics.idle.isIdle ? 
                              '<span style="color: #FF5252">✗</span>' : ''); // Red X for bad
        
        metricsEl.innerHTML = `
          <div>Position: ${cursor.position.x.toFixed(0)}, ${cursor.position.y.toFixed(0)}</div>
          <div>Speed: ${metrics.speed ? metrics.speed.toFixed(1) : 'N/A'} px/s</div>
          <div>Jitter: ${metrics.jitter ? metrics.jitter.toFixed(2) : 'N/A'}</div>
          <div>Idle: ${metrics.idle && metrics.idle.duration ? (metrics.idle.duration/1000).toFixed(1) : '0'} s ${idleIndicator}</div>
          <div>State: <span style="color: ${stateColor}">${cursor.engagement ? cursor.engagement.attentionState : 'Unknown'}</span></div>
          <div>Focus: ${cursor.engagement ? cursor.engagement.focusQuality : 'Unknown'}</div>
        `;
      }
      
      // Update video status
      const videoStatusEl = document.getElementById('ed-video-status');
      if (videoStatusEl) {
        if (this.mediaState.isVideoPlaying) {
          const dimensions = this.mediaState.videoDimensions;
          
          // Calculate engagement description based on cursor state
          let engagementDesc = 'Unknown';
          let engagementColor = '#999';
          
          if (this.data.cursor) {
            const isIdle = this.data.cursor.metrics.idle.isIdle;
            const isSteady = this.data.cursor.engagement.focusQuality === 'steady';
            const cursorOverVideo = this.isCursorOverVideo(
              this.data.cursor.position.x, this.data.cursor.position.y);
              
            if (isIdle || isSteady) {
              engagementDesc = 'Good Engagement';
              engagementColor = '#4CAF50';
            } else if (cursorOverVideo) {
              engagementDesc = 'Interactive';
              engagementColor = '#2196F3';
            } else {
              engagementDesc = 'Active Outside';
              engagementColor = '#FF9800';
            }
          }
          
          videoStatusEl.innerHTML = `
            <div style="color: #4CAF50;">📹 Video playing</div>
            <div>Size: ${dimensions.width.toFixed(0)}x${dimensions.height.toFixed(0)}</div>
            <div>Fullscreen: ${this.mediaState.isFullscreen ? 'Yes' : 'No'}</div>
            <div>Cursor: <span style="color: ${engagementColor}">${engagementDesc}</span></div>
          `;
        } else {
          videoStatusEl.innerHTML = `<div>📹 No video playing</div>`;
        }
      }
    } catch (error) {
      debugLog('Error updating debug overlay:', error);
    }
  }
  
  destroy() {
    clearInterval(this.reportingInterval);
    clearInterval(this.videoDetectionInterval);
    debugLog('Engagement analyzer destroyed');
    
    // Remove debug overlay if it exists
    const overlay = document.getElementById('engagement-detector-debug');
    if (overlay) {
      document.body.removeChild(overlay);
    }
  }
}

// Initialize the engagement analyzer
const analyzer = new EngagementAnalyzer();

// Import and initialize our cursor tracker
// Note: Using dynamic import for modules
(async function() {
  try {
    debugLog('Initializing cursor tracker');
    
    // Initialize cursor tracking
    // We're loading it here rather than as a separate import to ensure proper execution order
    const cursorTracker = new CursorTracker({
      debug: DEBUG_MODE,
      reportingInterval: 2000
    });

    debugLog('All engagement detection modules loaded');
    
    // Send initial message to background script to indicate content script is active
    try {
      chrome.runtime.sendMessage({
        type: 'CONTENT_SCRIPT_LOADED',
        timestamp: Date.now(),
        url: window.location.href
      });
      
      debugLog('Sent content script loaded notification');
    } catch (error) {
      debugLog('Error sending content script loaded notification:', error);
    }
    
    if (DEBUG_MODE) {
      // Add a test function to window object to help with debugging
      window.__testEngagementDetector = {
        getStatus: function() {
          return {
            initialized: true,
            analyzer: analyzer ? true : false,
            cursorTracker: cursorTracker ? true : false,
            cursorData: analyzer.data.cursor,
            lastUpdate: new Date().toISOString()
          };
        },
        toggleDebugOverlay: function() {
          const overlay = document.getElementById('engagement-detector-debug');
          if (overlay) {
            overlay.style.display = overlay.style.display === 'none' ? 'block' : 'none';
          }
          return overlay ? "Toggled overlay visibility" : "Overlay not found";
        },
        sendTestData: function() {
          try {
            const testData = analyzer.analyzeEngagement();
            chrome.runtime.sendMessage({
              type: 'ENGAGEMENT_UPDATE',
              data: testData
            });
            return "Test data sent to background script";
          } catch (error) {
            return "Error sending test data: " + error.message;
          }
        }
      };
      
      debugLog('Debug mode enabled. Access debug functions through window.__testEngagementDetector');
    }
  } catch (error) {
    debugLog('Error initializing engagement detection:', error);
  }
})();

/**
 * Cursor Tracking Module for Engagement Detection
 * 
 * This module tracks cursor movements and calculates engagement metrics including:
 * - Cursor position (x, y)
 * - Movement speed
 * - Idle time
 * - Jitter (erratic movement)
 * 
 * Data is sent via window.postMessage every 2 seconds
 */

class CursorTracker {
  constructor(options = {}) {
    // Configuration
    this.config = {
      reportingInterval: options.reportingInterval || 2000, // ms
      idleThreshold: options.idleThreshold || 3000, // ms
      bufferSize: options.bufferSize || 15, // number of positions to store
      jitterThreshold: options.jitterThreshold || 5, // px
      debug: options.debug || false,
      ...options
    };

    // Buffer to store recent cursor positions with timestamps
    this.positionBuffer = [];
    
    // Current cursor state
    this.currentState = {
      position: { x: 0, y: 0 },
      lastMoveTime: Date.now(),
      isIdle: false,
      idleDuration: 0
    };

    // Statistics for self-testing
    this.stats = {
      totalMovements: 0,
      lastReportTime: Date.now(),
      reports: 0,
      startTime: Date.now()
    };

    // Bind methods to this
    this.onMouseMove = this.onMouseMove.bind(this);
    this.reportData = this.reportData.bind(this);

    // Initialize tracker
    this.init();
  }

  init() {
    // Add event listeners
    document.addEventListener('mousemove', this.onMouseMove);
    
    // Set up the reporting interval
    this.reportingTimer = setInterval(this.reportData, this.config.reportingInterval);

    if (this.config.debug) {
      console.log('[Cursor Tracker] Initialized with config:', this.config);
      
      // Add self-test functionality to window
      window.__cursorTrackerTest = {
        isActive: () => true,
        getStats: () => this.getStats(),
        getConfig: () => this.config,
        getCurrentState: () => ({
          ...this.currentState,
          bufferSize: this.positionBuffer.length,
          uptime: Date.now() - this.stats.startTime
        }),
        triggerTestReport: () => {
          this.reportData();
          return 'Test report triggered';
        }
      };
    }

    console.log('Cursor tracker initialized');
  }

  onMouseMove(event) {
    const currentTime = Date.now();
    const position = { 
      x: event.clientX, 
      y: event.clientY, 
      timestamp: currentTime 
    };
    
    // Update current position
    this.currentState.position = { x: position.x, y: position.y };
    
    // Reset idle state if was idle
    if (this.currentState.isIdle) {
      this.currentState.isIdle = false;
    }
    
    // Update last movement time
    this.currentState.lastMoveTime = currentTime;
    
    // Add to buffer, maintain buffer size
    this.positionBuffer.push(position);
    if (this.positionBuffer.length > this.config.bufferSize) {
      this.positionBuffer.shift();
    }
    
    // Update stats
    this.stats.totalMovements++;
  }

  calculateSpeed() {
    if (this.positionBuffer.length < 2) {
      return 0;
    }

    let totalDistance = 0;
    let totalTime = 0;

    // Calculate total distance and time across buffer
    for (let i = 1; i < this.positionBuffer.length; i++) {
      const prev = this.positionBuffer[i - 1];
      const curr = this.positionBuffer[i];
      
      const distance = Math.sqrt(
        Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
      );
      
      const timeDiff = curr.timestamp - prev.timestamp;
      
      // Only count if there was actual movement
      if (distance > 0 && timeDiff > 0) {
        totalDistance += distance;
        totalTime += timeDiff;
      }
    }

    // Calculate average speed in pixels per millisecond, convert to pixels per second
    return totalTime > 0 ? (totalDistance / totalTime) * 1000 : 0;
  }

  calculateJitter() {
    if (this.positionBuffer.length < 3) {
      return 0;
    }

    let jitterScore = 0;
    let directionChanges = 0;

    // Calculate direction changes and angle differences
    for (let i = 2; i < this.positionBuffer.length; i++) {
      const pos1 = this.positionBuffer[i - 2];
      const pos2 = this.positionBuffer[i - 1];
      const pos3 = this.positionBuffer[i];

      // Calculate vectors
      const vector1 = {
        x: pos2.x - pos1.x,
        y: pos2.y - pos1.y
      };
      
      const vector2 = {
        x: pos3.x - pos2.x,
        y: pos3.y - pos2.y
      };

      // Skip if there's no movement in either vector
      const mag1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
      const mag2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);
      
      if (mag1 < this.config.jitterThreshold || mag2 < this.config.jitterThreshold) {
        continue;
      }

      // Calculate dot product and angle between vectors
      const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
      const cosAngle = dotProduct / (mag1 * mag2);
      
      // Clamp to avoid floating point errors
      const clampedCosAngle = Math.max(-1, Math.min(1, cosAngle));
      
      // Calculate angle in radians
      const angle = Math.acos(clampedCosAngle);
      
      // If angle is significant (direction change), add to jitter score
      if (angle > Math.PI / 6) { // 30 degrees threshold
        directionChanges++;
        jitterScore += angle;
      }
    }

    // Normalize jitter score based on number of points analyzed
    const effectivePoints = this.positionBuffer.length - 2;
    return effectivePoints > 0 ? (jitterScore / effectivePoints) * (directionChanges / effectivePoints) * 10 : 0;
  }

  calculateIdleDuration() {
    const currentTime = Date.now();
    const timeSinceLastMove = currentTime - this.currentState.lastMoveTime;
    
    // Check if idle (no movement for more than the threshold)
    if (timeSinceLastMove > this.config.idleThreshold) {
      this.currentState.isIdle = true;
      this.currentState.idleDuration = timeSinceLastMove;
    }
    
    return this.currentState.idleDuration;
  }

  getStats() {
    const currentTime = Date.now();
    const uptimeMs = currentTime - this.stats.startTime;
    
    return {
      uptime: {
        ms: uptimeMs,
        seconds: Math.floor(uptimeMs / 1000),
        minutes: Math.floor(uptimeMs / 60000)
      },
      movements: {
        total: this.stats.totalMovements,
        perSecond: this.stats.totalMovements / (uptimeMs / 1000)
      },
      reports: {
        total: this.stats.reports,
        perMinute: this.stats.reports / (uptimeMs / 60000),
        lastReportTime: new Date(this.stats.lastReportTime).toISOString()
      },
      bufferSize: this.positionBuffer.length,
      isTracking: document.hasFocus(),
      currentPosition: this.currentState.position
    };
  }

  reportData() {
    // Calculate metrics
    const speed = this.calculateSpeed();
    const jitter = this.calculateJitter();
    const idleDuration = this.calculateIdleDuration();
    
    // Create data package
    const cursorData = {
      type: "CURSOR_DATA",
      timestamp: Date.now(),
      position: this.currentState.position,
      metrics: {
        speed: speed,                // pixels per second
        jitter: jitter,              // normalized jitter score
        idle: {
          isIdle: this.currentState.isIdle,
          duration: idleDuration     // ms
        }
      },
      // Engagement indicators
      engagement: {
        // Low speed could indicate boredom, high speed could be focused activity
        activityLevel: this.mapSpeedToActivity(speed),
        
        // High jitter might indicate anxiety or distraction
        focusQuality: this.mapJitterToFocus(jitter),
        
        // Long idle time indicates disengagement
        attentionState: this.mapIdleToAttention(idleDuration)
      }
    };

    // Send data using postMessage
    window.postMessage(cursorData, "*");
    
    // Update stats
    this.stats.reports++;
    this.stats.lastReportTime = Date.now();
    
    // For debugging
    if (this.config.debug) {
      console.log("[Cursor Tracker] Reporting data:", cursorData);
    }
  }

  // Maps raw metrics to engagement indicators
  mapSpeedToActivity(speed) {
    if (speed < 50) return "low";     // Possibly bored
    if (speed < 300) return "medium";
    return "high";                     // Focused or anxious
  }

  mapJitterToFocus(jitter) {
    if (jitter < 0.2) return "steady"; // Calm, focused
    if (jitter < 0.6) return "normal";
    return "erratic";                  // Distracted or anxious
  }

  mapIdleToAttention(idleDuration) {
    if (idleDuration === 0) return "active";
    if (idleDuration < 5000) return "paused";  // Brief pause
    if (idleDuration < 15000) return "inactive";
    return "disengaged";                        // Not at computer or fully disengaged
  }

  // Clean up resources
  destroy() {
    document.removeEventListener('mousemove', this.onMouseMove);
    clearInterval(this.reportingTimer);
    console.log('Cursor tracker destroyed');
    
    // Clean up test functions
    if (this.config.debug && window.__cursorTrackerTest) {
      delete window.__cursorTrackerTest;
    }
  }
}

// Initialize the tracker when the script loads
const cursorTracker = new CursorTracker({
  debug: true,  // Enable debug mode for testing
  reportingInterval: 2000,  // Report every 2 seconds
  idleThreshold: 3000       // Idle after 3 seconds of no movement
});

// Export the tracker for integration with other modules
if (typeof module !== 'undefined') {
  module.exports = { CursorTracker };
}

// filepath: c:\Users\HP\Desktop\demo\extension\scripts\intervention.js
class InterventionManager {
  constructor(api, engagementTracker) {
    this.api = api;
    this.engagementTracker = engagementTracker;
    this.sessionId = null;
    this.checkIntervalId = null;
    this.activeIntervention = null;
    this.interventionCooldown = 180000; // 3 minutes
    this.lastInterventionTime = 0;
  }

  /**
   * Start intervention checking
   * @param {string} sessionId Active session ID
   */
  startChecking(sessionId) {
    this.sessionId = sessionId;
    
    // Clear any existing interval
    if (this.checkIntervalId) {
      clearInterval(this.checkIntervalId);
    }
    
    // Check for interventions every 30 seconds
    this.checkIntervalId = setInterval(() => this.checkForIntervention(), 30000);
  }
  
  /**
   * Stop intervention checking
   */
  stopChecking() {
    if (this.checkIntervalId) {
      clearInterval(this.checkIntervalId);
      this.checkIntervalId = null;
    }
    
    this.sessionId = null;
    this.activeIntervention = null;
  }
  
  /**
   * Check if intervention is needed
   */
  async checkForIntervention() {
    if (!this.sessionId || this.activeIntervention) return;
    
    // Check cooldown period
    const now = Date.now();
    if (now - this.lastInterventionTime < this.interventionCooldown) {
      return;
    }
    
    try {
      // Check current engagement
      const currentScore = this.engagementTracker.engagementScore;
      
      // Only check server if engagement is low
      if (currentScore < 0.4) {
        const response = await this.api.checkIntervention(this.sessionId);
        
        if (response && response.intervention) {
          this.showIntervention(response.intervention);
        }
      }
    } catch (error) {
      console.error('Failed to check for intervention:', error);
    }
  }
  
  /**
   * Show intervention to user
   * @param {Object} intervention Intervention data
   */
  async showIntervention(intervention) {
    // Set as active intervention
    this.activeIntervention = intervention;
    this.lastInterventionTime = Date.now();
    
    try {
      // Send to content script to display
      await chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { 
          type: 'SHOW_INTERVENTION',
          intervention
        });
      });
    } catch (error) {
      console.error('Failed to show intervention:', error);
      this.activeIntervention = null;
    }
  }
  
  /**
   * Record user response to intervention
   * @param {string} interventionId Intervention ID
   * @param {Object} response User response
   */
  async recordResponse(interventionId, response) {
    try {
      await this.api.recordInterventionResponse(interventionId, response);
      this.activeIntervention = null;
    } catch (error) {
      console.error('Failed to record intervention response:', error);
    }
  }
}

// Create intervention manager with dependencies
const interventionManager = new InterventionManager(api, engagementTracker);
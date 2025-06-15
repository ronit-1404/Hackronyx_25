class EngagementAPI {
  constructor() {
    this.baseUrl = 'http://localhost:5000/api'; // Default URL
    this.token = null;
    this.aiServiceUrl = 'http://localhost:5001/api'; // AI service URL
  }

  /**
   * Set the auth token for API requests
   * @param {string} token JWT auth token
   */
 // Add this method to share tokens between extension and webpage contexts
async setToken(token) {
  this.token = token;
  
  // Store in chrome.storage for extension use
  await chrome.storage.local.set({ auth_token: token });
  
  // Also try to store in localStorage for dashboard access
  try {
    localStorage.setItem('auth_token', token);
    console.log('Token stored in localStorage for dashboard');
  } catch (error) {
    // This might fail in background or service worker context
    console.log('Could not store in localStorage - likely in extension context');
  }
}

// Add a method to get stored token from localStorage or chrome.storage
async getStoredToken() {
  try {
    // Try localStorage first (for web pages)
    const localToken = localStorage.getItem('auth_token');
    if (localToken) return localToken;
  } catch (e) {
    // Ignore - might be in extension context
  }
  
  // Fall back to chrome.storage (for extension)
  try {
    const data = await chrome.storage.local.get('auth_token');
    return data.auth_token || null;
  } catch (e) {
    console.error('Error getting token from storage:', e);
    return null;
  }
}

  /**
   * Clear stored auth token
   */
  clearToken() {
    this.token = null;
    chrome.storage.local.remove('auth_token');
  }

  /**
   * Make an authenticated API request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} Response data
   */
 async request(endpoint, options = {}) {
  console.log(`API Request: ${endpoint}`, options);
  const token = await this.getToken();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  if (token) {
    defaultOptions.headers.token = token;
  }
  
  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };
  
  const response = await fetch(`${this.baseUrl}${endpoint}`, fetchOptions);
  const data = await response.json();
  
  console.log(`API Response for ${endpoint}:`, data); // FIXED: Moved after data is defined
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
}

  /**
   * Make a request to the AI service
   */
  async aiRequest(endpoint, options = {}) {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const fetchOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };
    
    const response = await fetch(`${this.aiServiceUrl}${endpoint}`, fetchOptions);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'AI service request failed');
    }
    
    return data;
  }

  /**
   * Login user and store JWT token
   * @param {string} email User email
   * @param {string} password User password
   * @returns {Promise<Object>} User data
   */
  async login(email, password) {
  try {
    console.log('Login attempt for:', email);
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    console.log('Login response:', data);
    
    if (data.success && data.token) {
      await this.setToken(data.token);
      return data.user;
    }
    
    return null;
  } catch (error) {
    console.error('Login error details:', error);
    throw error;
  }
}

  /**
   * Get user profile
   * @returns {Promise<Object>} User profile data
   */
  async getUserProfile() {
    const data = await this.request('/auth/profile');
    return data.user;
  }


  // Add this method
// Add this method
  async getToken() {
    if (this.token) return this.token;
    return await this.getStoredToken();
  }


  /**
   * Start a new learning session
   * @param {Object} sessionData Session parameters
   * @returns {Promise<Object>} Session data
   */
  async startSession(sessionData) {
    return this.request('/sessions/start', {
      method: 'POST',
      body: JSON.stringify(sessionData)
    });
  }

  /**
   * End a learning session
   * @param {string} sessionId Session ID to end
   * @returns {Promise<Object>} Session data
   */
  async endSession(sessionId) {
    return this.request(`/sessions/${sessionId}/end`, {
      method: 'POST'
    });
  }

  /**
   * Log engagement data
   * @param {string} sessionId Active session ID
   * @param {Object} data Engagement data
   * @returns {Promise<Object>} Response data
   */
  async logEngagementData(sessionId, data) {
    return this.request('/engagement/log', {
      method: 'POST',
      body: JSON.stringify({
        sessionId,
        ...data
      })
    });
  }

  /**
   * Send webcam image for analysis
   * @param {string} sessionId Active session ID
   * @param {string} imageData Base64 image data
   * @returns {Promise<Object>} Analysis data
   */
  async analyzeWebcam(sessionId, imageData) {
    return this.request('/engagement/webcam', {
      method: 'POST',
      body: JSON.stringify({
        sessionId,
        imageData
      })
    });
  }

  /**
   * Check for interventions
   * @param {string} sessionId Active session ID
   * @returns {Promise<Object>} Intervention data if available
   */
  async checkIntervention(sessionId) {
    return this.request(`/extension/intervention/${sessionId}`);
  }

  /**
   * Record response to an intervention
   * @param {string} interventionId Intervention ID
   * @param {Object} response User response data
   * @returns {Promise<Object>} Response data
   */
  async recordInterventionResponse(interventionId, response) {
    return this.request(`/interventions/${interventionId}/response`, {
      method: 'POST',
      body: JSON.stringify(response)
    });
  }

  /**
   * Get user preferences
   * @returns {Promise<Object>} User preferences
   */
  async getUserPreferences() {
    const profile = await this.getUserProfile();
    return profile.preferences;
  }
  
  /**
   * Update user preferences
   * @param {Object} preferences User preferences
   * @returns {Promise<Object>} Updated user data
   */
  async updatePreferences(preferences) {
    return this.request('/auth/preferences', {
      method: 'PUT',
      body: JSON.stringify({ preferences })
    });
  }

  /**
   * Directly analyze webcam with AI service
   * @param {string} userId User ID
   * @param {string} imageData Base64 image data
   */
  async aiAnalyzeFace(userId, imageData) {
    return this.aiRequest('/analyze/face', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        imageData
      })
    });
  }

  /**
   * Send activity data to AI service
   */
  async aiTrackActivity(userId, activityType, activityData) {
    return this.aiRequest('/analyze/activity', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        type: activityType,
        data: activityData
      })
    });
  }

  /**
   * Get current engagement analysis
   */
  async aiGetEngagement(userId) {
    return this.aiRequest(`/analyze/engagement?userId=${userId}`);
  }
}

// Export singleton instance
const api = new EngagementAPI();
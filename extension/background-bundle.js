// Include all necessary classes and objects from other files

// From api.js
class EngagementAPI {
  constructor() {
    this.baseUrl = 'http://localhost:5000/api';
    this.token = null;
    this.aiServiceUrl = 'http://localhost:5000/api';
  }

  async setToken(token) {
    this.token = token;
    await chrome.storage.local.set({ auth_token: token });
  }

  async getToken() {
    try {
      const data = await chrome.storage.local.get('auth_token');
      this.token = data.auth_token || null;
      return this.token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  async clearToken() {
    this.token = null;
    await chrome.storage.local.remove('auth_token');
  }

  async login(email, password) {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success && data.token) {
        await this.setToken(data.token);
        return data.user;
      }
      
      throw new Error(data.message || 'Login failed');
    } catch (error) {
      console.error('API login error:', error);
      throw error;
    }
  }

  async getUserProfile() {
    try {
      const token = await this.getToken();
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const response = await fetch(`${this.baseUrl}/auth/profile`, {
        headers: {
          'token': token
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.user;
      }
      
      throw new Error(data.message || 'Failed to get user profile');
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  }

  async getUserPreferences() {
    try {
      const user = await this.getUserProfile();
      return user ? user.preferences : null;
    } catch (error) {
      console.error('Error getting preferences:', error);
      throw error;
    }
  }

  // Add any other API methods you have in api.js
}

// From auth.js
class AuthManager {
  constructor(api) {
    this.api = api;
    this.user = null;
  }

  async checkAuthStatus() {
    try {
      const token = await this.api.getToken();
      
      if (!token) {
        return false;
      }
      
      // Verify token by getting user profile
      const user = await this.api.getUserProfile();
      this.user = user;
      
      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      // Invalid token, clear it
      this.api.clearToken();
      return false;
    }
  }

  async login(email, password) {
    try {
      this.user = await this.api.login(email, password);
      return !!this.user;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  async logout() {
    await this.api.clearToken();
    this.user = null;
  }

  async getUser() {
    if (!this.user) {
      try {
        if (await this.checkAuthStatus()) {
          return this.user;
        }
        return null;
      } catch (error) {
        console.error('Failed to get user:', error);
        return null;
      }
    }
    return this.user;
  }
}

// From engagement.js
class EngagementTracker {
  constructor(api) {
    this.api = api;
    this.session = null;
    this.isTracking = false;
    this.settings = {};
  }

  async startTracking(settings = {}) {
    try {
      // Get current tab info
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const currentTab = tabs[0];
      
      if (!currentTab) {
        throw new Error('No active tab found');
      }
      
      // Prepare session data
      const sessionData = {
        courseUrl: currentTab.url,
        courseName: currentTab.title,
        platform: new URL(currentTab.url).hostname,
        deviceInfo: {
          browser: 'Chrome',
          userAgent: navigator.userAgent
        },
        settings: settings
      };
      
      // Call API to start session
      const response = await fetch(`${this.api.baseUrl}/sessions/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': await this.api.getToken()
        },
        body: JSON.stringify(sessionData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        this.session = data.session;
        this.isTracking = true;
        this.settings = settings;
        
        return {
          success: true,
          sessionId: this.session._id
        };
      }
      
      throw new Error(data.message || 'Failed to start tracking');
    } catch (error) {
      console.error('Start tracking error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update the stopTracking method in EngagementTracker class

async stopTracking() {
  try {
    if (!this.session || !this.isTracking) {
      console.log('No active tracking session to stop');
      return {
        success: false,
        error: 'No active tracking session'
      };
    }
    
    console.log('Stopping session with ID:', this.session._id);
    
    // Call API to end session
    const response = await fetch(`${this.api.baseUrl}/sessions/${this.session._id}/end`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': await this.api.getToken()
      }
    });
    
    const data = await response.json();
    console.log('Stop tracking response:', data);
    
    if (data.success) {
      this.isTracking = false;
      const sessionSummary = data.session;
      this.session = null;
      
      return {
        success: true,
        sessionSummary
      };
    }
    
    throw new Error(data.message || 'Failed to stop tracking');
  } catch (error) {
    console.error('Stop tracking error details:', error);
    // Even if there's an error, clean up local tracking state
    this.isTracking = false;
    this.session = null;
    
    return {
      success: false,
      error: error.message || 'Server error'
    };
  }
}

  async trackActivity(activityType, data = {}) {
    try {
      if (!this.session || !this.isTracking) {
        throw new Error('No active tracking session');
      }
      
      // Call API to log activity
      const response = await fetch(`${this.api.baseUrl}/engagement/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': await this.api.getToken()
        },
        body: JSON.stringify({
          sessionId: this.session._id,
          type: activityType,
          data: data
        })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Track activity error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async processWebcamData(imageData) {
    try {
      if (!this.session || !this.isTracking) {
        throw new Error('No active tracking session');
      }
      
      // Call API to process webcam data
      const response = await fetch(`${this.api.baseUrl}/engagement/webcam`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': await this.api.getToken()
        },
        body: JSON.stringify({
          sessionId: this.session._id,
          imageData: imageData
        })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Process webcam data error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// From intervention.js
class InterventionManager {
  constructor(api, engagementTracker) {
    this.api = api;
    this.engagementTracker = engagementTracker;
    this.checkInterval = null;
    this.sessionId = null;
  }

  startChecking(sessionId) {
    this.sessionId = sessionId;
    
    // Check for interventions every 30 seconds
    this.checkInterval = setInterval(() => {
      this.checkForIntervention();
    }, 30000);
  }

  stopChecking() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.sessionId = null;
  }

  async checkForIntervention() {
    if (!this.sessionId) return;
    
    try {
      const response = await fetch(`${this.api.baseUrl}/extension/intervention/${this.sessionId}`, {
        headers: {
          'token': await this.api.getToken()
        }
      });
      
      const data = await response.json();
      
      if (data.success && data.intervention) {
        this.showIntervention(data.intervention);
      }
    } catch (error) {
      console.error('Error checking for intervention:', error);
    }
  }

  showIntervention(intervention) {
    // Send message to content script to show intervention
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs && tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'SHOW_INTERVENTION',
          intervention: intervention
        });
      }
    });
  }

  async recordResponse(interventionId, response) {
    try {
      await fetch(`${this.api.baseUrl}/intervention/${interventionId}/response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': await this.api.getToken()
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          response: response
        })
      });
    } catch (error) {
      console.error('Error recording intervention response:', error);
    }
  }
}

// Create instances
const api = new EngagementAPI();
const auth = new AuthManager(api);
const engagementTracker = new EngagementTracker(api);
const interventionManager = new InterventionManager(api, engagementTracker);

// Background script logic
let activeSession = null;
let apiUrl = 'http://localhost:5000/api';
let isAuthenticated = false;
let userId = null;

// Initialize API
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Learning Engagement Tracker installed');
  
  // Check authentication on startup
  try {
    isAuthenticated = await auth.checkAuthStatus();
    if (isAuthenticated) {
      const user = await auth.getUser();
      userId = user._id;
    }
  } catch (error) {
    console.error('Auth check failed:', error);
  }
});

// Message handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender)
    .then(sendResponse)
    .catch(error => {
      console.error('Error handling message:', error);
      sendResponse({ success: false, error: error.message });
    });
  return true; // Keep the message channel open for async response
});

// Handle tab changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  if (activeSession) {
    // Update session with new tab information
    try {
      const tab = await chrome.tabs.get(activeInfo.tabId);
      
      // Track URL change activity
      await engagementTracker.trackActivity('url_change', {
        url: tab.url,
        title: tab.title
      });
    } catch (error) {
      console.error('Error handling tab change:', error);
    }
  }
});

// Handle messages from content script or popup
async function handleMessage(message, sender) {
  console.log('Background received message:', message.type);
  
  switch (message.type) {
    case 'LOGIN':
      return await auth.login(message.email, message.password);
      
    case 'LOGOUT':
      await auth.logout();
      return { success: true };
      
    case 'GET_USER_PREFERENCES':
      return await api.getUserPreferences();
      
    case 'GET_AUTH_TOKEN':
      const token = await api.getToken();
      return { token: token };

    case 'START_TRACKING':
      const result = await engagementTracker.startTracking(message.settings);
      if (result.success) {
        activeSession = {
          id: result.sessionId,
          startTime: Date.now()
        };
        // Start intervention checking
        interventionManager.startChecking(result.sessionId);
      }
      return result;
      
    case 'STOP_TRACKING':
      const stopResult = await engagementTracker.stopTracking();
      if (stopResult.success) {
        // Stop intervention checking
        interventionManager.stopChecking();
        activeSession = null;
      }
      return stopResult;
      
    case 'GET_TRACKING_STATUS':
      return { 
        isTracking: !!activeSession,
        sessionId: activeSession ? activeSession.id : null
      };
      
    case 'WEBCAM_DATA':
      await engagementTracker.processWebcamData(message.imageData);
      return { success: true };
      
    case 'TRACK_ACTIVITY':
      await engagementTracker.trackActivity(message.activityType, message.data);
      return { success: true };
      
    case 'INTERVENTION_RESPONSE':
      await interventionManager.recordResponse(
        message.interventionId, 
        message.response
      );
      return { success: true };
      
    default:
      throw new Error(`Unknown message type: ${message.type}`);
  }
}


// // Include all necessary classes and objects from other files

// // From api.js
// class EngagementAPI {

  
//   constructor() {
//     this.baseUrl = 'http://localhost:5000/api';
//     this.token = null;
//     this.aiServiceUrl = 'http://localhost:5000/api';
//   }

//   async setToken(token) {
//     this.token = token;
//     await chrome.storage.local.set({ auth_token: token });
//   }

//   async getToken() {
//     try {
//       const data = await chrome.storage.local.get('auth_token');
//       this.token = data.auth_token || null;
//       return this.token;
//     } catch (error) {
//       console.error('Error getting token:', error);
//       return null;
//     }
//   }

//   async clearToken() {
//     this.token = null;
//     await chrome.storage.local.remove('auth_token');
//   }

//   async login(email, password) {
//     try {
//       const response = await fetch(`${this.baseUrl}/auth/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ email, password })
//       });

//       const data = await response.json();

//       if (data.success && data.token) {
//         await this.setToken(data.token);
//         return data.user;
//       }
      
//       throw new Error(data.message || 'Login failed');
//     } catch (error) {
//       console.error('API login error:', error);
//       throw error;
//     }
//   }

//   async getUserProfile() {
//     try {
//       const token = await this.getToken();
      
//       if (!token) {
//         throw new Error('Not authenticated');
//       }
      
//       const response = await fetch(`${this.baseUrl}/auth/profile`, {
//         headers: {
//           'token': token
//         }
//       });
      
//       const data = await response.json();
      
//       if (data.success) {
//         return data.user;
//       }
      
//       throw new Error(data.message || 'Failed to get user profile');
//     } catch (error) {
//       console.error('Error getting profile:', error);
//       throw error;
//     }
//   }

//   async getUserPreferences() {
//     try {
//       const user = await this.getUserProfile();
//       return user ? user.preferences : null;
//     } catch (error) {
//       console.error('Error getting preferences:', error);
//       throw error;
//     }
//   }

//   // Add any other API methods you have in api.js
// }

// // From auth.js
// class AuthManager {
//   constructor(api) {
//     this.api = api;
//     this.user = null;
//   }

//   async checkAuthStatus() {
//     try {
//       const token = await this.api.getToken();
      
//       if (!token) {
//         return false;
//       }
      
//       // Verify token by getting user profile
//       const user = await this.api.getUserProfile();
//       this.user = user;
      
//       return true;
//     } catch (error) {
//       console.error('Auth check failed:', error);
//       // Invalid token, clear it
//       this.api.clearToken();
//       return false;
//     }
//   }

//   async login(email, password) {
//     try {
//       this.user = await this.api.login(email, password);
//       return !!this.user;
//     } catch (error) {
//       console.error('Login failed:', error);
//       return false;
//     }
//   }

//   async logout() {
//     await this.api.clearToken();
//     this.user = null;
//   }

//   async getUser() {
//     if (!this.user) {
//       try {
//         if (await this.checkAuthStatus()) {
//           return this.user;
//         }
//         return null;
//       } catch (error) {
//         console.error('Failed to get user:', error);
//         return null;
//       }
//     }
//     return this.user;
//   }
// }

// class AudioEngagement {
//   constructor(api) {
//     this.api = api;
//     this.isRecording = false;
//     this.session = null;
//     // Rest of your constructor
//   }

// // Add necessary methods here
// }
// // From engagement.js
// class EngagementTracker {
//   constructor(api) {
//     this.api = api;
//     this.session = null;
//     this.isTracking = false;
//     this.settings = {};
//   }

//   async startTracking(settings = {}) {
//     try {
//       // Get current tab info
//       const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
//       const currentTab = tabs[0];
      
//       if (!currentTab) {
//         throw new Error('No active tab found');
//       }
      
//       // Prepare session data
//       const sessionData = {
//         courseUrl: currentTab.url,
//         courseName: currentTab.title,
//         platform: new URL(currentTab.url).hostname,
//         deviceInfo: {
//           browser: 'Chrome',
//           userAgent: navigator.userAgent
//         },
//         settings: settings
//       };
      
//       // Call API to start session
//       const response = await fetch(`${this.api.baseUrl}/sessions/start`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'token': await this.api.getToken()
//         },
//         body: JSON.stringify(sessionData)
//       });
      
//       const data = await response.json();
      
//       if (data.success) {
//         this.session = data.session;
//         this.isTracking = true;
//         this.settings = settings;
        
//         return {
//           success: true,
//           sessionId: this.session._id
//         };
//       }
      
//       throw new Error(data.message || 'Failed to start tracking');
//     } catch (error) {
//       console.error('Start tracking error:', error);
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   }

//   // Update the stopTracking method in EngagementTracker class

// async stopTracking() {
//   try {
//     if (!this.session || !this.isTracking) {
//       console.log('No active tracking session to stop');
//       return {
//         success: false,
//         error: 'No active tracking session'
//       };
//     }
    
//     console.log('Stopping session with ID:', this.session._id);
    
//     // Call API to end session
//     const response = await fetch(`${this.api.baseUrl}/sessions/${this.session._id}/end`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'token': await this.api.getToken()
//       }
//     });
    
//     const data = await response.json();
//     console.log('Stop tracking response:', data);
    
//     if (data.success) {
//       this.isTracking = false;
//       const sessionSummary = data.session;
//       this.session = null;
      
//       return {
//         success: true,
//         sessionSummary
//       };
//     }
    
//     throw new Error(data.message || 'Failed to stop tracking');
//   } catch (error) {
//     console.error('Stop tracking error details:', error);
//     // Even if there's an error, clean up local tracking state
//     this.isTracking = false;
//     this.session = null;
    
//     return {
//       success: false,
//       error: error.message || 'Server error'
//     };
//   }
// }

//   async trackActivity(activityType, data = {}) {
//     try {
//       if (!this.session || !this.isTracking) {
//         throw new Error('No active tracking session');
//       }
      
//       // Call API to log activity
//       const response = await fetch(`${this.api.baseUrl}/engagement/log`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'token': await this.api.getToken()
//         },
//         body: JSON.stringify({
//           sessionId: this.session._id,
//           type: activityType,
//           data: data
//         })
//       });
      
//       return await response.json();
//     } catch (error) {
//       console.error('Track activity error:', error);
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   }

//   async processWebcamData(imageData) {
//     try {
//       if (!this.session || !this.isTracking) {
//         throw new Error('No active tracking session');
//       }
      
//       // Call API to process webcam data
//       const response = await fetch(`${this.api.baseUrl}/engagement/webcam`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'token': await this.api.getToken()
//         },
//         body: JSON.stringify({
//           sessionId: this.session._id,
//           imageData: imageData
//         })
//       });
      
//       return await response.json();
//     } catch (error) {
//       console.error('Process webcam data error:', error);
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   }
// }

// // From intervention.js
// class InterventionManager {
//   constructor(api, engagementTracker) {
//     this.api = api;
//     this.engagementTracker = engagementTracker;
//     this.checkInterval = null;
//     this.sessionId = null;
//   }

//   startChecking(sessionId) {
//     this.sessionId = sessionId;
    
//     // Check for interventions every 30 seconds
//     this.checkInterval = setInterval(() => {
//       this.checkForIntervention();
//     }, 30000);
//   }

//   stopChecking() {
//     if (this.checkInterval) {
//       clearInterval(this.checkInterval);
//       this.checkInterval = null;
//     }
//     this.sessionId = null;
//   }

//   async checkForIntervention() {
//     if (!this.sessionId) return;
    
//     try {
//       const response = await fetch(`${this.api.baseUrl}/extension/intervention/${this.sessionId}`, {
//         headers: {
//           'token': await this.api.getToken()
//         }
//       });
      
//       const data = await response.json();
      
//       if (data.success && data.intervention) {
//         this.showIntervention(data.intervention);
//       }
//     } catch (error) {
//       console.error('Error checking for intervention:', error);
//     }
//   }

//   showIntervention(intervention) {
//     // Send message to content script to show intervention
//     chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
//       if (tabs && tabs[0]) {
//         chrome.tabs.sendMessage(tabs[0].id, {
//           type: 'SHOW_INTERVENTION',
//           intervention: intervention
//         });
//       }
//     });
//   }

//   async recordResponse(interventionId, response) {
//     try {
//       await fetch(`${this.api.baseUrl}/intervention/${interventionId}/response`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'token': await this.api.getToken()
//         },
//         body: JSON.stringify({
//           sessionId: this.sessionId,
//           response: response
//         })
//       });
//     } catch (error) {
//       console.error('Error recording intervention response:', error);
//     }
//   }
// }

// // Create instances
// const api = new EngagementAPI();
// const auth = new AuthManager(api);
// const engagementTracker = new EngagementTracker(api);
// const interventionManager = new InterventionManager(api, engagementTracker);

// // Background script logic
// let activeSession = null;
// let apiUrl = 'http://localhost:5000/api';
// let isAuthenticated = false;
// let userId = null;

// // Initialize API
// chrome.runtime.onInstalled.addListener(async () => {
//   console.log('Learning Engagement Tracker installed');
  
//   // Check authentication on startup
//   try {
//     isAuthenticated = await auth.checkAuthStatus();
//     if (isAuthenticated) {
//       const user = await auth.getUser();
//       userId = user._id;
//     }
//   } catch (error) {
//     console.error('Auth check failed:', error);
//   }
// });

// // Message handler
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   handleMessage(message, sender)
//     .then(sendResponse)
//     .catch(error => {
//       console.error('Error handling message:', error);
//       sendResponse({ success: false, error: error.message });
//     });
//   return true; // Keep the message channel open for async response
// });

// // Handle tab changes
// chrome.tabs.onActivated.addListener(async (activeInfo) => {
//   if (activeSession) {
//     // Update session with new tab information
//     try {
//       const tab = await chrome.tabs.get(activeInfo.tabId);
      
//       // Track URL change activity
//       await engagementTracker.trackActivity('url_change', {
//         url: tab.url,
//         title: tab.title
//       });
//     } catch (error) {
//       console.error('Error handling tab change:', error);
//     }
//   }
// });

// // Handle messages from content script or popup
// async function handleMessage(message, sender) {
//   console.log('Background received message:', message.type);
  
//   switch (message.type) {
//     case 'LOGIN':
//       return await auth.login(message.email, message.password);
      
//     case 'LOGOUT':
//       await auth.logout();
//       return { success: true };
      
//     case 'GET_USER_PREFERENCES':
//       return await api.getUserPreferences();
      
//     case 'GET_AUTH_TOKEN':
//       const token = await api.getToken();
//       return { token: token };

//     case 'START_TRACKING':
//       const result = await engagementTracker.startTracking(message.settings);
//       if (result.success) {
//         activeSession = {
//           id: result.sessionId,
//           startTime: Date.now()
//         };
//         // Start intervention checking
//         interventionManager.startChecking(result.sessionId);
//       }
//       return result;
      
//     case 'STOP_TRACKING':
//       const stopResult = await engagementTracker.stopTracking();
//       if (stopResult.success) {
//         // Stop intervention checking
//         interventionManager.stopChecking();
//         activeSession = null;
//       }
//       return stopResult;
      
//     case 'GET_TRACKING_STATUS':
//       return { 
//         isTracking: !!activeSession,
//         sessionId: activeSession ? activeSession.id : null
//       };
      
//     case 'WEBCAM_DATA':
//       await engagementTracker.processWebcamData(message.imageData);
//       return { success: true };
      
//     case 'TRACK_ACTIVITY':
//       await engagementTracker.trackActivity(message.activityType, message.data);
//       return { success: true };
      
//     case 'INTERVENTION_RESPONSE':
//       await interventionManager.recordResponse(
//         message.interventionId, 
//         message.response
//       );
//       return { success: true };

//     case 'LOG_AUDIO_ENGAGEMENT': 
//   try {
//     const { sessionId, data } = message;
//     if (!sessionId || !data) {
//       return { success: false, error: 'Missing sessionId or data' };
//     }
    
//     // Send to server
//     await api.logEngagementData(sessionId, {
//       type: 'audio',
//       timestamp: data.timestamp || Date.now(),
//       data: {
//         engagementScore: data.engagementScore || 0.5,
//         emotion: data.emotion || 'unknown',
//         audioLevel: data.audioLevel || 0
//       }
//     });
    
//     // Update local engagement score
//     if (data.engagementScore && activeSession && activeSession.id === sessionId) {
//       // Send update to content script
//       chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         if (tabs[0]) {
//           chrome.tabs.sendMessage(tabs[0].id, {
//             type: 'ENGAGEMENT_UPDATE',
//             data: {
//               source: 'audio',
//               score: data.engagementScore
//             }
//           }).catch(err => console.log('Tab not ready for message', err));
//         }
//       });
//     }
    
//     return { success: true };
//   } catch (error) {
//     console.error('Error handling audio engagement data:', error);
//     return { success: false, error: error.message };
//   }

//     default:
//       throw new Error(`Unknown message type: ${message.type}`);
//   }
// }
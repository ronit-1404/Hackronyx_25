// Global state
let activeSession = null;
let apiUrl = 'http://localhost:5000/api';
let isAuthenticated = false;
let userId = null;

// Initialize API
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Learning Engagement Tracker installed');
  
  // Load scripts (normally handled by bundler)
  // importScripts('scripts/api.js', 'scripts/auth.js', 'scripts/engagement.js', 'scripts/intervention.js');
  
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
  handleMessage(message, sender).then(sendResponse).catch(error => {
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
      
   // Update the STOP_TRACKING case in handleMessage function

    case 'STOP_TRACKING':
      try {
        // Add extra logging
        console.log('Processing STOP_TRACKING message');
        console.log('Current session state:', engagementTracker.session);
        
        const stopResult = await engagementTracker.stopTracking();
        
        // Always stop the intervention checker regardless of API success
        interventionManager.stopChecking();
        activeSession = null;
        
        // Store the cleared session state
        await chrome.storage.local.remove('activeSession');
        
        console.log('Stop tracking result:', stopResult);
        return stopResult;
      } catch (error) {
        console.error('Error in STOP_TRACKING handler:', error);
        // Clean up local state even if there's an error
        interventionManager.stopChecking();
        activeSession = null;
        await chrome.storage.local.remove('activeSession');
        
        return {
          success: false,
          error: error.message || 'Error stopping tracking'
        };
      }
      
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

// // Basic API and auth implementations
// const api = {
//   baseUrl: 'http://localhost:5000/api',
  
//   async getToken() {
//     try {
//       const data = await chrome.storage.local.get('auth_token');
//       return data.auth_token || null;
//     } catch (error) {
//       console.error('Error getting token:', error);
//       return null;
//     }
//   },
  
//   async getUserPreferences() {
//     try {
//       const token = await this.getToken();
//       if (!token) return { enableWebcam: false, enableAudio: false };
      
//       const response = await fetch(`${this.baseUrl}/users/preferences`, {
//         headers: { 'token': token }
//       });
//       const data = await response.json();
//       return data.preferences || { enableWebcam: false, enableAudio: false };
//     } catch (error) {
//       console.error('Error getting preferences:', error);
//       return { enableWebcam: false, enableAudio: false };
//     }
//   }
// };

// const auth = {
//   async checkAuthStatus() {
//     try {
//       const token = await api.getToken();
//       if (!token) return false;
      
//       return true; // Simplified for this fix
//     } catch (error) {
//       console.error('Auth check failed:', error);
//       return false;
//     }
//   },
  
//   async getUser() {
//     return { _id: 'temp-user-id' }; // Simplified for this fix
//   },
  
//   async login(email, password) {
//     // Simplified for this fix
//     return { success: true };
//   },
  
//   async logout() {
//     // Simplified for this fix
//     return { success: true };
//   }
// };

// const engagementTracker = {
//   session: null,
  
//   async startTracking(settings) {
//     console.log('Starting tracking with settings:', settings);
//     this.session = { _id: 'session-' + Date.now() };
//     return { 
//       success: true, 
//       sessionId: this.session._id 
//     };
//   },
  
//   async stopTracking() {
//     console.log('Stopping tracking');
//     const oldSession = this.session;
//     this.session = null;
//     return { 
//       success: true,
//       session: oldSession
//     };
//   },
  
//   async trackActivity(activityType, data) {
//     console.log('Tracking activity:', activityType, data);
//     return { success: true };
//   },
  
//   async processWebcamData(imageData) {
//     console.log('Processing webcam data');
//     return { success: true };
//   }
// };

// const interventionManager = {
//   checkInterval: null,
  
//   startChecking(sessionId) {
//     console.log('Starting intervention checks for session:', sessionId);
//     this.checkInterval = setInterval(() => {
//       console.log('Checking for interventions...');
//     }, 30000);
//   },
  
//   stopChecking() {
//     console.log('Stopping intervention checks');
//     if (this.checkInterval) {
//       clearInterval(this.checkInterval);
//       this.checkInterval = null;
//     }
//   },
  
//   async recordResponse(interventionId, response) {
//     console.log('Recording intervention response:', interventionId, response);
//     return { success: true };
//   }
// };

// // Global state
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
//   handleMessage(message, sender).then(sendResponse).catch(error => {
//     console.error('Error handling message:', error);
//     sendResponse({ success: false, error: error.message });
//   });
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
      
//     case 'START_TRACKING':
//       try {
//         const result = await engagementTracker.startTracking(message.settings);
//         if (result.success) {
//           activeSession = {
//             id: result.sessionId,
//             startTime: Date.now()
//           };
//           // Start intervention checking
//           interventionManager.startChecking(result.sessionId);
//         }
//         return result;
//       } catch (error) {
//         console.error('START_TRACKING error:', error);
//         return { success: false, error: error.message };
//       }
      
//     case 'STOP_TRACKING':
//       try {
//         // Add extra logging
//         console.log('Processing STOP_TRACKING message');
//         console.log('Current session state:', engagementTracker.session);
        
//         const stopResult = await engagementTracker.stopTracking();
        
//         // Always stop the intervention checker regardless of API success
//         interventionManager.stopChecking();
//         activeSession = null;
        
//         // Store the cleared session state
//         await chrome.storage.local.remove('activeSession');
        
//         console.log('Stop tracking result:', stopResult);
//         return stopResult;
//       } catch (error) {
//         console.error('Error in STOP_TRACKING handler:', error);
//         // Clean up local state even if there's an error
//         interventionManager.stopChecking();
//         activeSession = null;
//         await chrome.storage.local.remove('activeSession');
        
//         return {
//           success: false,
//           error: error.message || 'Error stopping tracking'
//         };
//       }
      
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
      
//     case 'AUDIO_PERMISSION_GRANTED':
//       console.log('Audio permission granted');
//       return { success: true };
      
//     case 'AUDIO_PERMISSION_DENIED':
//       console.log('Audio permission denied');
//       return { success: true };
      
//     case 'LOG_AUDIO_ENGAGEMENT':
//       console.log('Audio engagement data received:', message.data);
//       return { success: true };
      
//     default:
//       console.warn(`Unknown message type: ${message.type}`);
//       return { success: false, error: `Unknown message type: ${message.type}` };
//   }
// }
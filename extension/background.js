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
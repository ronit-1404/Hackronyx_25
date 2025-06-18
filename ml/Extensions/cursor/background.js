/**
 * Background Script for User Engagement Detector
 * 
 * This script runs in the extension's background context and manages:
 * - Communication between content scripts and popup
 * - Storage of engagement data
 * - Notifications for disengagement events
 */

// Debug mode
const DEBUG_MODE = true;

// Track engagement data across tabs
const engagementData = {};

function debugLog(...args) {
  if (DEBUG_MODE) {
    console.log('[Background]', ...args);
  }
}

// Initialize the background script
function init() {
  debugLog('Background script initialized at', new Date().toISOString());
  
  // Store some initial data to test popup
  engagementData['test'] = {
    score: 75,
    state: 'engaged',
    confidence: 'medium',
    factors: ['initial test data'],
    timestamp: Date.now()
  };
}

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  debugLog('Received message:', message);
  
  // Handle diagnostic ping messages
  if (message.type === 'DIAGNOSTIC_PING') {
    debugLog('Received diagnostic ping');
    sendResponse({
      type: 'DIAGNOSTIC_PONG',
      receivedAt: Date.now(),
      originalTimestamp: message.timestamp
    });
    return true;
  }
  
  // Handle content script loaded notification
  if (message.type === 'CONTENT_SCRIPT_LOADED') {
    debugLog(`Content script loaded in tab at ${message.url}`);
    return true;
  }
  
  // Handle messages from popup (no tab)
  if (!sender.tab && message.type === 'GET_ENGAGEMENT_DATA') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      
      if (!activeTab) {
        debugLog('No active tab found');
        sendResponse({
          type: 'ENGAGEMENT_DATA_RESPONSE',
          data: null,
          error: 'No active tab found'
        });
        return;
      }
      
      const tabId = activeTab.id;
      debugLog('Getting data for tab', tabId);
      
      if (engagementData[tabId]) {
        debugLog('Found data for tab', tabId, engagementData[tabId]);
        sendResponse({
          type: 'ENGAGEMENT_DATA_RESPONSE',
          data: engagementData[tabId]
        });
      } else {
        // Return test data if no real data exists yet
        debugLog('No data for tab', tabId, 'using test data');
        sendResponse({
          type: 'ENGAGEMENT_DATA_RESPONSE',
          data: {
            score: 50,
            state: 'passive',
            confidence: 'low',
            factors: ['no real data yet'],
            timestamp: Date.now(),
            isTestData: true
          }
        });
      }
    });
    
    return true; // Keep the message channel open for async response
  }
  
  // Messages from content scripts (with tab)
  if (sender.tab) {
    const tabId = sender.tab.id;
    
    switch (message.type) {
      case 'ENGAGEMENT_UPDATE':
        // Store the latest engagement data for this tab
        engagementData[tabId] = {
          ...message.data,
          url: sender.tab.url,
          title: sender.tab.title,
          tabId: tabId
        };
        
        debugLog('Updated engagement data for tab', tabId, engagementData[tabId]);
        
        // Send update to popup if it's open and requesting this tab's data
        chrome.runtime.sendMessage({
          type: 'ENGAGEMENT_DATA_UPDATE',
          data: engagementData[tabId]
        }).catch(err => {
          // Suppress errors from sending to non-existent popup
          debugLog('Could not send update to popup (probably closed)', err);
        });
        
        break;
        
      case 'ENGAGEMENT_ALERT':
        // Handle alerts like disengagement
        handleEngagementAlert(message, tabId);
        break;
    }
  }
  
  // Return true to indicate we might respond asynchronously
  return true;
});

function handleEngagementAlert(alert, tabId) {
  // Get tab info
  chrome.tabs.get(tabId, (tab) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }
    
    debugLog('Engagement alert for tab', tabId, alert);
    
    // Check alert level
    if (alert.level === 'disengagement') {
      // Could create a notification here
      debugLog(`Disengagement detected on tab "${tab.title}"`);
      
      // Store the alert
      if (!engagementData[tabId]) {
        engagementData[tabId] = { alerts: [] };
      } else if (!engagementData[tabId].alerts) {
        engagementData[tabId].alerts = [];
      }
      
      engagementData[tabId].alerts.push({
        ...alert,
        tabTitle: tab.title,
        tabUrl: tab.url
      });
      
      // Notify popup if it's open
      chrome.runtime.sendMessage({
        type: 'ENGAGEMENT_ALERT_NOTIFICATION',
        alert: {
          ...alert,
          tabId: tabId,
          tabTitle: tab.title
        }
      }).catch(err => {
        // Suppress errors from sending to non-existent popup
        debugLog('Could not send alert to popup (probably closed)', err);
      });
    }
  });
}

// Handle tab removal to clean up data
chrome.tabs.onRemoved.addListener((tabId) => {
  if (engagementData[tabId]) {
    debugLog('Removing data for closed tab', tabId);
    delete engagementData[tabId];
  }
});

// Initialize
init();

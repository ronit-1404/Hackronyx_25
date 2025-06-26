// Background script for Audio Engagement Tracker

// Listen for installation events
chrome.runtime.onInstalled.addListener(function() {
  console.log('Audio Engagement Tracker installed');
  
  // Set default settings
  chrome.storage.sync.get(['audioEngagementSettings'], function(result) {
    if (!result.audioEngagementSettings) {
      chrome.storage.sync.set({
        audioEngagementSettings: {
          serverUrl: 'http://localhost:5002',
          updateInterval: 3,
          showNotifications: true
        }
      });
    }
  });
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'getSettings') {
    chrome.storage.sync.get(['audioEngagementSettings'], function(result) {
      sendResponse(result.audioEngagementSettings || {
        serverUrl: 'http://localhost:5002',
        updateInterval: 3,
        showNotifications: true
      });
    });
    return true; // Keep the message channel open for asynchronous response
  }
});


chrome.storage.sync.set({
  audioEngagementSettings: {
    serverUrl: 'http://localhost:5002', // Updated to the correct port
    updateInterval: 3,
    showNotifications: true,
    sensitivity: 0.7
  }
});
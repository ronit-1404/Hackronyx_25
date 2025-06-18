/**
 * Popup Script for User Engagement Detector
 * 
 * Displays engagement metrics and cursor activity data
 */

// Debug mode
const DEBUG_MODE = true;

function debugLog(...args) {
  if (DEBUG_MODE) {
    console.log('[Popup]', ...args);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  debugLog('Popup opened');

  // Add retry button functionality
  const retryButton = document.createElement('button');
  retryButton.textContent = 'Retry';
  retryButton.style.cssText = 'margin-top: 10px; padding: 5px 10px; cursor: pointer;';
  retryButton.addEventListener('click', () => {
    debugLog('Retry button clicked');
    location.reload();
  });
  
  const noDataElement = document.getElementById('no-data');
  if (noDataElement) {
    noDataElement.appendChild(retryButton);
  }

  // Get the active tab to request its engagement data
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (chrome.runtime.lastError) {
      debugLog('Error querying tabs:', chrome.runtime.lastError);
      showNoData(`Error querying tabs: ${chrome.runtime.lastError.message}`);
      return;
    }
    
    const activeTab = tabs[0];
    
    if (!activeTab) {
      debugLog('No active tab found');
      showNoData('No active tab found');
      return;
    }
    
    debugLog('Active tab:', activeTab.id, activeTab.url);
    
    // Request engagement data for this tab
    try {
      chrome.runtime.sendMessage(
        {
          type: 'GET_ENGAGEMENT_DATA',
          tabId: activeTab.id
        },
        (response) => {
          if (chrome.runtime.lastError) {
            debugLog('Error retrieving data:', chrome.runtime.lastError);
            showNoData(`Error retrieving data: ${chrome.runtime.lastError.message}`);
            return;
          }
          
          debugLog('Response received:', response);
          
          // Check if we got data
          if (response && response.data) {
            if (response.data.isTestData) {
              debugLog('Showing test data');
              showTestDataWarning();
            }
            updateUI(response.data);
          } else if (response && response.error) {
            debugLog('Error in response:', response.error);
            showNoData(`Error: ${response.error}`);
          } else {
            debugLog('No data available for this tab');
            showNoData('No engagement data available for this tab');
          }
        }
      );
    } catch (error) {
      debugLog('Exception sending message:', error);
      showNoData(`Exception: ${error.message}`);
    }
  });
  
  // Listen for updates from background script
  chrome.runtime.onMessage.addListener((message) => {
    debugLog('Received message in popup:', message);
    if (message.type === 'ENGAGEMENT_DATA_UPDATE') {
      updateUI(message.data);
    }
  });
});

function showTestDataWarning() {
  const warningDiv = document.createElement('div');
  warningDiv.style.cssText = 'background-color: #fff3cd; color: #856404; padding: 8px; margin: 10px 0; border-radius: 4px; font-size: 12px;';
  warningDiv.textContent = 'Showing test data. Please navigate to a webpage with the extension active to collect real data.';
  
  const loadingElement = document.getElementById('loading');
  if (loadingElement && loadingElement.parentNode) {
    loadingElement.parentNode.insertBefore(warningDiv, loadingElement.nextSibling);
  }
}

function updateUI(data) {
  debugLog('Updating UI with data:', data);
  
  // Hide loading message
  const loadingElement = document.getElementById('loading');
  if (loadingElement) {
    loadingElement.style.display = 'none';
  }
  
  // Show data section
  const dataElement = document.getElementById('engagement-data');
  if (dataElement) {
    dataElement.style.display = 'block';
  }
  
  // Update engagement score and visuals
  const scoreElement = document.getElementById('engagement-score');
  const scoreValue = document.getElementById('score-value');
  const scoreNum = data.score || 0;
  
  if (scoreElement) scoreElement.textContent = `${scoreNum}/100`;
  if (scoreValue) scoreValue.style.width = `${scoreNum}%`;
  
  // Set color based on score
  if (scoreElement) {
    if (scoreNum >= 75) {
      scoreValue.style.backgroundColor = '#4caf50'; // Green for high
      scoreElement.className = 'engagement-high';
    } else if (scoreNum >= 40) {
      scoreValue.style.backgroundColor = '#ff9800'; // Orange for medium
      scoreElement.className = 'engagement-medium';
    } else {
      scoreValue.style.backgroundColor = '#f44336'; // Red for low
      scoreElement.className = 'engagement-low';
    }
  }
  
  // Update engagement state
  const stateElement = document.getElementById('engagement-state');
  if (stateElement) {
    stateElement.textContent = data.state || 'Unknown';
    
    // Apply styling based on state
    if (data.state === 'highly engaged' || data.state === 'engaged') {
      stateElement.className = 'engagement-high';
    } else if (data.state === 'passive') {
      stateElement.className = 'engagement-medium';
    } else {
      stateElement.className = 'engagement-low';
    }
  }
  
  // Update confidence level
  const confidenceElement = document.getElementById('confidence');
  if (confidenceElement) {
    confidenceElement.textContent = 
      (data.confidence || 'low').charAt(0).toUpperCase() + 
      (data.confidence || 'low').slice(1);
  }
  
  // Update factors list
  const factorsList = document.getElementById('factors-list');
  if (factorsList) {
    factorsList.innerHTML = '';
    
    if (data.factors && data.factors.length > 0) {
      data.factors.forEach(factor => {
        const li = document.createElement('li');
        li.textContent = factor;
        factorsList.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.textContent = 'No specific factors identified';
      factorsList.appendChild(li);
    }
  }
  
  // Update cursor metrics if available
  if (data.cursorData || data.cursor) {
    const cursorData = data.cursorData || data.cursor || {};
    const engagement = cursorData.engagement || {};
    
    // Activity level
    const activityElement = document.getElementById('activity-level');
    if (activityElement && engagement.activityLevel) {
      activityElement.textContent = engagement.activityLevel.charAt(0).toUpperCase() + 
        engagement.activityLevel.slice(1);
      
      // Style based on level
      if (engagement.activityLevel === 'high') {
        activityElement.className = 'engagement-high';
      } else if (engagement.activityLevel === 'medium') {
        activityElement.className = 'engagement-medium';
      } else {
        activityElement.className = 'engagement-low';
      }
    }
    
    // Focus quality
    const focusElement = document.getElementById('focus-quality');
    if (focusElement && engagement.focusQuality) {
      focusElement.textContent = engagement.focusQuality.charAt(0).toUpperCase() + 
        engagement.focusQuality.slice(1);
      
      // Style based on quality
      if (engagement.focusQuality === 'steady') {
        focusElement.className = 'engagement-high';
      } else if (engagement.focusQuality === 'normal') {
        focusElement.className = 'engagement-medium';
      } else {
        focusElement.className = 'engagement-low';
      }
    }
    
    // Attention state
    const attentionElement = document.getElementById('attention-state');
    if (attentionElement && engagement.attentionState) {
      attentionElement.textContent = engagement.attentionState.charAt(0).toUpperCase() + 
        engagement.attentionState.slice(1);
      
      // Style based on state
      if (engagement.attentionState === 'active') {
        attentionElement.className = 'engagement-high';
      } else if (engagement.attentionState === 'paused') {
        attentionElement.className = 'engagement-medium';
      } else {
        attentionElement.className = 'engagement-low';
      }
    }
  }
}

function showNoData(message) {
  debugLog('Showing no data message:', message);
  
  if (document.getElementById('loading')) {
    document.getElementById('loading').style.display = 'none';
  }
  
  const noDataElement = document.getElementById('no-data');
  if (noDataElement) {
    noDataElement.textContent = message || 'No engagement data available';
    noDataElement.style.display = 'block';
  }
}

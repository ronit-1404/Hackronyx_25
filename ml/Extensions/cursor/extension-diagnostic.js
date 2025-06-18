/**
 * Extension Diagnostic Tool
 * 
 * This script helps diagnose problems with the User Engagement Detector extension.
 * It verifies if components are working and communication is happening correctly.
 */

class ExtensionDiagnostic {
  constructor() {
    this.results = {
      contentScriptLoaded: false,
      cursorTrackerActive: false,
      backgroundScriptResponding: false,
      messagePassingWorking: false,
      storageAccessWorking: false,
      popupFunctioning: false,
      testResults: []
    };
    
    this.createUI();
  }
  
  createUI() {
    // Create diagnostic panel
    const panel = document.createElement('div');
    panel.id = 'extension-diagnostic-panel';
    panel.style.cssText = `
      position: fixed;
      top: 50px;
      left: 50px;
      width: 500px;
      max-height: 600px;
      overflow-y: auto;
      background-color: white;
      border: 2px solid #2196F3;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      padding: 20px;
      z-index: 999999;
      font-family: Arial, sans-serif;
    `;
    
    panel.innerHTML = `
      <h2 style="margin-top: 0;">User Engagement Detector - Diagnostics</h2>
      <p>This tool helps identify issues with the extension.</p>
      
      <div style="display: flex; gap: 10px; margin-bottom: 15px;">
        <button id="run-all-tests" style="padding: 8px 12px; background-color: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Run All Tests
        </button>
        <button id="check-content-script" style="padding: 8px 12px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Check Content Scripts
        </button>
        <button id="check-background" style="padding: 8px 12px; background-color: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Check Background
        </button>
        <button id="send-test-data" style="padding: 8px 12px; background-color: #9C27B0; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Send Test Data
        </button>
      </div>
      
      <div id="diagnostic-log" style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; height: 300px; overflow-y: auto; font-family: monospace; font-size: 12px; margin-bottom: 15px;">
        Diagnostic log will appear here...
      </div>
      
      <h3>Results:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Component</th>
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Status</th>
          </tr>
        </thead>
        <tbody id="results-table">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">Content Script</td>
            <td id="content-script-status" style="padding: 8px; border-bottom: 1px solid #eee;">Not checked</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">Cursor Tracker</td>
            <td id="cursor-tracker-status" style="padding: 8px; border-bottom: 1px solid #eee;">Not checked</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">Background Script</td>
            <td id="background-script-status" style="padding: 8px; border-bottom: 1px solid #eee;">Not checked</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">Message Passing</td>
            <td id="message-passing-status" style="padding: 8px; border-bottom: 1px solid #eee;">Not checked</td>
          </tr>
        </tbody>
      </table>
      
      <div style="margin-top: 15px; display: flex; justify-content: space-between;">
        <button id="close-diagnostic" style="padding: 8px 12px; background-color: #F44336; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Close
        </button>
        <button id="export-results" style="padding: 8px 12px; background-color: #607D8B; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Export Results
        </button>
      </div>
    `;
    
    document.body.appendChild(panel);
    
    // Make panel draggable
    this.makeDraggable(panel);
    
    // Add event listeners to buttons
    document.getElementById('run-all-tests').addEventListener('click', () => this.runAllTests());
    document.getElementById('check-content-script').addEventListener('click', () => this.checkContentScript());
    document.getElementById('check-background').addEventListener('click', () => this.checkBackgroundScript());
    document.getElementById('send-test-data').addEventListener('click', () => this.sendTestData());
    document.getElementById('close-diagnostic').addEventListener('click', () => this.closePanel());
    document.getElementById('export-results').addEventListener('click', () => this.exportResults());
  }
  
  makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    const header = element.querySelector('h2');
    if (header) {
      header.style.cursor = 'move';
      header.onmousedown = dragMouseDown;
    } else {
      element.onmousedown = dragMouseDown;
    }
    
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // Get the mouse cursor position
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // Calculate new position
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // Set element's new position
      element.style.top = (element.offsetTop - pos2) + "px";
      element.style.left = (element.offsetLeft - pos1) + "px";
    }
    
    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
  
  log(message, type = 'info') {
    const logElement = document.getElementById('diagnostic-log');
    if (!logElement) return;
    
    const timestamp = new Date().toLocaleTimeString();
    const typeClass = type === 'error' ? 'color: #F44336' : 
                      type === 'success' ? 'color: #4CAF50' : 
                      type === 'warning' ? 'color: #FF9800' : 'color: #2196F3';
    
    const logItem = document.createElement('div');
    logItem.innerHTML = `<span style="color: #888;">[${timestamp}]</span> <span style="${typeClass}">${message}</span>`;
    
    logElement.appendChild(logItem);
    logElement.scrollTop = logElement.scrollHeight;
    
    console.log(`[Diagnostic] ${message}`);
  }
  
  updateStatus(component, status, success) {
    const element = document.getElementById(`${component}-status`);
    if (!element) return;
    
    element.textContent = status;
    element.style.color = success ? '#4CAF50' : '#F44336';
    
    this.results[component] = success;
  }
  
  async runAllTests() {
    this.log('Running all diagnostic tests...', 'info');
    
    await this.checkContentScript();
    await this.checkCursorTracker();
    await this.checkBackgroundScript();
    await this.checkMessagePassing();
    
    this.log('All tests completed', 'info');
    
    // Overall assessment
    const allPassed = Object.values(this.results).every(result => result === true);
    if (allPassed) {
      this.log('✅ All tests passed! The extension appears to be working correctly.', 'success');
    } else {
      this.log('⚠️ Some tests failed. See the results table for details.', 'warning');
    }
  }
  
  async checkContentScript() {
    this.log('Checking if content script is loaded...', 'info');
    
    if (window.__testEngagementDetector) {
      this.log('✅ Content script is loaded and initialized!', 'success');
      this.updateStatus('content-script', '✅ Loaded and initialized', true);
      return true;
    } else {
      this.log('❌ Content script not found or not initialized correctly', 'error');
      this.updateStatus('content-script', '❌ Not loaded', false);
      return false;
    }
  }
  
  async checkCursorTracker() {
    this.log('Checking cursor tracker...', 'info');
    
    if (window.__cursorTrackerTest) {
      try {
        const stats = window.__cursorTrackerTest.getStats();
        this.log(`✅ Cursor tracker is active! Movements tracked: ${stats.movements.total}`, 'success');
        this.updateStatus('cursor-tracker', '✅ Active', true);
        return true;
      } catch (error) {
        this.log(`❌ Error getting cursor tracker stats: ${error.message}`, 'error');
        this.updateStatus('cursor-tracker', '❌ Error', false);
        return false;
      }
    } else {
      this.log('❌ Cursor tracker not found or not initialized', 'error');
      this.updateStatus('cursor-tracker', '❌ Not initialized', false);
      return false;
    }
  }
  
  async checkBackgroundScript() {
    this.log('Checking communication with background script...', 'info');
    
    try {
      const pingStart = Date.now();
      
      chrome.runtime.sendMessage(
        { type: 'DIAGNOSTIC_PING', timestamp: pingStart },
        response => {
          const pingTime = Date.now() - pingStart;
          
          if (chrome.runtime.lastError) {
            this.log(`❌ Error communicating with background script: ${chrome.runtime.lastError.message}`, 'error');
            this.updateStatus('background-script', '❌ Not responding', false);
            return false;
          }
          
          if (response && response.type === 'DIAGNOSTIC_PONG') {
            this.log(`✅ Background script responded in ${pingTime}ms!`, 'success');
            this.updateStatus('background-script', '✅ Responding', true);
            return true;
          } else {
            this.log('⚠️ Background script responded with unexpected format', 'warning');
            this.updateStatus('background-script', '⚠️ Unexpected response', false);
            return false;
          }
        }
      );
    } catch (error) {
      this.log(`❌ Exception when pinging background script: ${error.message}`, 'error');
      this.updateStatus('background-script', '❌ Communication error', false);
      return false;
    }
  }
  
  async checkMessagePassing() {
    this.log('Testing message passing between components...', 'info');
    
    if (!window.__testEngagementDetector) {
      this.log('❌ Cannot test message passing: content script not loaded', 'error');
      this.updateStatus('message-passing', '❌ Cannot test', false);
      return false;
    }
    
    try {
      const result = window.__testEngagementDetector.sendTestData();
      this.log(`Message sending attempt: ${result}`, result.includes('Error') ? 'error' : 'success');
      
      // We can't directly verify if the message was received, so we'll check if no error was thrown
      if (!result.includes('Error')) {
        this.log('✅ Message sent successfully', 'success');
        this.updateStatus('message-passing', '✅ Working', true);
        return true;
      } else {
        this.log('❌ Error sending message', 'error');
        this.updateStatus('message-passing', '❌ Failed', false);
        return false;
      }
    } catch (error) {
      this.log(`❌ Exception during message passing test: ${error.message}`, 'error');
      this.updateStatus('message-passing', '❌ Exception thrown', false);
      return false;
    }
  }
  
  sendTestData() {
    this.log('Sending test engagement data...', 'info');
    
    if (!window.__testEngagementDetector) {
      this.log('❌ Cannot send test data: content script not loaded', 'error');
      return;
    }
    
    try {
      const result = window.__testEngagementDetector.sendTestData();
      this.log(`Test data sending result: ${result}`, result.includes('Error') ? 'error' : 'success');
    } catch (error) {
      this.log(`❌ Exception while sending test data: ${error.message}`, 'error');
    }
  }
  
  closePanel() {
    const panel = document.getElementById('extension-diagnostic-panel');
    if (panel && panel.parentNode) {
      panel.parentNode.removeChild(panel);
    }
  }
  
  exportResults() {
    const logContent = document.getElementById('diagnostic-log').innerText;
    const resultsTable = document.getElementById('results-table').innerText;
    
    const exportData = `
      User Engagement Detector - Diagnostic Results
      ============================================
      Date: ${new Date().toLocaleString()}
      URL: ${window.location.href}
      
      TEST RESULTS:
      -------------
      ${Object.entries(this.results).map(([key, value]) => 
        `${key}: ${value ? 'PASSED' : 'FAILED'}`
      ).join('\n')}
      
      DIAGNOSTIC LOG:
      --------------
      ${logContent}
      
      COMPONENT STATUS:
      ----------------
      ${resultsTable}
    `;
    
    // Create a download link
    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'engagement-detector-diagnostics.txt';
    a.click();
    
    this.log('Exported diagnostic results', 'info');
  }
}

// Initialize diagnostics tool
window.extensionDiagnostic = new ExtensionDiagnostic();

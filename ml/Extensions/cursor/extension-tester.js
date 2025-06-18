/**
 * Extension Test Script
 * 
 * This script helps verify that the engagement detector extension
 * is working correctly by providing testing utilities and
 * generating cursor movements for automated testing.
 */

class ExtensionTester {
  constructor() {
    this.testResults = {};
    this.testLog = [];
    this.testStatus = 'idle';
    
    this.createTestUI();
  }
  
  createTestUI() {
    // Create test panel
    const panel = document.createElement('div');
    panel.id = 'extension-test-panel';
    panel.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      width: 300px;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      padding: 15px;
      z-index: 10000;
      font-family: Arial, sans-serif;
      color: #333;
    `;
    
    panel.innerHTML = `
      <h2 style="margin-top: 0; margin-bottom: 15px; font-size: 16px;">Extension Test Panel</h2>
      
      <div style="margin-bottom: 10px;">
        <button id="test-cursor-tracking" style="padding: 8px 12px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">
          Test Cursor Tracking
        </button>
        <button id="test-engagement-detection" style="padding: 8px 12px; background-color: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Test Engagement Detection
        </button>
      </div>
      
      <div style="margin-bottom: 10px;">
        <button id="test-idle-detection" style="padding: 8px 12px; background-color: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">
          Test Idle Detection
        </button>
        <button id="test-jitter-calculation" style="padding: 8px 12px; background-color: #9C27B0; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Test Jitter Calculation
        </button>
      </div>
      
      <div style="margin-bottom: 10px;">
        <button id="stop-all-tests" style="padding: 8px 12px; background-color: #F44336; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Stop All Tests
        </button>
      </div>
      
      <div style="margin-top: 15px;">
        <div style="font-weight: bold; margin-bottom: 5px;">Test Status: <span id="test-status">Idle</span></div>
        <div id="test-results" style="background-color: #f9f9f9; padding: 10px; border-radius: 4px; max-height: 150px; overflow-y: auto; font-size: 12px;">
          No tests run yet.
        </div>
      </div>
    `;
    
    document.body.appendChild(panel);
    
    // Add event listeners
    document.getElementById('test-cursor-tracking').addEventListener('click', () => this.testCursorTracking());
    document.getElementById('test-engagement-detection').addEventListener('click', () => this.testEngagementDetection());
    document.getElementById('test-idle-detection').addEventListener('click', () => this.testIdleDetection());
    document.getElementById('test-jitter-calculation').addEventListener('click', () => this.testJitterCalculation());
    document.getElementById('stop-all-tests').addEventListener('click', () => this.stopAllTests());
    
    // Make panel draggable
    this.makeDraggable(panel);
  }
  
  makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    element.onmousedown = dragMouseDown;
    
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // Get the mouse cursor position at startup
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // Call a function whenever the cursor moves
      document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // Calculate the new cursor position
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // Set the element's new position
      element.style.top = (element.offsetTop - pos2) + "px";
      element.style.left = (element.offsetLeft - pos1) + "px";
    }
    
    function closeDragElement() {
      // Stop moving when mouse button is released
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
  
  log(message) {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const logMessage = `[${timestamp}] ${message}`;
    this.testLog.push(logMessage);
    
    // Update UI
    const resultsElement = document.getElementById('test-results');
    if (resultsElement) {
      resultsElement.innerHTML = this.testLog.slice(-15).join('<br>');
      resultsElement.scrollTop = resultsElement.scrollHeight;
    }
    
    console.log(`[Extension Tester] ${message}`);
  }
  
  updateStatus(status) {
    this.testStatus = status;
    const statusElement = document.getElementById('test-status');
    if (statusElement) {
      statusElement.textContent = status;
      
      // Update color based on status
      if (status === 'Running') {
        statusElement.style.color = '#4CAF50';
      } else if (status === 'Failed') {
        statusElement.style.color = '#F44336';
      } else {
        statusElement.style.color = '#333';
      }
    }
  }
  
  async testCursorTracking() {
    this.updateStatus('Running');
    this.log('Starting cursor tracking test...');
    
    // Check if cursor tracker is initialized
    if (window.__cursorTrackerTest) {
      this.log('✅ Cursor tracker found and initialized');
      
      // Get stats
      const stats = window.__cursorTrackerTest.getStats();
      this.log(`Cursor tracker uptime: ${stats.uptime.seconds}s`);
      this.log(`Movement events: ${stats.movements.total}`);
      
      // Check if movements are being tracked
      const initialMovements = stats.movements.total;
      
      // Generate some cursor movements
      await this.simulateCursorMovements(10);
      
      // Check stats again
      const updatedStats = window.__cursorTrackerTest.getStats();
      
      if (updatedStats.movements.total > initialMovements) {
        this.log('✅ Cursor movements are being tracked');
      } else {
        this.log('❌ Cursor movements are NOT being tracked');
      }
      
      // Trigger test report
      this.log('Triggering test report...');
      const result = window.__cursorTrackerTest.triggerTestReport();
      this.log(`Report trigger result: ${result}`);
      
      this.updateStatus('Complete');
    } else {
      this.log('❌ Cursor tracker not found or not initialized');
      this.updateStatus('Failed');
    }
  }
  
  async testEngagementDetection() {
    this.updateStatus('Running');
    this.log('Starting engagement detection test...');
    
    // Check if engagement detector is initialized
    if (window.__testEngagementDetector) {
      this.log('✅ Engagement detector found and initialized');
      
      // Get status
      const status = window.__testEngagementDetector.getStatus();
      this.log(`Detector status: ${JSON.stringify(status)}`);
      
      if (status.cursorData) {
        this.log('✅ Cursor data is being collected');
      } else {
        this.log('⚠️ No cursor data collected yet');
      }
      
      // Toggle debug overlay
      const overlayResult = window.__testEngagementDetector.toggleDebugOverlay();
      this.log(`Debug overlay: ${overlayResult}`);
      
      // Generate some cursor movements for testing
      await this.simulateCursorMovements(20);
      
      // Wait for data to be processed
      this.log('Waiting for data processing...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check updated status
      const updatedStatus = window.__testEngagementDetector.getStatus();
      if (updatedStatus.cursorData) {
        this.log(`✅ Engagement data received: ${JSON.stringify(updatedStatus.cursorData.metrics)}`);
        this.updateStatus('Complete');
      } else {
        this.log('❌ No engagement data received after movements');
        this.updateStatus('Failed');
      }
    } else {
      this.log('❌ Engagement detector not found or not initialized');
      this.updateStatus('Failed');
    }
  }
  
  async testIdleDetection() {
    this.updateStatus('Running');
    this.log('Starting idle detection test...');
    this.log('Moving cursor...');
    
    // First move the cursor to ensure we're not idle
    await this.simulateCursorMovements(5);
    
    // Verify idle state is false
    if (window.__cursorTrackerTest) {
      const initialState = window.__cursorTrackerTest.getCurrentState();
      this.log(`Initial idle state: ${initialState.isIdle}`);
      
      if (!initialState.isIdle) {
        this.log('✅ Not idle after movement');
      } else {
        this.log('❌ Incorrectly marked as idle after movement');
      }
      
      // Now wait for idle threshold
      const idleThreshold = window.__cursorTrackerTest.getConfig().idleThreshold;
      this.log(`Waiting for idle threshold (${idleThreshold}ms + 1000ms buffer)...`);
      
      await new Promise(resolve => setTimeout(resolve, idleThreshold + 1000));
      
      // Check idle state
      const currentState = window.__cursorTrackerTest.getCurrentState();
      if (currentState.isIdle) {
        this.log('✅ Correctly marked as idle after threshold');
        this.log(`Idle duration: ${currentState.idleDuration}ms`);
        this.updateStatus('Complete');
      } else {
        this.log('❌ Not marked as idle after threshold');
        this.updateStatus('Failed');
      }
    } else {
      this.log('❌ Cursor tracker not found or not initialized');
      this.updateStatus('Failed');
    }
  }
  
  async testJitterCalculation() {
    this.updateStatus('Running');
    this.log('Starting jitter calculation test...');
    
    // Test with smooth movements first
    this.log('Simulating smooth movements...');
    
    // Create smooth, linear movements
    for (let i = 0; i < 10; i++) {
      const event = new MouseEvent('mousemove', {
        clientX: 100 + (i * 20),
        clientY: 200,
        bubbles: true
      });
      document.dispatchEvent(event);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // Trigger a report
    if (window.__cursorTrackerTest) {
      window.__cursorTrackerTest.triggerTestReport();
      
      // Wait for report
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get report with smooth movement jitter value
      const smoothData = window.__testEngagementDetector?.getStatus()?.cursorData;
      const smoothJitter = smoothData?.metrics?.jitter || 'unknown';
      this.log(`Smooth movement jitter score: ${smoothJitter}`);
      
      // Now test with erratic movements
      this.log('Simulating erratic movements...');
      
      // Create zig-zag erratic movements
      for (let i = 0; i < 15; i++) {
        const zigzag = i % 2 === 0;
        const event = new MouseEvent('mousemove', {
          clientX: 300 + (zigzag ? 50 : -50),
          clientY: 300 + (i * 10),
          bubbles: true
        });
        document.dispatchEvent(event);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // Trigger another report
      window.__cursorTrackerTest.triggerTestReport();
      
      // Wait for report
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get report with erratic movement jitter value
      const erraticData = window.__testEngagementDetector?.getStatus()?.cursorData;
      const erraticJitter = erraticData?.metrics?.jitter || 'unknown';
      this.log(`Erratic movement jitter score: ${erraticJitter}`);
      
      // Compare jitter values
      if (erraticJitter > smoothJitter) {
        this.log('✅ Jitter calculation correctly identified erratic movements');
        this.updateStatus('Complete');
      } else {
        this.log('❌ Jitter calculation failed to distinguish movement patterns');
        this.updateStatus('Failed');
      }
    } else {
      this.log('❌ Cursor tracker not found or not initialized');
      this.updateStatus('Failed');
    }
  }
  
  stopAllTests() {
    this.updateStatus('Stopped');
    this.log('All tests stopped');
    
    // Reset the test environment if needed
  }
  
  async simulateCursorMovements(count = 10, pattern = 'circle') {
    this.log(`Simulating ${count} cursor movements in ${pattern} pattern...`);
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const radius = 100;
    
    for (let i = 0; i < count; i++) {
      let x, y;
      
      if (pattern === 'circle') {
        // Generate points in a circle
        const angle = (i / count) * Math.PI * 2;
        x = centerX + Math.cos(angle) * radius;
        y = centerY + Math.sin(angle) * radius;
      } else if (pattern === 'zigzag') {
        // Generate zigzag pattern
        x = centerX + ((i % 2 === 0) ? 50 : -50);
        y = centerY + (i * 10);
      } else {
        // Random movements
        x = Math.random() * window.innerWidth;
        y = Math.random() * window.innerHeight;
      }
      
      // Create and dispatch mouse event
      const event = new MouseEvent('mousemove', {
        clientX: x,
        clientY: y,
        bubbles: true
      });
      
      document.dispatchEvent(event);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    this.log('Cursor movements completed');
  }
}

// Initialize the tester
window.extensionTester = new ExtensionTester();

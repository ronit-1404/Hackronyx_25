
document.addEventListener('DOMContentLoaded', async function() {
  // Get UI elements
  const startBtn = document.getElementById('startTracking');
  const stopBtn = document.getElementById('stopTracking');
  const webcamCheck = document.getElementById('webcam');
  const audioCheck = document.getElementById('audio');
  const interventionFreq = document.getElementById('interventionFreq');
  const loginBtn = document.getElementById('loginBtn');
  const loginSection = document.getElementById('loginSection');
  const trackingSection = document.getElementById('trackingSection');
  const statusIndicator = document.getElementById('statusIndicator');
  const engagementValue = document.getElementById('engagementValue');
  const engagementPercent = document.getElementById('engagementPercent');

  // Check if user is logged in
  const isLoggedIn = await auth.checkAuthStatus();
  
  if (isLoggedIn) {
    loginSection.style.display = 'none';
    trackingSection.style.display = 'block';
    loadUserPreferences();
  } else {
    loginSection.style.display = 'block';
    trackingSection.style.display = 'none';
  }

  // Check if we're currently tracking
  const trackingStatus = await chrome.runtime.sendMessage({ type: 'GET_TRACKING_STATUS' });
  
  if (trackingStatus && trackingStatus.isTracking) {
    updateUIForActiveTracking(trackingStatus.sessionId);
  }

  // Login handler
  loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
    
    try {
      const success = await auth.login(email, password);
      if (success) {
        loginSection.style.display = 'none';
        trackingSection.style.display = 'block';
        loadUserPreferences();
      } else {
        alert('Login failed. Check your credentials.');
      }
    } catch (error) {
      alert('Login error: ' + error.message);
    }
  });

  // Start tracking
  startBtn.addEventListener('click', async () => {
    const settings = {
      enableWebcam: webcamCheck.checked,
      enableAudio: audioCheck.checked,
      interventionFrequency: interventionFreq.value
    };
    
    try {
      const sessionInfo = await chrome.runtime.sendMessage({ 
        type: 'START_TRACKING', 
        settings 
      });
      
      if (sessionInfo && sessionInfo.success) {
        updateUIForActiveTracking(sessionInfo.sessionId);
      } else {
        alert('Could not start tracking. Please try again.');
      }
    } catch (error) {
      console.error('Error starting tracking:', error);
      alert('Error: ' + error.message);
    }
  });

  // Stop tracking
  stopBtn.addEventListener('click', async () => {
    try {
      const result = await chrome.runtime.sendMessage({ type: 'STOP_TRACKING' });
      
      if (result && result.success) {
        updateUIForInactiveTracking();
      } else {
        alert('Could not stop tracking. Please try again.');
      }
    } catch (error) {
      console.error('Error stopping tracking:', error);
      alert('Error: ' + error.message);
    }
  });

  // Update engagement display
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'ENGAGEMENT_UPDATE') {
      const score = message.data.score;
      const percent = Math.round(score * 100);
      
      engagementValue.style.width = `${percent}%`;
      engagementPercent.textContent = `${percent}%`;
      
      // Set color based on engagement level
      if (percent < 30) {
        engagementValue.style.backgroundColor = '#ff4d4d';
      } else if (percent < 70) {
        engagementValue.style.backgroundColor = '#ffcc00';
      } else {
        engagementValue.style.backgroundColor = '#4CAF50';
      }
    }
  });

  // Load user preferences
  async function loadUserPreferences() {
    try {
      const prefs = await chrome.runtime.sendMessage({ type: 'GET_USER_PREFERENCES' });
      
      if (prefs) {
        webcamCheck.checked = prefs.allowWebcam;
        audioCheck.checked = prefs.allowAudio;
        interventionFreq.value = prefs.interventionFrequency;
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  }

  // Update UI for active tracking
  function updateUIForActiveTracking(sessionId) {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    statusIndicator.textContent = 'Tracking active';
    statusIndicator.classList.remove('inactive');
    statusIndicator.classList.add('active');
    
    // Disable settings during active session
    webcamCheck.disabled = true;
    audioCheck.disabled = true;
    interventionFreq.disabled = true;
  }

  // Update UI for inactive tracking
  function updateUIForInactiveTracking() {
    startBtn.disabled = false;
    stopBtn.disabled = true;
    statusIndicator.textContent = 'Not tracking';
    statusIndicator.classList.remove('active');
    statusIndicator.classList.add('inactive');
    
    // Reset engagement display
    engagementValue.style.width = '0%';
    engagementPercent.textContent = '0%';
    
    // Enable settings
    webcamCheck.disabled = false;
    audioCheck.disabled = false;
    interventionFreq.disabled = false;
  }
});
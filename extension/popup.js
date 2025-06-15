// document.addEventListener('DOMContentLoaded', async function() {
//   // Get UI elements
//   const startBtn = document.getElementById('startTracking');
//   const stopBtn = document.getElementById('stopTracking');
//   const webcamCheck = document.getElementById('webcam');
//   const audioCheck = document.getElementById('audio');
//   const interventionFreq = document.getElementById('interventionFreq');
//   const loginBtn = document.getElementById('loginBtn');
//   const loginSection = document.getElementById('loginSection');
//   const trackingSection = document.getElementById('trackingSection');
//   const statusIndicator = document.getElementById('statusIndicator');
//   const engagementValue = document.getElementById('engagementValue');
//   const engagementPercent = document.getElementById('engagementPercent');
//   const dashboardBtn = document.getElementById('dashboardBtn'); // Add dashboard button reference

//   // Check if user is logged in
//   const isLoggedIn = await auth.checkAuthStatus();
  
//   if (isLoggedIn) {
//     loginSection.style.display = 'none';
//     trackingSection.style.display = 'block';
//     loadUserPreferences();
//   } else {
//     loginSection.style.display = 'block';
//     trackingSection.style.display = 'none';
//   }

//   // Check if we're currently tracking
//   const trackingStatus = await chrome.runtime.sendMessage({ type: 'GET_TRACKING_STATUS' });
  
//   if (trackingStatus && trackingStatus.isTracking) {
//     updateUIForActiveTracking(trackingStatus.sessionId);
//   }

//   // Dashboard button handler
//   dashboardBtn.addEventListener('click', function(e) {
//     e.preventDefault();
    
//     // Get the token and open dashboard with token
//     chrome.storage.local.get('auth_token', function(data) {
//       const token = data.auth_token || '';
//       const url = `http://localhost:5000/token-bridge?token=${encodeURIComponent(token)}`;
//       chrome.tabs.create({ url: url });
//     });
//   });

//   // Login handler
//   loginBtn.addEventListener('click', async () => {
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
    
//     if (!email || !password) {
//       alert('Please enter both email and password');
//       return;
//     }
    
//     try {
//       const success = await auth.login(email, password);
//       if (success) {
//         loginSection.style.display = 'none';
//         trackingSection.style.display = 'block';
//         loadUserPreferences();
//       } else {
//         alert('Login failed. Check your credentials.');
//       }
//     } catch (error) {
//       alert('Login error: ' + error.message);
//     }
//   });

//   // Start tracking
//   startBtn.addEventListener('click', async () => {
//     const settings = {
//       enableWebcam: webcamCheck.checked,
//       enableAudio: audioCheck.checked,
//       interventionFrequency: interventionFreq.value
//     };
    
//     try {
//       const sessionInfo = await chrome.runtime.sendMessage({ 
//         type: 'START_TRACKING', 
//         settings 
//       });
      
//       if (sessionInfo && sessionInfo.success) {
//         updateUIForActiveTracking(sessionInfo.sessionId);
//       } else {
//         alert('Could not start tracking. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error starting tracking:', error);
//       alert('Error: ' + error.message);
//     }
//   });

//   // Stop tracking
//   stopBtn.addEventListener('click', async () => {
//     try {
//       const result = await chrome.runtime.sendMessage({ type: 'STOP_TRACKING' });
      
//       if (result && result.success) {
//         updateUIForInactiveTracking();
//       } else {
//         alert('Could not stop tracking. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error stopping tracking:', error);
//       alert('Error: ' + error.message);
//     }
//   });

//   // Update engagement display
//   chrome.runtime.onMessage.addListener((message) => {
//     if (message.type === 'ENGAGEMENT_UPDATE') {
//       const score = message.data.score;
//       const percent = Math.round(score * 100);
      
//       engagementValue.style.width = `${percent}%`;
//       engagementPercent.textContent = `${percent}%`;
      
//       // Set color based on engagement level
//       if (percent < 30) {
//         engagementValue.style.backgroundColor = '#ff4d4d';
//       } else if (percent < 70) {
//         engagementValue.style.backgroundColor = '#ffcc00';
//       } else {
//         engagementValue.style.backgroundColor = '#4CAF50';
//       }
//     }
//   });

//   // Load user preferences
//   async function loadUserPreferences() {
//     try {
//       const prefs = await chrome.runtime.sendMessage({ type: 'GET_USER_PREFERENCES' });
      
//       if (prefs) {
//         webcamCheck.checked = prefs.allowWebcam;
//         audioCheck.checked = prefs.allowAudio;
//         interventionFreq.value = prefs.interventionFrequency;
//       }
//     } catch (error) {
//       console.error('Error loading preferences:', error);
//     }
//   }

//   // Update UI for active tracking
//   function updateUIForActiveTracking(sessionId) {
//     startBtn.disabled = true;
//     stopBtn.disabled = false;
//     statusIndicator.textContent = 'Tracking active';
//     statusIndicator.classList.remove('inactive');
//     statusIndicator.classList.add('active');
    
//     // Disable settings during active session
//     webcamCheck.disabled = true;
//     audioCheck.disabled = true;
//     interventionFreq.disabled = true;
//   }

//   // Update UI for inactive tracking
//   function updateUIForInactiveTracking() {
//     startBtn.disabled = false;
//     stopBtn.disabled = true;
//     statusIndicator.textContent = 'Not tracking';
//     statusIndicator.classList.remove('active');
//     statusIndicator.classList.add('inactive');
    
//     // Reset engagement display
//     engagementValue.style.width = '0%';
//     engagementPercent.textContent = '0%';
    
//     // Enable settings
//     webcamCheck.disabled = false;
//     audioCheck.disabled = false;
//     interventionFreq.disabled = false;
//   }
// });

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
  const dashboardBtn = document.getElementById('dashboardBtn');

  // Check if user is logged in
  let isLoggedIn = false;
  try {
    isLoggedIn = await auth.checkAuthStatus();
    console.log('User login status:', isLoggedIn);
  } catch (error) {
    console.error('Error checking auth status:', error);
  }
  
  if (isLoggedIn) {
    loginSection.style.display = 'none';
    trackingSection.style.display = 'block';
    loadUserPreferences();
  } else {
    loginSection.style.display = 'block';
    trackingSection.style.display = 'none';
  }

  // Check if we're currently tracking
  try {
    const trackingStatus = await chrome.runtime.sendMessage({ type: 'GET_TRACKING_STATUS' });
    
    if (trackingStatus && trackingStatus.isTracking) {
      updateUIForActiveTracking(trackingStatus.sessionId);
    }
  } catch (error) {
    console.error('Error checking tracking status:', error);
  }

  // Dashboard button handler
  dashboardBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Get the token and open dashboard with token
    chrome.storage.local.get('auth_token', function(data) {
      const token = data.auth_token || '';
      const url = `http://localhost:5000/token-bridge?token=${encodeURIComponent(token)}`;
      chrome.tabs.create({ url: url });
    });
  });

  // Login handler
  loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
    
    try {
      // Show loading indicator
      loginBtn.textContent = 'Logging in...';
      loginBtn.disabled = true;
      
      console.log('Attempting login with:', email);
      const success = await auth.login(email, password);
      console.log('Login result:', success);
      
      if (success) {
        console.log('Login successful');
        loginSection.style.display = 'none';
        trackingSection.style.display = 'block';
        loadUserPreferences();
      } else {
        console.error('Login failed - no success response');
        alert('Login failed. Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('Login error details:', error);
      alert(`Login error: ${error.message || 'Unknown error'}`);
    } finally {
      // Reset button
      loginBtn.textContent = 'Login';
      loginBtn.disabled = false;
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
      startBtn.disabled = true;
      startBtn.textContent = 'Starting...';
      
      const sessionInfo = await chrome.runtime.sendMessage({ 
        type: 'START_TRACKING', 
        settings 
      });
      
      console.log('Session start response:', sessionInfo);
      
      if (sessionInfo && sessionInfo.success) {
        updateUIForActiveTracking(sessionInfo.sessionId);
      } else {
        alert('Could not start tracking: ' + (sessionInfo?.error || 'Unknown error'));
        startBtn.disabled = false;
        startBtn.textContent = 'Start Tracking';
      }
    } catch (error) {
      console.error('Error starting tracking:', error);
      alert('Error: ' + error.message);
      startBtn.disabled = false;
      startBtn.textContent = 'Start Tracking';
    }
  });

  // Stop tracking
  stopBtn.addEventListener('click', async () => {
    try {
      stopBtn.disabled = true;
      stopBtn.textContent = 'Stopping...';
      
      const result = await chrome.runtime.sendMessage({ type: 'STOP_TRACKING' });
      
      if (result && result.success) {
        updateUIForInactiveTracking();
      } else {
        alert('Could not stop tracking: ' + (result?.error || 'Unknown error'));
        stopBtn.disabled = false;
        stopBtn.textContent = 'Stop Tracking';
      }
    } catch (error) {
      console.error('Error stopping tracking:', error);
      alert('Error: ' + error.message);
      stopBtn.disabled = false;
      stopBtn.textContent = 'Stop Tracking';
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
    stopBtn.textContent = 'Stop Tracking';
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
    startBtn.textContent = 'Start Tracking';
    stopBtn.disabled = true;
    stopBtn.textContent = 'Stop Tracking';
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
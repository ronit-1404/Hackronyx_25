// Popup script for Audio Engagement Tracker

// Default settings
let settings = {
  updateInterval: 3,
  showNotifications: true,
  sensitivity: 0.7 // New setting for audio sensitivity
};

// Engagement tracking data
let engagementData = {
  engaged: 0,
  partial: 0,
  notEngaged: 0,
  total: 0
};

let isRecording = false;
let audioContext = null;
let mediaStream = null;
let processor = null;
let recordingInterval = null;
let chart = null;

// DOM elements
const startButton = document.getElementById('start-btn');
const stopButton = document.getElementById('stop-btn');
const settingsButton = document.getElementById('settings-btn');
const saveSettingsButton = document.getElementById('save-settings');
const cancelSettingsButton = document.getElementById('cancel-settings');
const settingsPanel = document.getElementById('settings-panel');
const statusElement = document.getElementById('status');
const currentEngagementElement = document.getElementById('current-engagement');
const engagementIndicator = document.getElementById('engagement-indicator');
const engagedPercentage = document.getElementById('engaged-percentage');
const partialPercentage = document.getElementById('partial-percentage');
const notEngagedPercentage = document.getElementById('not-engaged-percentage');

// Load settings from storage
chrome.storage.sync.get(['audioEngagementSettings'], function(result) {
  if (result.audioEngagementSettings) {
    settings = result.audioEngagementSettings;
    document.getElementById('update-interval').value = settings.updateInterval;
    document.getElementById('sensitivity').value = settings.sensitivity || 0.7;
    document.getElementById('sensitivity-value').textContent = settings.sensitivity || 0.7;
    document.getElementById('notification-toggle').checked = settings.showNotifications;
  }
});

// Initialize chart
function initChart() {
  const ctx = document.getElementById('engagement-chart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Engaged', 'Partially Engaged', 'Not Engaged'],
      datasets: [{
        data: [0, 0, 0],
        backgroundColor: ['#2ecc71', '#f39c12', '#e74c3c'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          fontSize: 10
        }
      },
      animation: {
        duration: 500
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            const dataset = data.datasets[tooltipItem.datasetIndex];
            const total = dataset.data.reduce((prev, curr) => prev + curr, 0);
            const currentValue = dataset.data[tooltipItem.index];
            const percentage = Math.round((currentValue / total) * 100);
            return `${data.labels[tooltipItem.index]}: ${percentage}%`;
          }
        }
      }
    }
  });
}

// Update UI with engagement data
function updateEngagementDisplay(engagementStatus) {
  // Update current engagement display
  currentEngagementElement.textContent = engagementStatus;
  
  // Update indicator color
  engagementIndicator.className = 'indicator';
  if (engagementStatus === 'Engaged') {
    engagementIndicator.classList.add('engaged');
    engagementData.engaged++;
  } else if (engagementStatus === 'Not Fully Engaged') {
    engagementIndicator.classList.add('partial');
    engagementData.partial++;
  } else if (engagementStatus === 'Not Engaged') {
    engagementIndicator.classList.add('disengaged');
    engagementData.notEngaged++;
  } else {
    engagementIndicator.classList.add('neutral');
  }
  
  engagementData.total++;
  
  // Update percentages
  const engagedPct = engagementData.total ? Math.round((engagementData.engaged / engagementData.total) * 100) : 0;
  const partialPct = engagementData.total ? Math.round((engagementData.partial / engagementData.total) * 100) : 0;
  const notEngagedPct = engagementData.total ? Math.round((engagementData.notEngaged / engagementData.total) * 100) : 0;
  
  engagedPercentage.textContent = `${engagedPct}%`;
  partialPercentage.textContent = `${partialPct}%`;
  notEngagedPercentage.textContent = `${notEngagedPct}%`;
  
  // Update chart
  if (chart) {
    chart.data.datasets[0].data = [engagementData.engaged, engagementData.partial, engagementData.notEngaged];
    chart.update();
  }
  
  // Send notification if enabled
  if (settings.showNotifications && engagementStatus === 'Not Engaged' && 
      notEngagedPct > 50 && engagementData.total > 5) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'images/icon128.png',
      title: 'Engagement Alert',
      message: 'You appear to be disengaged. Try to focus!'
    });
  }
}

// Process audio directly in the browser
let emotionDetector = null;

async function processAudio(audioBlob) {
  try {
    // Initialize the detector if it doesn't exist
    if (!emotionDetector) {
      emotionDetector = new AudioEmotionDetector();
    }
    
    // Process the audio blob locally
    const result = await emotionDetector.processAudioBlob(audioBlob);
    
    console.log('Audio analysis result:', result);
    
    // Update the UI with the engagement result
    if (result && result.engagement) {
      updateEngagementDisplay(result.engagement);
    }
  } catch (error) {
    console.error('Error processing audio:', error);
    statusElement.textContent = 'Error: ' + error.message;
  }
}

// Start recording audio
async function startRecording() {
  try {
    // Reset data
    engagementData = { engaged: 0, partial: 0, notEngaged: 0, total: 0 };
    
    // Check if mediaDevices API is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      statusElement.textContent = 'API Not Supported';
      statusElement.classList.add('error');
      document.getElementById('help-link').style.display = 'block';
      throw new Error('Audio recording is not supported in this browser.');
    }
    
    // Request microphone access directly through the browser
    try {
      // First try to get permission status
      if (navigator.permissions && navigator.permissions.query) {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
        console.log('Current microphone permission status:', permissionStatus.state);
        
        // If already denied, show help proactively
        if (permissionStatus.state === 'denied') {
          document.getElementById('help-link').style.display = 'block';
          statusElement.textContent = 'Mic Access Required';
          statusElement.classList.add('error');
        }
      }      
      // Always attempt to get the media stream using our helper function
      mediaStream = await tryGetUserMedia();
      
      console.log("Microphone access granted successfully");
      document.getElementById('help-link').style.display = 'none'; // Hide help link when access is granted
      statusElement.classList.remove('error');
    } catch (err) {
      console.error("Microphone error:", err);
      
      // Format a user-friendly error message based on the error
      let errorMessage = 'Microphone access denied';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Microphone permission denied. Please click the help link below for instructions.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No microphone detected. Please connect a microphone and try again.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Microphone is already in use by another application.';
      } else {
        errorMessage = `Microphone error: ${err.name}`;
      }
        // Use the helper function to show a more prominent error
      showMicrophoneError(errorMessage);
      throw new Error(`${errorMessage}`);
    }
    
    audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(mediaStream);
    
    // Create processor node for capturing audio
    processor = audioContext.createScriptProcessor(4096, 1, 1);
    source.connect(processor);
    processor.connect(audioContext.destination);
    
    const chunks = [];
    
    processor.onaudioprocess = function(e) {
      const buffer = e.inputBuffer.getChannelData(0);
      chunks.push(new Float32Array(buffer));
    };
    
    // Update UI
    isRecording = true;
    statusElement.textContent = 'Recording';
    statusElement.classList.add('recording');
    startButton.disabled = true;
    stopButton.disabled = false;
    
    // Set up interval to send audio chunks
    recordingInterval = setInterval(() => {
      if (chunks.length > 0) {
        // Convert chunks to a single buffer
        let audioLength = 0;
        chunks.forEach(chunk => {
          audioLength += chunk.length;
        });
        
        const audioData = new Float32Array(audioLength);
        let offset = 0;
        chunks.forEach(chunk => {
          audioData.set(chunk, offset);
          offset += chunk.length;
        });
        
        // Clear chunks
        chunks.length = 0;
        
        // Convert to WAV
        const wavBuffer = float32ToWav(audioData, audioContext.sampleRate);
        const audioBlob = new Blob([wavBuffer], { type: 'audio/wav' });
        
        // Send to API
        processAudio(audioBlob);
      }
    }, settings.updateInterval * 1000);
    
  } catch (error) {
    console.error('Error starting recording:', error);
    statusElement.textContent = 'Error: ' + error.message;
  }
}

// Stop recording audio
function stopRecording() {
  if (recordingInterval) {
    clearInterval(recordingInterval);
    recordingInterval = null;
  }
  
  if (processor) {
    processor.disconnect();
    processor = null;
  }
  
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
  }
  
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
  
  isRecording = false;
  statusElement.textContent = 'Not Recording';
  statusElement.classList.remove('recording');
  startButton.disabled = false;
  stopButton.disabled = true;
}

// Convert Float32Array to WAV format
function float32ToWav(samples, sampleRate) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  
  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // RIFF chunk length
  view.setUint32(4, 36 + samples.length * 2, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (1 is PCM)
  view.setUint16(20, 1, true);
  // channel count
  view.setUint16(22, 1, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * 2, true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, 2, true);
  // bits per sample
  view.setUint16(34, 16, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, samples.length * 2, true);
  
  // write the PCM samples
  const volume = 1;
  let index = 44;
  for (let i = 0; i < samples.length; i++) {
    let sample = Math.max(-1, Math.min(1, samples[i]));
    sample = sample * volume * 0x7FFF;
    view.setInt16(index, sample, true);
    index += 2;
  }
  
  return buffer;
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the chart
  initChart();
  
  // By default, hide the help link until needed
  document.getElementById('help-link').style.display = 'none';
  
  // Check if permission was previously denied
  checkMicrophonePermission();
});

// Function to check microphone permission status
async function checkMicrophonePermission() {
  try {
    // Query the permission state
    const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
    
    // Handle different states
    if (permissionStatus.state === 'denied') {
      // Permission was denied previously
      console.log('Microphone permission was previously denied');
      document.getElementById('help-link').style.display = 'block';
      statusElement.textContent = 'Mic Permission Needed';
      statusElement.classList.add('error');
    } else if (permissionStatus.state === 'granted') {
      // Permission is already granted
      console.log('Microphone permission is granted');
      document.getElementById('help-link').style.display = 'none';
    }
    
    // Listen for changes to the permission state
    permissionStatus.onchange = function() {
      console.log('Permission state changed to:', this.state);
      if (this.state === 'granted') {
        document.getElementById('help-link').style.display = 'none';
        statusElement.classList.remove('error');
        statusElement.textContent = 'Not Recording';
      } else {
        document.getElementById('help-link').style.display = 'block';
      }
    };
  } catch (error) {
    console.error('Error checking microphone permission:', error);
    // If we can't check permissions API, we'll handle it during recording attempt
  }
}

// Helper function to try different methods of requesting microphone access
async function tryGetUserMedia() {
  // Try with standard constraints first
  try {
    return await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      } 
    });
  } catch (err) {
    console.log("First attempt failed, trying simpler constraints:", err);
    
    // Try with simpler constraints
    try {
      return await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err2) {
      console.log("Second attempt failed:", err2);
      throw err2; // Throw the error from the second attempt
    }
  }
}

// Function to show a more prominent microphone error message
function showMicrophoneError(message) {
  // Make status prominent
  statusElement.textContent = 'Mic Access Denied';
  statusElement.classList.add('error');
  
  // Show help link prominently
  document.getElementById('help-link').style.display = 'block';
  
  // Disable start button temporarily
  startButton.disabled = true;
  
  // Re-enable after 2 seconds to allow retrying
  setTimeout(() => {
    startButton.disabled = false;
  }, 2000);
  
  // Log detailed error to console
  console.error("Microphone error details:", message);
}

// Update sensitivity value display when slider changes
document.getElementById('sensitivity').addEventListener('input', function() {
  document.getElementById('sensitivity-value').textContent = this.value;
});

startButton.addEventListener('click', startRecording);
stopButton.addEventListener('click', stopRecording);

// Help button for permissions
const helpLink = document.getElementById('help-link');
helpLink.onclick = function(e) {
  e.preventDefault();
  window.open('permissions_help.html', '_blank', 'width=650,height=700');
};

settingsButton.addEventListener('click', function() {
  settingsPanel.classList.toggle('visible');
});

saveSettingsButton.addEventListener('click', function() {
  // Save settings
  settings.updateInterval = parseInt(document.getElementById('update-interval').value);
  settings.sensitivity = parseFloat(document.getElementById('sensitivity').value);
  settings.showNotifications = document.getElementById('notification-toggle').checked;
  
  // Update the emotion detector if it exists
  if (emotionDetector) {
    emotionDetector.featureThresholds.energy.high = 0.5 + (settings.sensitivity * 0.5);
    emotionDetector.featureThresholds.zeroCrossingRate.high = 0.4 + (settings.sensitivity * 0.4);
  }
  
  // Save to storage
  chrome.storage.sync.set({audioEngagementSettings: settings});
  
  settingsPanel.classList.remove('visible');
});

cancelSettingsButton.addEventListener('click', function() {
  // Reset form to saved settings
  document.getElementById('update-interval').value = settings.updateInterval;
  document.getElementById('sensitivity').value = settings.sensitivity || 0.7;
  document.getElementById('sensitivity-value').textContent = settings.sensitivity || 0.7;
  document.getElementById('notification-toggle').checked = settings.showNotifications;
  
  settingsPanel.classList.remove('visible');
});

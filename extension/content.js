console.log("Learning Engagement Tracker content script loaded");

class ContentTracker {
  constructor() {
    this.isTracking = false;
    this.sessionId = null;
    this.settings = null;
    this.throttleTimers = {};
    this.activityBatch = [];
    this.batchInterval = null;
    this.webcamPermission = false;
    this.videoElements = new Set();
    this.overlayInjected = false;
    
    this.setupMessageListener();
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('Content script received message:', message.type);
      
      switch (message.type) {
        case 'START_TRACKING':
          this.startTracking(message.sessionId, message.settings);
          sendResponse({ success: true });
          break;
          
        case 'STOP_TRACKING':
          this.stopTracking();
          sendResponse({ success: true });
          break;
          
        case 'CAPTURE_WEBCAM':
          this.captureWebcam();
          sendResponse({ success: true });
          break;
          
        case 'SHOW_INTERVENTION':
          this.showIntervention(message.intervention);
          sendResponse({ success: true });
          break;
          
        default:
          sendResponse({ success: false, message: 'Unknown message type' });
      }
      return true;
    });
  }

  startTracking(sessionId, settings) {
    if (this.isTracking) return;
    
    this.isTracking = true;
    this.sessionId = sessionId;
    this.settings = settings || {};
    
    console.log('Starting tracking with session:', sessionId);
    
    // Set up activity trackers
    this.setupActivityTrackers();
    
    // Set up video tracking
    this.setupVideoTracking();
    
    // Request webcam permission if needed
    if (this.settings.enableWebcam) {
      this.requestWebcamPermission();
    }
    
    // Start sending batched activity
    this.batchInterval = setInterval(() => this.sendActivityBatch(), 5000);
    
    // Track page load event
    this.recordActivity('page_load', { 
      url: window.location.href,
      title: document.title,
      referrer: document.referrer
    });
  }

  stopTracking() {
    if (!this.isTracking) return;
    
    console.log('Stopping tracking');
    
    // Remove all event listeners
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('keydown', this.handleKeydown);
    document.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('click', this.handleClick);
    
    // Stop video tracking
    this.videoElements.forEach(video => {
      video.removeEventListener('play', this.handleVideoPlay);
      video.removeEventListener('pause', this.handleVideoPause);
      video.removeEventListener('timeupdate', this.handleVideoTimeUpdate);
    });
    this.videoElements.clear();
    
    // Clear intervals
    if (this.batchInterval) {
      clearInterval(this.batchInterval);
      this.batchInterval = null;
    }
    
    // Send any remaining activity
    if (this.activityBatch.length > 0) {
      this.sendActivityBatch();
    }
    
    this.isTracking = false;
    this.sessionId = null;
    this.settings = null;
    this.webcamPermission = false;
  }

  setupActivityTrackers() {
    // Track mouse movements (throttled)
    this.handleMouseMove = this.throttle((e) => {
      this.recordActivity('mouse_move', { 
        x: e.clientX, 
        y: e.clientY,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
      });
    }, 500);
    
    // Track keyboard input (no specific keys, just the fact of typing)
    this.handleKeydown = (e) => {
      // Don't record actual keys for privacy
      this.recordActivity('keystroke', { 
        isSpecialKey: e.ctrlKey || e.altKey || e.metaKey,
        target: e.target.tagName.toLowerCase()
      });
    };
    
    // Track scrolling (throttled)
    this.handleScroll = this.throttle(() => {
      this.recordActivity('scroll', { 
        position: window.scrollY, 
        percent: this.calculateScrollPercentage(),
        viewportHeight: window.innerHeight,
        documentHeight: document.documentElement.scrollHeight
      });
    }, 500);
    
    // Track clicks
    this.handleClick = (e) => {
      this.recordActivity('click', { 
        x: e.clientX, 
        y: e.clientY,
        target: e.target.tagName.toLowerCase(),
        targetClass: e.target.className
      });
    };
    
    // Add event listeners
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('keydown', this.handleKeydown);
    document.addEventListener('scroll', this.handleScroll);
    document.addEventListener('click', this.handleClick);
  }

  setupVideoTracking() {
    // Track all video elements
    const videos = document.querySelectorAll('video');
    videos.forEach(video => this.trackVideo(video));
    
    // Watch for dynamically added videos
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.tagName === 'VIDEO') {
              this.trackVideo(node);
            } else if (node.querySelectorAll) {
              const videos = node.querySelectorAll('video');
              videos.forEach(video => this.trackVideo(video));
            }
          });
        }
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  trackVideo(video) {
    if (this.videoElements.has(video)) return;
    
    this.videoElements.add(video);
    
    // Track video events
    this.handleVideoPlay = () => {
      this.recordActivity('video_play', {
        currentTime: video.currentTime,
        duration: video.duration || 0
      });
    };
    
    this.handleVideoPause = () => {
      this.recordActivity('video_pause', {
        currentTime: video.currentTime,
        duration: video.duration || 0,
        percent: video.duration ? (video.currentTime / video.duration) * 100 : 0
      });
    };
    
    this.handleVideoTimeUpdate = this.throttle(() => {
      this.recordActivity('video_progress', {
        currentTime: video.currentTime,
        duration: video.duration || 0,
        percent: video.duration ? (video.currentTime / video.duration) * 100 : 0,
        playing: !video.paused
      });
    }, 5000); // Update every 5 seconds
    
    // Add listeners
    video.addEventListener('play', this.handleVideoPlay);
    video.addEventListener('pause', this.handleVideoPause);
    video.addEventListener('timeupdate', this.handleVideoTimeUpdate);
  }

  recordActivity(type, data) {
    if (!this.isTracking) return;
    
    this.activityBatch.push({
      type,
      data,
      timestamp: Date.now()
    });
  }

  async sendActivityBatch() {
    if (this.activityBatch.length === 0) return;
    
    const batch = [...this.activityBatch];
    this.activityBatch = [];
    
    try {
      await chrome.runtime.sendMessage({
        type: 'TRACK_ACTIVITY',
        activityType: 'batch',
        data: {
          activities: batch,
          url: window.location.href,
          title: document.title
        }
      });
    } catch (error) {
      console.error('Failed to send activity batch:', error);
      // Put activities back in batch to try again
      this.activityBatch = [...batch, ...this.activityBatch];
    }
  }

  async requestWebcamPermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // Stop immediately after permission
      this.webcamPermission = true;
    } catch (error) {
      console.error('Webcam permission denied:', error);
      this.webcamPermission = false;
    }
  }

  async captureWebcam() {
    if (!this.isTracking || !this.settings.enableWebcam || !this.webcamPermission) {
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Create video element to process webcam stream
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      // Wait for video to initialize
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Create canvas and capture frame
      const canvas = document.createElement('canvas');
      canvas.width = 320; // Reduced size for efficiency
      canvas.height = 240;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get base64 image data
      const imageData = canvas.toDataURL('image/jpeg', 0.7);
      
      // Stop stream
      stream.getTracks().forEach(track => track.stop());
      
      // Send to background script
      await chrome.runtime.sendMessage({
        type: 'WEBCAM_DATA',
        imageData: imageData
      });
    } catch (error) {
      console.error('Webcam capture error:', error);
    }
  }
  
  async showIntervention(intervention) {
    // First inject overlay if needed
    if (!this.overlayInjected) {
      await this.injectOverlay();
    }
    
    // Get overlay element
    const overlay = document.getElementById('engagement-overlay');
    if (!overlay) return;
    
    // Clear any existing content
    overlay.innerHTML = '';
    
    // Create intervention content
    const container = document.createElement('div');
    container.className = 'overlay-container';
    
    // Add header
    const header = document.createElement('div');
    header.className = 'overlay-header';
    const title = document.createElement('h3');
    title.textContent = intervention.content.title || 'Engagement Alert';
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'X';
    closeBtn.onclick = () => {
      overlay.style.display = 'none';
      this.sendInterventionResponse(intervention._id, { 
        accepted: false, 
        completed: false 
      });
    };
    header.appendChild(title);
    header.appendChild(closeBtn);
    container.appendChild(header);
    
    // Add content based on type
    const content = document.createElement('div');
    content.className = 'overlay-content';
    
    switch (intervention.type) {
      case 'break':
        content.innerHTML = `
          <p>${intervention.content.description}</p>
          <iframe width="100%" height="240" src="${intervention.content.resourceUrl}" 
            frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; 
            gyroscope; picture-in-picture" allowfullscreen></iframe>
          <button id="intervention-done">I'm Done</button>
        `;
        break;
        
      case 'quiz':
        content.innerHTML = `
          <p>${intervention.content.description}</p>
          <div class="quiz-container">
            ${this.generateQuizHTML(intervention.content.questions)}
          </div>
          <button id="intervention-submit">Submit Answers</button>
        `;
        break;
        
      case 'resource':
        content.innerHTML = `
          <p>${intervention.content.description}</p>
          <a href="${intervention.content.resourceUrl}" target="_blank" class="resource-link">
            Open Learning Resource
          </a>
          <button id="intervention-done">Mark as Done</button>
        `;
        break;
        
      default:
        content.innerHTML = `
          <p>${intervention.content.description}</p>
          <button id="intervention-done">Acknowledge</button>
        `;
    }
    
    container.appendChild(content);
    overlay.appendChild(container);
    
    // Show overlay
    overlay.style.display = 'flex';
    
    // Handle button clicks
    const doneBtn = document.getElementById('intervention-done');
    if (doneBtn) {
      doneBtn.onclick = () => {
        overlay.style.display = 'none';
        this.sendInterventionResponse(intervention._id, { 
          accepted: true, 
          completed: true 
        });
      };
    }
    
    const submitBtn = document.getElementById('intervention-submit');
    if (submitBtn) {
      submitBtn.onclick = () => {
        const responses = this.collectQuizResponses(intervention.content.questions);
        overlay.style.display = 'none';
        this.sendInterventionResponse(intervention._id, { 
          accepted: true, 
          completed: true,
          quizResponses: responses
        });
      };
    }
  }
  
  generateQuizHTML(questions) {
    if (!questions || !questions.length) return '<p>No questions available</p>';
    
    return questions.map((q, qIndex) => `
      <div class="quiz-question">
        <p class="question-text">${qIndex + 1}. ${q.question}</p>
        <div class="options">
          ${q.options.map((opt, oIndex) => `
            <label>
              <input type="radio" name="q${qIndex}" value="${oIndex}"> ${opt}
            </label>
          `).join('')}
        </div>
      </div>
    `).join('');
  }
  
  collectQuizResponses(questions) {
    const responses = [];
    
    questions.forEach((_, qIndex) => {
      const selected = document.querySelector(`input[name="q${qIndex}"]:checked`);
      responses.push({
        questionIndex: qIndex,
        selectedOption: selected ? parseInt(selected.value) : -1
      });
    });
    
    return responses;
  }
  
  async injectOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'engagement-overlay';
    overlay.style.display = 'none';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'none';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .overlay-container {
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        max-width: 500px;
        width: 90%;
        max-height: 80%;
        overflow-y: auto;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      }
      
      .overlay-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
        margin-bottom: 15px;
      }
      
      .overlay-header button {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        padding: 5px 10px;
      }
      
      .overlay-content {
        padding: 10px 0;
      }
      
      .quiz-question {
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px dotted #ccc;
      }
      
      .question-text {
        font-weight: bold;
        margin-bottom: 8px;
      }
      
      .options label {
        display: block;
        margin: 5px 0;
      }
      
      .resource-link {
        display: block;
        background-color: #f0f0f0;
        padding: 10px;
        margin: 10px 0;
        text-align: center;
        text-decoration: none;
        color: #2c3e50;
        font-weight: bold;
        border-radius: 4px;
      }
      
      #intervention-done, #intervention-submit {
        background-color: #4CAF50;
        color: white;
        padding: 10px 15px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        width: 100%;
        margin-top: 15px;
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(overlay);
    this.overlayInjected = true;
  }
  
  async sendInterventionResponse(interventionId, response) {
    try {
      await chrome.runtime.sendMessage({
        type: 'INTERVENTION_RESPONSE',
        interventionId,
        response: {
          ...response,
          timestamp: Date.now()
        }
      });
    } catch (error) {
      console.error('Failed to send intervention response:', error);
    }
  }

  // Utility functions
  calculateScrollPercentage() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    return scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
  }

  throttle(func, limit) {
    return (...args) => {
      const key = func.toString();
      if (!this.throttleTimers[key]) {
        func(...args);
        this.throttleTimers[key] = setTimeout(() => {
          this.throttleTimers[key] = null;
        }, limit);
      }
    };
  }
}

// Initialize content tracking
const tracker = new ContentTracker();
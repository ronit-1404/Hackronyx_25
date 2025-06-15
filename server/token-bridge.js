document.addEventListener('DOMContentLoaded', function() {
  const messageEl = document.getElementById('message');
  
  // Function to extract URL parameters
  function getParameterByName(name) {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
  
  // Get token from URL if present
  const token = getParameterByName('token');
  
  if (token) {
    // Store token in localStorage
    localStorage.setItem('auth_token', token);
    messageEl.textContent = 'Authentication successful! Redirecting to dashboard...';
    
    // Redirect to dashboard
    setTimeout(function() {
      window.location.href = '/dashboard';
    }, 1500);
  } else {
    // Request token from extension
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      messageEl.textContent = 'Requesting token from extension...';
      
      chrome.runtime.sendMessage({type: 'GET_AUTH_TOKEN'}, function(response) {
        if (response && response.token) {
          localStorage.setItem('auth_token', response.token);
          messageEl.textContent = 'Authentication successful! Redirecting to dashboard...';
          
          // Redirect to dashboard
          setTimeout(function() {
            window.location.href = '/dashboard';
          }, 1500);
        } else {
          messageEl.className = 'message error';
          messageEl.textContent = 'Authentication failed. Please log in through the extension.';
        }
      });
    } else {
      // If Chrome API isn't available, check localStorage directly
      const localToken = localStorage.getItem('auth_token');
      
      if (localToken) {
        messageEl.textContent = 'Using existing authentication. Redirecting to dashboard...';
        
        // Redirect to dashboard
        setTimeout(function() {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        messageEl.className = 'message error';
        messageEl.textContent = 'Authentication failed. Please log in through the extension.';
      }
    }
  }
});
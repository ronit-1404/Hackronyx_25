# Troubleshooting "Error retrieving data" in User Engagement Detector

If you're seeing the "Error retrieving data" message in the extension popup, here are several steps to diagnose and fix the issue:

## Quick Fixes

1. **Reload the extension**
   - Go to chrome://extensions or edge://extensions
   - Find the User Engagement Detector extension
   - Click the refresh/reload icon

2. **Reload the current tab**
   - The content scripts might not have loaded properly
   - Simply refresh the current webpage

3. **Check if you're on a supported page**
   - The extension can only track cursor movements on regular web pages
   - It won't work on special browser pages like chrome:// or edge:// URLs

## Run Diagnostics

We've included a diagnostic tool to help identify issues:

1. Open any regular web page (like google.com)
2. Open the browser console (F12 or right-click > Inspect > Console)
3. Paste and run this code:
   ```javascript
   fetch('https://raw.githubusercontent.com/your-repo/cursor/main/extension-diagnostic.js')
     .then(response => response.text())
     .then(code => {
       const script = document.createElement('script');
       script.textContent = code;
       document.head.appendChild(script);
     });
   ```
   Or load the extension-diagnostic.js file directly from your extension folder

4. The diagnostic panel will appear and help identify which components are working

## Common Issues and Solutions

### Content Script Not Loading

**Symptoms:**
- "Error retrieving data" in popup
- No cursor tracking on web pages

**Solutions:**
1. Check the extension permissions - make sure it has access to the websites you're visiting
2. Try reinstalling the extension
3. Check for errors in the console when loading a web page

### Background Script Communication Issues

**Symptoms:**
- Content script is loaded but data isn't being sent to popup

**Solutions:**
1. Check for errors in the background script (visit chrome://extensions, find your extension and click "background page" under "Inspect views")
2. Make sure message passing is working correctly
3. Verify the background script is storing data correctly

### Browser Compatibility Issues

**Symptoms:**
- Works in one browser but not another

**Solutions:**
1. Make sure you're using a supported browser (Chrome, Edge)
2. Check if any browser extensions might be interfering
3. Try disabling other extensions temporarily

## Manual Verification

You can manually verify if the extension components are working:

1. Open the browser console on any web page (F12)
2. Run these commands to check each component:

```javascript
// Check if content script is loaded
typeof window.__testEngagementDetector !== 'undefined'

// Check if cursor tracker is active
typeof window.__cursorTrackerTest !== 'undefined'

// Get cursor tracking statistics
window.__cursorTrackerTest?.getStats()

// Send test data manually
window.__testEngagementDetector?.sendTestData()
```

## Still Having Issues?

If you're still experiencing problems after trying these solutions:

1. Try the extension on a simple test page (like the included test-page.html)
2. Check for any console errors when using the extension
3. Verify that no other extensions are conflicting with this one
4. Consider reinstalling the extension from scratch

## Contact Support

If you continue to experience issues, please contact support with:
- Your browser name and version
- The diagnostic results (use the "Export Results" button in the diagnostic panel)
- Any error messages from the console
- Steps to reproduce the issue

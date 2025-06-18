# Testing the User Engagement Detector Extension

This guide will help you test your browser extension to verify that it's working correctly.

## Installing the Extension for Testing

1. Open Chrome or Edge browser
2. Navigate to:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
3. Enable "Developer mode" using the toggle in the top-right corner
4. Click "Load unpacked" and select your project folder (`c:\Users\OMEN-AYAN\Desktop\Model\cursor`)
5. The extension should now appear in your extensions list

## Running Basic Tests

### Method 1: Using the Test Page

1. Open the test page by:
   - Right-click the test-page.html file in your project folder and open with Chrome/Edge
   - Or drag and drop the file into your browser
   
2. The test page will show:
   - Extension status indicator (active/inactive)
   - Live cursor metrics (speed, idle time, jitter)
   - Visualization of cursor movements
   - Raw cursor data from the extension

3. Use the buttons on the test page:
   - **Check Extension**: Verifies if the extension is installed and active
   - **Run Automated Tests**: Performs basic functionality tests
   - **Load Extension Tester**: Loads the comprehensive testing tool

### Method 2: Using the Extension Tester

1. After clicking "Load Extension Tester" on the test page, you'll see a test panel appear
2. The test panel provides specialized tests for different functionality:
   - Test Cursor Tracking: Verifies basic cursor position tracking
   - Test Engagement Detection: Checks if engagement analysis works
   - Test Idle Detection: Validates idle time measurement
   - Test Jitter Calculation: Ensures jitter is measured correctly

## Testing Specific Features

### Testing Cursor Tracking

1. Move your mouse around the test page
2. Watch the visualization area to see if your movements are being tracked
3. Check if the speed, idle time, and jitter metrics update accordingly
4. The raw data section should show regular updates with cursor position information

### Testing Idle Detection

1. Move your cursor, then stop moving it completely
2. After 3 seconds, the idle time should start increasing
3. The "Test Idle Detection" button in the extension tester will verify this automatically

### Testing Jitter Calculation

1. Try different movement patterns:
   - Smooth, straight movements (should have low jitter)
   - Zigzag or erratic movements (should have high jitter)
2. Check if the jitter score changes appropriately
3. The "Test Jitter Calculation" button performs an automated test

### Testing Engagement Analysis

1. Open the browser console (F12 or right-click > Inspect > Console)
2. Look for log messages from "[Engagement Detector]"
3. Try different interaction patterns:
   - Active cursor movement (should show high engagement)
   - No movement for a while (should show disengagement)
   - Erratic movements (may show different focus quality)

## Testing Video Mode Engagement Logic

This extension features special logic for cursor behavior during video streaming, where steady or idle cursor is interpreted as a **positive** sign of engagement (unlike in regular browsing where it may indicate disengagement).

### Testing Video Detection

1. Go to a streaming site like YouTube, Netflix, or Vimeo
2. Start playing a video
3. Check the extension popup - it should detect "Video Playing: Yes"
4. The debug overlay (if enabled) should show "📹 Video playing"

### Testing Cursor Behavior During Video Playback

1. With a video playing, try the following cursor behaviors:
   - **Keep your cursor still/idle** during video playback - this should show *high engagement* in video mode
   - **Move cursor occasionally** over video controls - this should be recognized as normal interaction
   - **Move cursor constantly** outside the video area - this should show reduced engagement

2. Compare with behavior during regular browsing:
   - On a regular webpage (no video), keeping cursor still should indicate *disengagement*
   - Active cursor movement on regular pages should indicate *engagement*

### Testing Fullscreen Mode

1. Play a video and enter fullscreen mode
2. Keep cursor still/idle - engagement should be rated very high
3. Debug overlay should show "📹 Video playing" and "Fullscreen: Yes"
4. Cursor state during fullscreen should report "Good Engagement"

### Verifying Video Mode Logic

To verify that the special video logic is working correctly:

1. Enable the debug overlay
2. Open the browser console and run: `window.__testEngagementDetector.getStatus()`
3. When a video is playing, idle cursor should show:
   - Green status indicator for cursor state
   - "Good Engagement" for cursor state in video section
   - No disengagement alerts in the console (which would normally appear for idle cursor)

4. Test this on different streaming platforms to ensure consistent detection

## Troubleshooting

### Extension Not Detected

If the test page shows "Extension not detected":

1. Verify the extension is properly installed (check the extensions page)
2. Reload the test page
3. Check if there are any errors in the browser console (F12)
4. Make sure you've enabled the extension for all sites or specifically for your test page

### No Data Updates

If you see "No messages received recently":

1. Check for JavaScript errors in the console
2. Reload both the extension and the test page
3. Check if your cursor is being tracked when you move it

### Debug Mode

For more detailed insights:

1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Look for logs with prefixes like:
   - "[Cursor Tracker]" for cursor tracking module logs
   - "[Engagement Detector]" for engagement analysis logs

## Using the Debug Overlay

The extension includes a visual debug overlay that shows real-time metrics:

1. Open any webpage with the extension active
2. In the browser console, run: `window.__testEngagementDetector.toggleDebugOverlay()`
3. A small overlay will appear showing current cursor metrics
4. To hide it, run the same command again

## Next Steps

After verifying that your cursor tracking works correctly:

1. Implement and test the audio detection module
2. Implement and test the video detection module
3. Verify all three modules work together in the engagement detector

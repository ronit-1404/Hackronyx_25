# User Engagement Detector Browser Extension

This browser extension detects and analyzes user engagement while reading or watching content online by tracking various user interactions, including:

- **Cursor movements** (position, speed, idle time, jitter)
- **Audio detection** (speech activity, silence)
- **Video detection** (eye openness, facial cues)

## Features

### Cursor Tracking Module
- Tracks real-time cursor position (x, y coordinates)
- Calculates movement speed and patterns
- Detects idle time (when cursor stops for > 3 seconds)
- Measures jitter (shaky movement or rapid changes in direction)
- Reports metrics every 2 seconds via `postMessage`

### Video Playback Detection
- Identifies when videos are playing across various streaming platforms
- Detects fullscreen mode and video dimensions
- Provides specialized engagement assessment during video playback
- **Special Logic**: During video streaming, steady or idle cursor movement is interpreted as a GOOD sign of engagement (unlike regular browsing where it may indicate disengagement)

### Engagement Analysis
- Combines signals from cursor, audio, and video detection modules
- Calculates an overall engagement score (0-100)
- Context-aware interpretation: Adjusts engagement metrics based on content type
- Different scoring models for reading vs. video watching activities
- Categorizes engagement state (disengaged, passive, engaged, highly engaged)
- Identifies contributing factors to engagement level

## Project Structure

```
├── cursor-tracker.js        # Cursor tracking and metrics calculation
├── engagement-detector.js   # Integration of all detection modules
├── background.js            # Background service worker for the extension
├── popup.html               # User interface for the extension popup
├── popup.js                 # Logic for the extension popup
├── manifest.json            # Extension configuration
└── images/                  # Extension icons
```

## Integration

The project is structured to be easily integrated into a browser extension:

1. The cursor tracker sends data via `window.postMessage()` with type "CURSOR_DATA"
2. The engagement detector listens for messages and combines data from all sources
3. Analyzed engagement data is sent to the extension's background script
4. The popup UI displays the current engagement metrics

## Technical Details

### Cursor Metrics

- **Movement speed**: Distance traveled per second, indicates activity level
- **Idle time**: Duration when cursor doesn't move, indicates disengagement
- **Jitter score**: Measure of erratic movement, may indicate anxiety or distraction

### Engagement Indicators

- **Activity Level**: Low (possibly bored), Medium, High (focused or anxious)
- **Focus Quality**: Steady (calm, focused), Normal, Erratic (distracted or anxious)
- **Attention State**: Active, Paused, Inactive, Disengaged

## Installation for Development

1. Clone this repository
2. Open Chrome/Edge and navigate to `chrome://extensions` or `edge://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension directory
5. The extension will now be active on all web pages

## Future Improvements

- Add machine learning to better correlate engagement signals
- Implement user profiles to calibrate to individual browsing patterns
- Add heatmap visualization of cursor activity
- Support for mobile browser environments (touch events)

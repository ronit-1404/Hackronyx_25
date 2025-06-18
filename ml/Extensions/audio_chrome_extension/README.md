# Audio Engagement Tracker Chrome Extension

This Chrome extension tracks and analyzes engagement levels in real-time through audio analysis, without requiring an external API server.

## Features

- Real-time audio engagement tracking directly in the browser
- Visual engagement indicator and statistics
- Customizable settings (update interval, sensitivity, notifications)
- Self-contained with no external dependencies
- Privacy-focused: All processing happens locally

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top-right corner)
3. Click "Load unpacked" and select this folder

## Usage1. Click the Audio Engagement Tracker extension icon in Chrome
2. Click "Start Tracking" to begin monitoring
3. Grant microphone permissions when prompted
4. View real-time engagement status and statistics
5. Click "Stop Tracking" when finished

## Settings

You can access the settings panel to configure:
- Update interval in seconds (how often to analyze audio)
- Sensitivity slider (adjust the detection sensitivity)
- Notification preferences

## How It Works

The extension uses the Web Audio API to analyze audio from your microphone in real-time. It extracts features like energy, zero-crossing rate, and spectral variance to classify the audio into different emotional states:

- **Neutral** → Engaged
- **Confusion** → Not Fully Engaged
- **Boredom** → Not Engaged
- **Distress** → Not Engaged

## Privacy

All audio processing happens locally in your browser. Your audio is never sent to any server or external service.

## Troubleshooting

- If you encounter issues with microphone access:
  - Click on the "Microphone Permissions Help" link in the extension
  - Follow the instructions to grant the necessary permissions
- Make sure you are using Chrome version 80 or later
- If the extension crashes, try reloading it from the extensions page

## Technical Details

The extension:
1. Records audio from your microphone in short chunks
2. Processes the audio directly in the browser using JavaScript
3. Analyzes audio features to determine engagement level
4. Updates the UI with engagement predictions in real-time
5. Tracks statistics over your session

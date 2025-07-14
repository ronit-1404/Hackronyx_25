# Simple Content Generator Setup

## Quick Setup (3 Steps)

### Step 1: Install Python packages
```bash
pip install youtube-transcript-api requests
```

### Step 2: Configure API Key
1. Open `content_generator.py`
2. Find the line: `GEMINI_API_KEY = "your-gemini-api-key-here"`
3. Replace with your actual API key from: https://makersuite.google.com/app/apikey

### Step 3: Run the servers
1. **Start Python backend:**
   ```bash
   python content_generator.py
   ```
   Or double-click `run_server.bat`

2. **Start React frontend:**
   ```bash
   cd client
   npm run dev
   ```

## How to Use
1. Go to `/generator` page in your React app
2. Enter a YouTube URL (make sure video has captions)
3. Select output type: Summary, Quiz, or Flashcards
4. Click "Generate Content"
5. View the transcript and generated content

## Files Created
- `generator.jsx` - React frontend component
- `content_generator.py` - Python backend server (single file, uses Gemini REST API)
- `run_server.bat` - Helper script to start Python server

## URLs
- React App: http://localhost:5173 (or your Vite dev server port)
- Python API: http://localhost:8000
- Generator Page: Navigate to `/generator` in your React app

## Troubleshooting
- If you get import errors, run: `pip install youtube-transcript-api requests`
- If "No transcript available", try a different video with captions
- Make sure both servers are running on their respective ports
- Check that your Gemini API key is valid and has quota remaining

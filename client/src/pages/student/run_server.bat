@echo off
echo Starting Content Generator Server...
echo.
echo Make sure you have:
echo 1. Python installed
echo 2. Required packages: pip install youtube-transcript-api requests
echo 3. Updated the GEMINI_API_KEY in content_generator.py
echo.
echo Starting server at http://localhost:8000
echo.
python content_generator.py
pause

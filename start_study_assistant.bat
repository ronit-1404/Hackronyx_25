@echo off
echo Starting Study Assistant System...

:: Make sure we have the required Python libraries
pip install schedule

:: Start the backend processes (assuming these paths are correct)
echo Starting trigger system...
start /b python Hackronyx_25\trigger.py

echo Starting recommendation engine...
start /b python Hackronyx_25\ml\ML_Models\recc_engine\recommend.py

:: Wait briefly to let backend systems initialize
timeout /t 3 /nobreak > NUL

:: Start the popup client
echo Starting popup notification system...
start python popup_client.py

echo Study Assistant is now running! You can close this window.
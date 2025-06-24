#!/bin/bash
echo "Starting Study Assistant System..."

# Make sure we have the required Python libraries
pip3 install schedule

# Start the backend processes (update paths if needed)
echo "Starting trigger system..."
python3 trigger.py &

echo "Starting recommendation engine..."
python3 ml/ML_Models/recc_engine/recommend.py &

# Wait briefly to let backend systems initialize
sleep 3

# Start the popup client
echo "Starting popup notification system..."
python3 popup_client.py &

echo "Study Assistant is now running! You can close this window."
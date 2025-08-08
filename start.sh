#!/bin/bash
xhost +SI:localuser:root
# Kill existing robo-kiosk or chromium instances if running
pkill -f robo-kiosk
pkill -f chromium
pkill -f uvicorn


# Start FastAPI in background
echo "Starting FastAPI server..."
nohup uvicorn open_keyboard:app --host 0.0.0.0 --port 8000 > /dev/null 2>&1 &


# Wait a bit for the server to start
sleep 2
echo "FastAPI server started."
# Set DISPLAY if on Raspberry Pi desktop environment
export DISPLAY=:0
echo "Setting DISPLAY to $DISPLAY"
# Start Chromium in kiosk mode
nohup chromium-browser --kiosk https://erenyeager-dk.live \
  --use-fake-ui-for-media-stream \
  --noerrdialogs \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --autoplay-policy=no-user-gesture-required > /dev/null 2>&1 &
echo "Chromium started in kiosk mode."

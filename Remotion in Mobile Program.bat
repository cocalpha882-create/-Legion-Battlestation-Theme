@echo off
echo Starting Remotion Studio + ngrok tunnel...
start "Remotion Studio" powershell -NoExit -Command "cd 'C:\Users\LENOVO\OneDrive\Pictures\Documents\Claude Tools\Daily Video\remotion'; npm run studio"
start "ngrok Tunnel" powershell -NoExit -Command "ngrok http 3000"
echo Both windows opened.
echo Copy the https://....ngrok-free.dev URL from the ngrok window and open it on your phone.
pause
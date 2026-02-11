@echo off
REM Start the Fluent Accessibility Server

cd /d "%~dp0\src"
echo Starting Fluent Accessibility Server...
python server.py
pause

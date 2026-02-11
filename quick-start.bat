@echo off
REM Fluent Quick Start Script for Windows
REM This script starts the backend server and provides instructions for the frontend

echo ========================================
echo   Fluent Accessibility Quick Start
echo ========================================
echo.

REM Check if .env exists
if not exist "backend\.env" (
    echo [ERROR] backend\.env file not found!
    echo.
    echo Please create backend\.env with your Google API key:
    echo GOOGLE_API_KEY=your_api_key_here
    echo.
    echo Get your API key from: https://aistudio.google.com/app/apikey
    echo.
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.9-3.11 from https://www.python.org/
    echo.
    pause
    exit /b 1
)

echo [1/3] Starting Backend Server...
echo.
start "Fluent Backend" cmd /k "cd backend && python src\server.py"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

echo [2/3] Backend server started on http://127.0.0.1:8000
echo.
echo [3/3] To start the frontend:
echo   1. Open a new terminal
echo   2. Run: cd frontend
echo   3. Run: npm run electron-dev
echo.
echo OR just run: start-frontend.bat
echo.
echo ========================================
echo   Fluent is starting...
echo   Press Ctrl+C in backend window to stop
echo ========================================
echo.

REM Keep this window open
pause

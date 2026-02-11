@echo off
REM Fluent Initial Setup Script for Windows

echo ========================================
echo   Fluent Accessibility Setup
echo ========================================
echo.

REM Check Python
echo [1/5] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found!
    echo Please install Python 3.9-3.11 from https://www.python.org/
    pause
    exit /b 1
)
python --version
echo.

REM Check Node.js
echo [2/5] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found!
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)
node --version
npm --version
echo.

REM Install backend dependencies
echo [3/5] Installing backend dependencies...
cd backend
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..
echo Backend dependencies installed!
echo.

REM Install frontend dependencies
echo [4/5] Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..
echo Frontend dependencies installed!
echo.

REM Setup .env file
echo [5/5] Setting up environment variables...
if not exist "backend\.env" (
    echo.
    echo Creating .env file from template...
    copy backend\env.example backend\.env >nul 2>&1
    echo.
    echo Please enter your Google Gemini API key
    echo (Get it from: https://aistudio.google.com/app/apikey^)
    echo.
    set /p API_KEY="Enter your API key: "
    echo GOOGLE_API_KEY=%API_KEY% > backend\.env
    echo .env file created!
) else (
    echo .env file already exists, skipping...
)
echo.

echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo To start Fluent:
echo   1. Run: quick-start.bat (starts backend^)
echo   2. Run: start-frontend.bat (starts frontend^)
echo.
echo Or use: npm run electron-dev from frontend folder
echo.
pause

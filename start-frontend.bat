@echo off
REM Start Fluent Frontend (Electron App)

echo ========================================
echo   Fluent Frontend Launcher
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js 18+ from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "frontend\node_modules" (
    echo [WARNING] Dependencies not installed!
    echo Installing frontend dependencies...
    echo.
    cd frontend
    call npm install
    cd ..
    echo.
)

echo Starting Fluent Electron App...
echo.
cd frontend
npm run electron-dev

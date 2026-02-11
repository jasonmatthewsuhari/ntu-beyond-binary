@echo off
REM Build complete Fluent application with bundled backend

echo ========================================
echo   Fluent Complete Build Script
echo ========================================
echo.

echo [1/6] Checking Backend Dependencies...
echo.
cd backend
echo Installing Python dependencies (including PyInstaller)...
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install backend dependencies!
    pause
    exit /b 1
)
echo.

echo [2/6] Building Backend Executable...
echo.
python build_executable.py
if errorlevel 1 (
    echo [ERROR] Backend build failed!
    pause
    exit /b 1
)
cd ..
echo.

echo [3/6] Installing Frontend Dependencies...
echo.
cd frontend
call npm install
if errorlevel 1 (
    echo [ERROR] npm install failed!
    pause
    exit /b 1
)
echo.

echo [4/6] Building Next.js Production Bundle...
echo.
call npm run build
if errorlevel 1 (
    echo [ERROR] Next.js build failed!
    pause
    exit /b 1
)
echo.

echo [5/6] Packaging Electron Application...
echo.
call npm run electron-build
if errorlevel 1 (
    echo [ERROR] Electron build failed!
    pause
    exit /b 1
)
cd ..
echo.

echo [6/6] Build Complete!
echo.
echo ========================================
echo   Fluent has been built successfully!
echo ========================================
echo.
echo Your executable is located at:
echo   frontend\dist\Fluent-Setup-1.0.0.exe
echo.
echo This is a complete standalone installer that includes:
echo   - Electron frontend
echo   - Python backend server
echo   - All dependencies
echo.
echo Users just need to:
echo   1. Run the installer
echo   2. Configure their Google API key
echo   3. Start using Fluent!
echo.
pause

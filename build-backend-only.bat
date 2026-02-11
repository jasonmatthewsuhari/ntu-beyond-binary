@echo off
REM Build only the backend executable (faster for testing)

echo ========================================
echo   Fluent Backend Build Script
echo ========================================
echo.

echo Checking for running Python processes...
tasklist /FI "IMAGENAME eq python.exe" 2>NUL | find /I /N "python.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo.
    echo [WARNING] Python processes are currently running.
    echo Please close any Fluent backend servers before continuing.
    echo.
    pause
)

echo [1/2] Installing Backend Dependencies...
echo.
cd backend

REM Try with --user first to avoid permission issues
pip install -r requirements.txt --user --upgrade
if errorlevel 1 (
    echo [WARNING] Installation with --user failed, trying without...
    pip install -r requirements.txt --upgrade
    if errorlevel 1 (
        echo.
        echo [ERROR] Failed to install dependencies!
        echo.
        echo Try these fixes:
        echo   1. Close all Python/Electron apps
        echo   2. Run as Administrator
        echo   3. Manually run: pip install -r requirements.txt --user
        echo.
        pause
        exit /b 1
    )
)
echo.

echo [2/2] Building Backend Executable...
echo This may take 5-10 minutes...
echo.
python build_executable.py
if errorlevel 1 (
    echo [ERROR] Backend build failed!
    pause
    exit /b 1
)

cd ..
echo.
echo ========================================
echo   Backend Build Complete!
echo ========================================
echo.
echo Executable location: backend\dist\fluent-backend.exe
echo.
echo Next steps:
echo   1. Test the backend: backend\dist\fluent-backend.exe
echo   2. Build full app: build-all.bat
echo.
pause

#!/bin/bash
# Start Fluent Frontend (Electron App)

echo "========================================"
echo "  Fluent Frontend Launcher"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed or not in PATH"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    echo ""
    exit 1
fi

# Check if node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo "[WARNING] Dependencies not installed!"
    echo "Installing frontend dependencies..."
    echo ""
    cd frontend
    npm install
    cd ..
    echo ""
fi

echo "Starting Fluent Electron App..."
echo ""
cd frontend
npm run electron-dev

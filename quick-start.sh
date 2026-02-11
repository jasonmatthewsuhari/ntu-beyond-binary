#!/bin/bash
# Fluent Quick Start Script for macOS/Linux
# This script starts the backend server and provides instructions for the frontend

echo "========================================"
echo "  Fluent Accessibility Quick Start"
echo "========================================"
echo ""

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "[ERROR] backend/.env file not found!"
    echo ""
    echo "Please create backend/.env with your Google API key:"
    echo "GOOGLE_API_KEY=your_api_key_here"
    echo ""
    echo "Get your API key from: https://aistudio.google.com/app/apikey"
    echo ""
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python 3 is not installed or not in PATH"
    echo "Please install Python 3.9-3.11 from https://www.python.org/"
    echo ""
    exit 1
fi

echo "[1/3] Starting Backend Server..."
echo ""

# Start backend in background
cd backend
python3 src/server.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

echo "[2/3] Backend server started on http://127.0.0.1:8000 (PID: $BACKEND_PID)"
echo ""
echo "[3/3] To start the frontend:"
echo "  1. Open a new terminal"
echo "  2. Run: cd frontend"
echo "  3. Run: npm run electron-dev"
echo ""
echo "OR just run: ./start-frontend.sh"
echo ""
echo "========================================"
echo "  Fluent is running..."
echo "  Press Ctrl+C to stop backend server"
echo "========================================"
echo ""

# Wait for Ctrl+C
trap "echo ''; echo 'Stopping backend server...'; kill $BACKEND_PID; exit 0" INT
wait $BACKEND_PID

#!/bin/bash
# Fluent Initial Setup Script for macOS/Linux

echo "========================================"
echo "  Fluent Accessibility Setup"
echo "========================================"
echo ""

# Check Python
echo "[1/5] Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python 3 not found!"
    echo "Please install Python 3.9-3.11 from https://www.python.org/"
    exit 1
fi
python3 --version
echo ""

# Check Node.js
echo "[2/5] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js not found!"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi
node --version
npm --version
echo ""

# Install backend dependencies
echo "[3/5] Installing backend dependencies..."
cd backend
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install backend dependencies"
    exit 1
fi
cd ..
echo "Backend dependencies installed!"
echo ""

# Install frontend dependencies
echo "[4/5] Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install frontend dependencies"
    exit 1
fi
cd ..
echo "Frontend dependencies installed!"
echo ""

# Setup .env file
echo "[5/5] Setting up environment variables..."
if [ ! -f "backend/.env" ]; then
    echo ""
    echo "Creating .env file from template..."
    cp backend/env.example backend/.env 2>/dev/null || true
    echo ""
    echo "Please enter your Google Gemini API key"
    echo "(Get it from: https://aistudio.google.com/app/apikey)"
    echo ""
    read -p "Enter your API key: " API_KEY
    echo "GOOGLE_API_KEY=$API_KEY" > backend/.env
    echo ".env file created!"
else
    echo ".env file already exists, skipping..."
fi
echo ""

echo "========================================"
echo "  Setup Complete!"
echo "========================================"
echo ""
echo "To start Fluent:"
echo "  1. Run: ./quick-start.sh (starts backend)"
echo "  2. Run: ./start-frontend.sh (starts frontend)"
echo ""
echo "Or use: npm run electron-dev from frontend folder"
echo ""

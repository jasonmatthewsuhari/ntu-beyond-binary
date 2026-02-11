#!/bin/bash
# Build complete Fluent application with bundled backend

echo "========================================"
echo "  Fluent Complete Build Script"
echo "========================================"
echo ""

echo "[1/6] Checking Backend Dependencies..."
echo ""
cd backend
echo "Installing Python dependencies (including PyInstaller)..."
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install backend dependencies!"
    exit 1
fi
echo ""

echo "[2/6] Building Backend Executable..."
echo ""
python3 build_executable.py
if [ $? -ne 0 ]; then
    echo "[ERROR] Backend build failed!"
    exit 1
fi
cd ..
echo ""

echo "[3/6] Installing Frontend Dependencies..."
echo ""
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] npm install failed!"
    exit 1
fi
echo ""

echo "[4/6] Building Next.js Production Bundle..."
echo ""
npm run build
if [ $? -ne 0 ]; then
    echo "[ERROR] Next.js build failed!"
    exit 1
fi
echo ""

echo "[5/6] Packaging Electron Application..."
echo ""
npm run electron-build
if [ $? -ne 0 ]; then
    echo "[ERROR] Electron build failed!"
    exit 1
fi
cd ..
echo ""

echo "[6/6] Build Complete!"
echo ""
echo "========================================"
echo "  Fluent has been built successfully!"
echo "========================================"
echo ""
echo "Your executable is located at:"
if [ "$(uname)" == "Darwin" ]; then
    echo "  frontend/dist/Fluent-1.0.0.dmg"
else
    echo "  frontend/dist/Fluent-1.0.0.AppImage"
fi
echo ""
echo "This is a complete standalone package that includes:"
echo "  - Electron frontend"
echo "  - Python backend server"
echo "  - All dependencies"
echo ""
echo "Users just need to:"
echo "  1. Run the installer/app"
echo "  2. Configure their Google API key"
echo "  3. Start using Fluent!"
echo ""

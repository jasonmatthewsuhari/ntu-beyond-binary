# Fluent Quick Start Guide

Get Fluent up and running in **5 minutes**!

## TL;DR - Fastest Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/ntu-beyond-binary.git
cd ntu-beyond-binary

# 2. Run setup (installs all dependencies and configures environment)
# Windows:
setup.bat

# macOS/Linux:
chmod +x setup.sh && ./setup.sh

# 3. Start the app
# Windows:
start-frontend.bat

# macOS/Linux:
chmod +x start-frontend.sh && ./start-frontend.sh
```

Done! The Electron app will launch automatically.

## Step-by-Step Guide

### 1. Prerequisites

Install these first:

- **Python 3.9-3.11** (not 3.12!): https://www.python.org/
- **Node.js 18+**: https://nodejs.org/
- **Git**: https://git-scm.com/

### 2. Get a Google API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (you'll need it in step 4)

### 3. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/ntu-beyond-binary.git
cd ntu-beyond-binary

# Run the setup script
# This installs all dependencies and prompts for your API key

# Windows:
setup.bat

# macOS/Linux:
chmod +x setup.sh
./setup.sh
```

The setup script will:
- ✅ Verify Python and Node.js installations
- ✅ Install all backend Python packages
- ✅ Install all frontend npm packages
- ✅ Create `.env` file with your API key
- ✅ Configure the development environment

### 4. Start Fluent

**Option A: Automated (Recommended)**

```bash
# This starts both backend and opens Electron automatically

# Windows:
cd frontend
npm run electron-dev

# macOS/Linux:
cd frontend
npm run electron-dev
```

**Option B: Manual Control**

For more control over backend and frontend:

```bash
# Terminal 1 - Backend Server
# Windows:
quick-start.bat

# macOS/Linux:
chmod +x quick-start.sh
./quick-start.sh

# Terminal 2 - Frontend/Electron
# Windows:
start-frontend.bat

# macOS/Linux:
chmod +x start-frontend.sh
./start-frontend.sh
```

### 5. Verify It's Working

Once the Electron window opens:

1. You should see the Fluent dashboard
2. Bottom-right should show "Connected" (green indicator)
3. Click on any input method (e.g., "Voice")
4. Grant camera/microphone permissions if prompted
5. Try saying "What time is it?" or drawing a gesture

## Troubleshooting Quick Fixes

### "Backend connection failed"

```bash
# Check if backend is running
curl http://localhost:8000/health

# Should return: {"status":"ok"}

# If not, start backend:
cd backend
python src/server.py
```

### "GOOGLE_API_KEY not found"

```bash
# Create .env file manually
cd backend
echo "GOOGLE_API_KEY=your_actual_key_here" > .env

# Verify it was created
cat .env  # macOS/Linux
type .env  # Windows
```

### "Python module not found"

```bash
# Reinstall backend dependencies
cd backend
pip install -r requirements.txt --force-reinstall
```

### "npm install errors"

```bash
# Clear npm cache and reinstall
cd frontend
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Camera/Microphone not working

**Windows:**
- Settings → Privacy → Camera/Microphone
- Enable for Electron/Chrome

**macOS:**
- System Preferences → Security & Privacy → Camera/Microphone
- Check the box for Electron

**Linux:**
```bash
# Check camera is detected
ls /dev/video*

# Install required packages (Ubuntu/Debian)
sudo apt-get install libgl1-mesa-glx
```

## Next Steps

### First Time Use

1. **Complete Onboarding:**
   - The app will guide you through initial setup
   - Create your user profile
   - Choose your primary input method

2. **Try Different Input Methods:**
   - Voice: Click microphone, speak naturally
   - Sign Language: Enable camera, sign words
   - Eye Gaze: Complete 9-point calibration
   - Draw: Practice drawing simple shapes

3. **Calibrate (if needed):**
   - Eye Gaze: Takes ~2 minutes, very important
   - Voice: Optional, helps with accents
   - Sip/Puff: Takes ~1 minute

### Customize Your Experience

Go to **Settings** to adjust:
- Input sensitivity
- Tremor filtering
- Visual/audio feedback
- Keyboard shortcuts
- Accessibility options

### Learn More

- **Full Documentation**: See [README.md](README.md)
- **Backend API**: See [backend/README.md](backend/README.md)
- **Troubleshooting**: See README.md → Troubleshooting section
- **FAQ**: See README.md → FAQ section

## Development Mode

If you want to modify Fluent:

```bash
# Terminal 1 - Backend with auto-reload
cd backend
python src/server.py

# Terminal 2 - Frontend with hot-reload
cd frontend
npm run dev

# Terminal 3 - Electron
cd frontend
npm run electron
```

Now you can edit files and see changes immediately!

## Useful Scripts Reference

| Script | Purpose | Platform |
|--------|---------|----------|
| `setup.bat` / `setup.sh` | One-time setup | All |
| `quick-start.bat` / `quick-start.sh` | Start backend server | All |
| `start-frontend.bat` / `start-frontend.sh` | Start Electron app | All |
| `backend/start_server.bat` / `.sh` | Start backend only | All |

## Production Build

### Simple Build (Requires Python on User's Machine)

```bash
cd frontend

# Build for your platform
npm run electron-build

# Or build for all platforms
npm run dist
```

Executables will be in `frontend/dist/`:
- Windows: `Fluent-Setup-1.0.0.exe`
- macOS: `Fluent-1.0.0.dmg`
- Linux: `Fluent-1.0.0.AppImage`

### Standalone Build (Recommended - No Dependencies!)

To create a **complete standalone executable** with Python bundled inside:

```bash
# From project root

# Windows:
build-all.bat

# macOS/Linux:
chmod +x build-all.sh
./build-all.sh
```

This creates:
- ✅ **Completely standalone** - no Python needed!
- ✅ **All dependencies included** - TensorFlow, MediaPipe, etc.
- ✅ **Just download and run** - users need nothing pre-installed

See [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md) for details.

## Getting Help

Still stuck? Here's how to get help:

1. **Check the logs:**
   - Backend: Look at terminal where `python src/server.py` is running
   - Frontend: Open DevTools (Help → Toggle Developer Tools)
   - Electron: Check `frontend/out/dev/logs/next-development.log`

2. **Search existing issues:**
   - Visit: https://github.com/yourusername/ntu-beyond-binary/issues
   - Search for your error message

3. **Create a new issue:**
   - Describe what you were doing
   - Include error messages
   - Share your OS, Python version, Node version

4. **Join the community:**
   - GitHub Discussions: Ask questions and share tips
   - Email: support@fluent-accessibility.com

## Quick Command Reference

```bash
# Check versions
python --version    # Should be 3.9, 3.10, or 3.11
node --version      # Should be 18+
npm --version       # Should be 9+

# Test backend
curl http://localhost:8000/health

# View backend API docs
# Open browser to: http://localhost:8000/docs

# Clear caches (if something is broken)
cd backend
rm -rf __pycache__ src/**/__pycache__

cd frontend
rm -rf node_modules/.cache out/
npm install

# Update dependencies
cd backend
pip install -r requirements.txt --upgrade

cd frontend
npm update

# Reset everything (nuclear option)
git clean -fdx  # WARNING: Deletes all untracked files!
```

---

**You're ready to make technology accessible for everyone!** 🚀

If Fluent helps you, please ⭐ star the repo and share it with others.

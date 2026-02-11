# Building Fluent as a Standalone Executable

This guide explains how to build Fluent as a complete standalone application that includes the backend server bundled inside the Electron app.

## What This Creates

A single installer/executable that:
- ✅ Includes the Python backend server (no Python installation needed!)
- ✅ Includes all Python dependencies (TensorFlow, MediaPipe, etc.)
- ✅ Includes the Electron frontend
- ✅ Runs completely standalone - user just downloads and runs
- ✅ Auto-starts the backend when launching the app

## Prerequisites

### On the Build Machine (Developer)

You need these installed to **build** the application:

| Software | Version | Purpose |
|----------|---------|---------|
| **Python** | 3.9-3.11 | Build backend executable |
| **Node.js** | 18+ | Build frontend |
| **npm** | 9+ | Package manager |

### On the User Machine (End User)

Users need **nothing** pre-installed! The executable is completely standalone.
They only need:
- Windows 10+ / macOS 11+ / Linux
- Their Google API key (for first-time setup)

## Build Process

### Automated Build (Recommended)

**Windows:**
```bash
build-all.bat
```

**macOS/Linux:**
```bash
chmod +x build-all.sh
./build-all.sh
```

This script will:
1. Build the backend into a standalone executable using PyInstaller
2. Install frontend dependencies
3. Build the Next.js production bundle
4. Package everything with Electron Builder
5. Create the installer

### Manual Build (Step by Step)

If you prefer to build manually or troubleshoot:

#### Step 1: Build Backend Executable

```bash
cd backend

# Install PyInstaller if not already installed
pip install pyinstaller

# Build the backend
python build_executable.py

# This creates: backend/dist/fluent-backend.exe (Windows)
#           or: backend/dist/fluent-backend (macOS/Linux)
```

**What this does:**
- Bundles Python interpreter
- Bundles all Python packages (FastAPI, MediaPipe, TensorFlow, etc.)
- Creates a single executable file (~500MB-1GB depending on platform)

#### Step 2: Build Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Build Next.js for production
npm run build

# This creates: frontend/out/ directory with static files
```

#### Step 3: Package with Electron

```bash
# Still in frontend/ directory

# Build for current platform
npm run electron-build

# Or build for all platforms (requires platform-specific tools)
npm run dist
```

**What this does:**
- Bundles Electron with Next.js
- Includes the backend executable from step 1
- Creates installer:
  - **Windows**: `frontend/dist/Fluent-Setup-1.0.0.exe` (NSIS installer)
  - **macOS**: `frontend/dist/Fluent-1.0.0.dmg`
  - **Linux**: `frontend/dist/Fluent-1.0.0.AppImage`

## Output Files

After building, you'll find:

### Windows
- **Installer**: `frontend/dist/Fluent-Setup-1.0.0.exe` (~600MB-1.2GB)
  - Standard Windows installer with Start Menu shortcuts
  - Users can choose installation directory
- **Portable**: `frontend/dist/Fluent-1.0.0-portable.exe`
  - No installation required, runs directly

### macOS
- **DMG**: `frontend/dist/Fluent-1.0.0.dmg` (~600MB-1.2GB)
  - Drag-and-drop installer
  - Users drag to Applications folder

### Linux
- **AppImage**: `frontend/dist/Fluent-1.0.0.AppImage` (~600MB-1.2GB)
  - Self-contained, no installation needed
  - Users make executable and run
- **DEB**: `frontend/dist/Fluent-1.0.0.deb`
  - For Debian/Ubuntu systems

## Distribution

### For End Users

Share the installer file with users. They:

1. **Download** the installer (Fluent-Setup-1.0.0.exe on Windows)
2. **Run** the installer
3. **Configure** their Google API key (first launch prompts them)
4. **Start using** Fluent immediately!

No Python, Node.js, or any other software needed!

### File Size

The bundled executables are large because they include:
- Python interpreter (~100MB)
- TensorFlow (~500MB)
- MediaPipe + dependencies (~200MB)
- Electron + Chromium (~150MB)
- Your application code

**Total: 600MB-1.2GB depending on platform**

This is normal for standalone AI applications. Consider:
- Hosting on GitHub Releases
- Using a CDN for distribution
- Providing torrent/direct download options

## Updating the Application

### For Developers

To release an update:

1. **Update version** in `frontend/package.json`:
   ```json
   {
     "version": "1.1.0"
   }
   ```

2. **Rebuild**:
   ```bash
   build-all.bat  # or build-all.sh
   ```

3. **Distribute** new installer

### For End Users

Users should:
1. Download new version
2. Install (overwrites old version on Windows/Mac)
3. Their settings/data are preserved (stored in AppData/Application Support)

## Troubleshooting Build Issues

### "PyInstaller not found"

```bash
pip install pyinstaller==6.3.0
```

### "Backend build fails with module errors"

Ensure all dependencies are installed:
```bash
cd backend
pip install -r requirements.txt
```

### "Electron build fails"

Clear caches and try again:
```bash
cd frontend
rm -rf node_modules dist out
npm install
npm run build
npm run electron-build
```

### "Backend executable too large"

This is expected. The executable includes:
- Entire Python runtime
- All ML libraries (TensorFlow, MediaPipe)
- All dependencies

You can't reduce size without removing functionality.

### "UPX packer error"

PyInstaller may try to use UPX to compress the executable. If it fails:
```bash
# Disable UPX in build_executable.py
# Add this argument:
'--noupx'
```

## Advanced Configuration

### Custom Backend Port

Edit `backend/src/server.py`:
```python
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)  # Change port here
```

Then update `frontend/electron/backend-manager.js`:
```javascript
function getServerURL() {
    return 'http://127.0.0.1:8000'  // Match the port
}
```

### Code Signing (Recommended for Distribution)

**Windows:**
```bash
# Get a code signing certificate
# Configure in package.json:
"win": {
  "certificateFile": "path/to/cert.pfx",
  "certificatePassword": "your_password"
}
```

**macOS:**
```bash
# Requires Apple Developer account ($99/year)
# Configure in package.json:
"mac": {
  "identity": "Developer ID Application: Your Name (TEAMID)"
}
```

### Auto-Update

Consider adding auto-update functionality using:
- **electron-updater**: Built-in update checking
- Host releases on GitHub or your own server

## Continuous Integration

### GitHub Actions Example

Create `.github/workflows/build.yml`:

```yaml
name: Build Fluent

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [windows-latest, macos-latest, ubuntu-latest]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Build Application
        run: |
          chmod +x build-all.sh
          ./build-all.sh
      
      - name: Upload Artifacts
        uses: actions/upload-artifact@v3
        with:
          name: fluent-${{ matrix.os }}
          path: frontend/dist/*
```

## Testing the Built Application

Before distributing:

1. **Test on clean VM** (no Python/Node installed)
2. **Verify backend starts** automatically
3. **Test all input methods** work
4. **Check camera/microphone** permissions
5. **Verify API key** configuration flow
6. **Test SOS button** and emergency features

## Support

If users have issues with the bundled executable:

1. **Check Windows Defender/Antivirus**: May flag the executable (false positive)
2. **Run as Administrator**: Some features may require elevated permissions
3. **Check firewall**: Ensure localhost communication is allowed
4. **Logs location**:
   - Windows: `%APPDATA%/Fluent/logs/`
   - macOS: `~/Library/Application Support/Fluent/logs/`
   - Linux: `~/.config/Fluent/logs/`

---

**Questions?** See [CONTRIBUTING.md](CONTRIBUTING.md) or open an issue on GitHub.

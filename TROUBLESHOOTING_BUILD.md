# Build Troubleshooting Guide

Having issues building Fluent? This guide covers common build problems and their solutions.

## Quick Fixes

### 1. Permission Errors During `pip install`

**Error:**
```
ERROR: Could not install packages due to an OSError: [WinError 5] Access is denied
```

**Causes:**
- Another Python/Electron process is using the packages
- Insufficient permissions to write to Python's site-packages

**Solutions:**

**Option A - Close Running Apps (Recommended):**
```bash
# 1. Close all Fluent windows
# 2. Stop any running backend servers (Ctrl+C in terminals)
# 3. Check Task Manager and end any:
#    - python.exe processes
#    - electron.exe processes
#    - node.exe processes related to Fluent
# 4. Try building again
```

**Option B - Use --user Flag:**
```bash
cd backend
pip install -r requirements.txt --user
```

**Option C - Run as Administrator:**
```bash
# Right-click Command Prompt → Run as Administrator
cd path\to\ntu-beyond-binary
build-all.bat
```

**Option D - Use Virtual Environment:**
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python build_executable.py
```

### 2. PyInstaller Not Found

**Error:**
```
ModuleNotFoundError: No module named 'PyInstaller'
```

**Solution:**
```bash
pip install pyinstaller==6.3.0
# Or
pip install -r backend/requirements.txt
```

The build scripts now auto-install PyInstaller, but if that fails, install it manually.

### 3. Invalid Distribution Warnings

**Warning:**
```
WARNING: Ignoring invalid distribution -umpy
WARNING: Ignoring invalid distribution -rotobuf
```

**Cause:** Corrupted package installations (common after failed installs)

**Solution:**
```bash
# Find and remove corrupted packages
cd %LOCALAPPDATA%\Programs\Python\Python310\Lib\site-packages
# or
cd C:\Users\YourName\AppData\Roaming\Python\Python310\site-packages

# Delete folders starting with ~ or -
# Examples: ~umpy, -rotobuf, ~ebsockets

# Then reinstall
pip install --force-reinstall numpy protobuf websockets
```

### 4. TensorFlow Installation Fails

**Error:**
```
ERROR: Could not find a version that satisfies the requirement tensorflow==2.15.0
```

**Causes:**
- Python 3.12+ (not supported by TensorFlow 2.15)
- Wrong platform (ARM vs x86)

**Solutions:**

**Check Python version:**
```bash
python --version
# Should be 3.9, 3.10, or 3.11 (NOT 3.12+)
```

**If Python 3.12+, install Python 3.11:**
1. Download Python 3.11 from python.org
2. Install alongside existing Python
3. Use `py -3.11` instead of `python`

**For ARM Macs:**
```bash
# TensorFlow on Apple Silicon requires special version
pip install tensorflow-macos==2.15.0
pip install tensorflow-metal  # GPU acceleration
```

### 5. Build Takes Forever / Freezes

**Symptoms:**
- Build stuck at "Building Backend Executable..."
- No progress for 10+ minutes

**Causes:**
- Normal! PyInstaller is analyzing dependencies
- Can take 5-15 minutes on first build
- Antivirus scanning the build

**Solutions:**

**Wait it out:**
- First build: 10-15 minutes is normal
- Subsequent builds: 5-10 minutes
- Look for CPU activity in Task Manager

**Add antivirus exception:**
```
Add these folders to Windows Defender exclusions:
- backend/build/
- backend/dist/
- frontend/dist/
```

**Check for errors:**
```bash
# Run build with verbose output
cd backend
python build_executable.py --verbose
```

### 6. Electron Build Fails

**Error:**
```
Error: Cannot find module 'electron-builder'
```

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run electron-build
```

**Error:**
```
Error: ENOSPC: System limit for number of file watchers reached
```

**Solution (Linux only):**
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### 7. Backend Executable Won't Run

**Error (when testing backend/dist/fluent-backend.exe):**
```
ModuleNotFoundError: No module named 'XXX'
```

**Cause:** PyInstaller didn't bundle a required module

**Solution:**
Edit `backend/build_executable.py` and add to hidden imports:
```python
'--hidden-import=XXX',  # Replace XXX with the missing module
```

Then rebuild.

### 8. "Cannot find backend executable"

**Error:**
```
Backend executable not found: backend/dist/fluent-backend.exe
```

**Cause:** Backend build step failed or was skipped

**Solution:**
```bash
# Build backend separately first
build-backend-only.bat

# Verify it was created
dir backend\dist\fluent-backend.exe

# Then build full app
build-all.bat
```

## Platform-Specific Issues

### Windows

**Missing Visual C++ Redistributables:**
```
Install from: https://aka.ms/vs/17/release/vc_redist.x64.exe
```

**Windows Defender Blocking:**
```
1. Windows Security → Virus & threat protection
2. Manage settings → Add exclusions
3. Add folder: C:\Users\YourName\Documents\GitHub\ntu-beyond-binary
```

### macOS

**"python3" not found:**
```bash
# Install Python via Homebrew
brew install python@3.11
```

**Code signing issues:**
```bash
# Disable Gatekeeper for testing (not recommended for production)
sudo spctl --master-disable
```

**Apple Silicon (M1/M2/M3):**
```bash
# Install Rosetta for compatibility
softwareupdate --install-rosetta

# Or use native ARM Python
arch -arm64 /usr/local/bin/python3 build_executable.py
```

### Linux

**Missing system libraries:**
```bash
# Ubuntu/Debian
sudo apt-get install -y python3-dev python3-pip build-essential \
  libgl1-mesa-glx libglib2.0-0 libsm6 libxext6 libxrender-dev

# Fedora/RHEL
sudo dnf install -y python3-devel gcc gcc-c++ mesa-libGL glib2
```

**AppImage won't run:**
```bash
chmod +x Fluent-1.0.0.AppImage
./Fluent-1.0.0.AppImage
```

## Clean Build (Nuclear Option)

If nothing works, start fresh:

```bash
# 1. Delete all build artifacts
cd backend
rmdir /s /q build dist __pycache__
del *.spec

cd ../frontend
rmdir /s /q node_modules dist out .next

# 2. Reinstall everything
cd ../backend
pip install -r requirements.txt --force-reinstall

cd ../frontend
npm install

# 3. Build again
cd ..
build-all.bat
```

## Getting More Help

### Enable Verbose Logging

**Backend build:**
```bash
cd backend
python build_executable.py 2>&1 | tee build.log
# Check build.log for detailed errors
```

**Frontend build:**
```bash
cd frontend
npm run electron-build --verbose
```

### Check System Requirements

Run this diagnostic script:

**Windows (PowerShell):**
```powershell
Write-Host "=== System Check ==="
Write-Host "Python: $(python --version)"
Write-Host "Node: $(node --version)"
Write-Host "npm: $(npm --version)"
Write-Host "pip: $(pip --version)"
Write-Host ""
Write-Host "=== Installed Packages ==="
pip list | Select-String "tensorflow|mediapipe|pyinstaller|fastapi"
Write-Host ""
Write-Host "=== Disk Space ==="
Get-PSDrive C | Select-Object Used,Free
```

### Report an Issue

If you're still stuck, create a GitHub issue with:

1. **Error message** (full output)
2. **System info:**
   ```bash
   python --version
   node --version
   pip --version
   # OS version
   ```
3. **What you tried** (from this guide)
4. **Build logs** (if available)

## Common Questions

**Q: How long should the build take?**
A: 15-30 minutes for first build, 10-15 minutes for subsequent builds.

**Q: Can I build on one platform for another?**
A: Partially. You can build for all platforms from macOS, but cross-compilation has limitations. Best to build on the target platform.

**Q: The .exe is 1GB+, is that normal?**
A: Yes! It includes Python + TensorFlow + MediaPipe + all dependencies.

**Q: Can I reduce the file size?**
A: Not significantly without removing features. The size is due to ML libraries.

**Q: Do I need to rebuild after every code change?**
A: Only for distribution. For development, use `npm run dev` + `python src/server.py`.

---

**Still having issues?** Check [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md) or ask in GitHub Discussions.

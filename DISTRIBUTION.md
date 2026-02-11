# Distributing Fluent to End Users

This guide explains how to distribute Fluent as a standalone application to end users who don't have Python or development tools installed.

## Overview

Fluent can be distributed as a **complete standalone executable** that includes:
- ✅ Python backend server (bundled)
- ✅ All Python dependencies (TensorFlow, MediaPipe, etc.)
- ✅ Electron frontend
- ✅ Everything needed to run

**Users need:** Nothing! Just download and run the installer.

## Building for Distribution

### Step 1: Build the Standalone Executable

Run the automated build script:

**Windows:**
```bash
build-all.bat
```

**macOS:**
```bash
chmod +x build-all.sh && ./build-all.sh
```

**Linux:**
```bash
chmod +x build-all.sh && ./build-all.sh
```

This creates:
- **Windows**: `frontend/dist/Fluent-Setup-1.0.0.exe` (~600MB-1.2GB)
- **macOS**: `frontend/dist/Fluent-1.0.0.dmg` (~600MB-1.2GB)
- **Linux**: `frontend/dist/Fluent-1.0.0.AppImage` (~600MB-1.2GB)

### Step 2: Test on Clean System

Before distributing, test on a clean system:

1. **Use a virtual machine** or fresh computer
2. **Ensure no Python/Node.js** is installed
3. **Run the installer**
4. **Test all features**:
   - Backend starts automatically
   - Camera/microphone access works
   - All input methods function
   - API key configuration works

## Distribution Methods

### Option 1: GitHub Releases (Recommended)

1. **Create a new release** on GitHub:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Go to GitHub** → Releases → Create Release

3. **Upload the executables**:
   - `Fluent-Setup-1.0.0.exe` (Windows)
   - `Fluent-1.0.0.dmg` (macOS)
   - `Fluent-1.0.0.AppImage` (Linux)

4. **Write release notes** explaining:
   - New features
   - Bug fixes
   - System requirements
   - Installation instructions

**Pros:**
- Free hosting
- Built-in version tracking
- Download statistics
- Familiar to developers

**Cons:**
- Large file size limits (2GB)
- Requires GitHub account to download (for private repos)

### Option 2: Direct Download (Website)

Host the installers on your own website or CDN.

**Recommended CDNs:**
- **AWS S3** + CloudFront
- **Google Cloud Storage** + CDN
- **Azure Blob Storage** + CDN
- **DigitalOcean Spaces**

**Example download page:**
```html
<h2>Download Fluent</h2>
<p>Complete standalone installer - no dependencies needed!</p>

<div class="downloads">
  <a href="https://cdn.example.com/Fluent-Setup-1.0.0.exe">
    <button>Windows (600MB)</button>
  </a>
  
  <a href="https://cdn.example.com/Fluent-1.0.0.dmg">
    <button>macOS (650MB)</button>
  </a>
  
  <a href="https://cdn.example.com/Fluent-1.0.0.AppImage">
    <button>Linux (600MB)</button>
  </a>
</div>
```

### Option 3: Package Managers

**Windows - Chocolatey:**
```bash
# Create Chocolatey package
# See: https://docs.chocolatey.org/en-us/create/create-packages
```

**macOS - Homebrew:**
```bash
# Create Homebrew cask
# See: https://docs.brew.sh/Adding-Software-to-Homebrew
```

**Linux - Snap Store:**
```bash
# Package as snap
# See: https://snapcraft.io/docs/creating-a-snap
```

### Option 4: Microsoft Store / Mac App Store

For wider distribution, consider:

**Microsoft Store:**
- Requires Windows Developer account ($19 one-time)
- Additional requirements for store listing
- Automatic updates built-in

**Mac App Store:**
- Requires Apple Developer account ($99/year)
- App sandboxing required
- Notarization required

## User Installation Guide

Provide this to your users:

### Windows Installation

1. **Download** `Fluent-Setup-1.0.0.exe`
2. **Run** the installer (may trigger SmartScreen warning - click "More info" → "Run anyway")
3. **Choose** installation directory (default: `C:\Program Files\Fluent`)
4. **Complete** installation
5. **Launch** Fluent from Start Menu or Desktop shortcut
6. **Configure** Google API key on first run
7. **Start using** Fluent!

**Note:** Windows Defender may scan the file. This is normal.

### macOS Installation

1. **Download** `Fluent-1.0.0.dmg`
2. **Open** the DMG file
3. **Drag** Fluent to Applications folder
4. **Launch** Fluent from Applications
5. **Allow** permissions (System Preferences → Security if prompted)
6. **Configure** Google API key on first run
7. **Start using** Fluent!

**Note:** First launch may show "unidentified developer" warning. Right-click → Open to bypass.

### Linux Installation

**AppImage (Universal):**
```bash
# Download
wget https://example.com/Fluent-1.0.0.AppImage

# Make executable
chmod +x Fluent-1.0.0.AppImage

# Run
./Fluent-1.0.0.AppImage
```

**Debian/Ubuntu (.deb):**
```bash
sudo dpkg -i Fluent-1.0.0.deb
fluent
```

## First-Time Setup for Users

### API Key Configuration

Users need a Google Gemini API key:

1. **Guide them** to https://aistudio.google.com/app/apikey
2. **Create API key** (free)
3. **Copy** the key
4. **On first launch**, Fluent will prompt for the API key
5. **Paste** and save

Alternatively, manual configuration:

**Windows:**
```
%APPDATA%\Fluent\backend\.env
```

**macOS:**
```
~/Library/Application Support/Fluent/backend/.env
```

**Linux:**
```
~/.config/Fluent/backend/.env
```

Add:
```
GOOGLE_API_KEY=your_key_here
```

## Code Signing (Recommended)

### Why Code Sign?

- **Windows SmartScreen** won't show warnings
- **macOS Gatekeeper** allows installation without overrides
- **User trust** - shows the app is from a verified publisher
- **Enterprise deployment** - required for many organizations

### Windows Code Signing

**Requirements:**
- Code signing certificate (~$100-300/year)
  - DigiCert, Sectigo, SSL.com
- Windows development machine

**Process:**
```bash
# Install certificate
# Configure in package.json:
"win": {
  "certificateFile": "path/to/cert.pfx",
  "certificatePassword": "your_password",
  "signingHashAlgorithms": ["sha256"],
  "publisherName": "Your Company Name"
}

# Rebuild
build-all.bat
```

### macOS Code Signing & Notarization

**Requirements:**
- Apple Developer account ($99/year)
- macOS development machine
- Developer ID certificate

**Process:**
```bash
# Configure in package.json:
"mac": {
  "identity": "Developer ID Application: Your Name (TEAMID)",
  "hardenedRuntime": true,
  "gatekeeperAssess": false,
  "entitlements": "entitlements.mac.plist",
  "entitlementsInherit": "entitlements.mac.plist"
}

# Rebuild and notarize
build-all.sh
xcrun notarytool submit frontend/dist/Fluent-1.0.0.dmg \
  --apple-id your@email.com \
  --team-id TEAMID \
  --wait
```

## Auto-Update System

Consider implementing auto-updates using `electron-updater`:

### Step 1: Install electron-updater

```bash
cd frontend
npm install electron-updater
```

### Step 2: Configure in package.json

```json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "your-username",
      "repo": "ntu-beyond-binary"
    }
  }
}
```

### Step 3: Add update checking

In `main.js`:
```javascript
const { autoUpdater } = require('electron-updater')

app.whenReady().then(() => {
  // Check for updates
  autoUpdater.checkForUpdatesAndNotify()
})
```

Users will automatically receive updates!

## Release Checklist

Before each release:

- [ ] Update version in `package.json`
- [ ] Update `CHANGELOG.md`
- [ ] Test on clean Windows VM
- [ ] Test on clean macOS
- [ ] Test on clean Linux
- [ ] Verify all input methods work
- [ ] Check camera/microphone permissions
- [ ] Test API key configuration
- [ ] Code sign executables (if available)
- [ ] Create Git tag
- [ ] Build release executables
- [ ] Upload to distribution platform
- [ ] Write release notes
- [ ] Announce to users

## Support & Troubleshooting

### Common User Issues

**"Windows Defender blocked the app"**
- This is common for new executables
- Right-click → Properties → Unblock
- Or get code signing certificate

**"macOS won't open the app"**
- Right-click → Open
- Or: System Preferences → Security → Allow

**"Backend server won't start"**
- Check API key is configured
- Check firewall isn't blocking localhost
- Check logs in AppData/Application Support

**"Camera/microphone not working"**
- Grant permissions in System Settings
- Check other apps aren't using devices

### Getting User Logs

Ask users to send logs from:

**Windows:**
```
%APPDATA%\Fluent\logs\
```

**macOS:**
```
~/Library/Application Support/Fluent/logs/
```

**Linux:**
```
~/.config/Fluent/logs/
```

## Analytics & Telemetry (Optional)

Consider adding privacy-respecting analytics:

- **Crash reporting**: Sentry, Bugsnag
- **Usage statistics**: Self-hosted Matomo (privacy-first)
- **Update metrics**: Built into electron-updater

**Important:** Always:
- Be transparent about data collection
- Provide opt-out option
- Don't collect personal data
- Don't track input content

## Marketing Your Distribution

### Landing Page

Create a landing page with:
- Clear value proposition
- Screenshots/demo video
- Feature list
- Download buttons
- System requirements
- Getting started guide

### Social Media

- Post to accessibility communities
- Tweet about features
- Create demo videos
- Blog about development

### Accessibility Communities

Share with:
- Disability advocacy groups
- Assistive technology forums
- Special education communities
- Healthcare organizations

## Legal Considerations

### Privacy Policy

Required if you collect any data. Include:
- What data is collected (if any)
- How it's used
- How it's stored
- User rights (GDPR, CCPA)

### Terms of Service

Protects you legally. Include:
- Acceptable use
- Liability limitations
- Warranty disclaimers
- Termination clauses

### Open Source License

Already using MIT License - continue using it or choose:
- Apache 2.0 (with patent protection)
- GPL (requires derivatives to be open)
- MIT (most permissive)

---

## Questions?

See [CONTRIBUTING.md](CONTRIBUTING.md) or open an issue on GitHub.

**Ready to help users access technology?** Build, test, and ship Fluent! 🚀

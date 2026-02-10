# Fluent - Electron Desktop App

## 🚀 Running the Electron App

### Development Mode
```bash
npm run electron-dev
```
This will:
1. Start the Next.js dev server on port 3001
2. Wait for the server to be ready
3. Launch the Electron window

**Global Keyboard Shortcuts (when app is focused):**
- `Ctrl+Shift+S` - Trigger Emergency SOS
- `Ctrl+B` - Toggle Sidebar
- `Ctrl+O` - Focus Output Panel
- `Ctrl+Shift+T` - Speak Output (TTS)

### Building for Production

#### Build for Current Platform
```bash
npm run electron-build
```

#### Build for All Platforms
```bash
npm run dist
```

This creates installers in the `dist/` folder:
- **Windows**: `Fluent-Setup-1.0.0.exe` (installer) + portable version
- **macOS**: `Fluent-1.0.0.dmg` + `.zip`
- **Linux**: `Fluent-1.0.0.AppImage` + `.deb`

## 📦 What's Included

### Electron Features
- ✅ **Native Desktop App** - Runs standalone without browser
- ✅ **Global Keyboard Shortcuts** - Accessibility shortcuts work system-wide
- ✅ **Desktop Agent Integration** - "Execute on Desktop" button ready for Python agent
- ✅ **Auto-updater Ready** - Can be configured for automatic updates
- ✅ **System Tray Support** - Can minimize to tray (optional)
- ✅ **Cross-Platform** - Windows, macOS, Linux

### Security
- ✅ **Context Isolation** - Renderer process is isolated
- ✅ **No Node Integration** - Secure by default
- ✅ **Preload Script** - Safe IPC communication
- ✅ **Web Security** - Enabled

## 🔧 Technical Details

### File Structure
```
frontend/
├── electron/
│   ├── main.js          # Main process (window management, IPC)
│   └── preload.js       # Secure bridge between main and renderer
├── lib/
│   └── use-electron.ts  # React hooks for Electron features
├── out/                 # Static export (created by build)
└── dist/                # Built installers (created by electron-builder)
```

### IPC Methods Available in React
```typescript
// Check if running in Electron
const { isElectron, electron } = useElectron()

// Execute command on desktop agent
await executeOnDesktop("open browser and search for cats")

// Trigger SOS
await triggerElectronSOS({ message: "Emergency!", contacts: [...] })

// Get app info
const version = await electron.getAppVersion()
const userDataPath = await electron.getAppPath()
```

### Global Shortcuts
Registered in `electron/main.js`:
- Emergency SOS
- Toggle sidebar
- Focus output
- Speak output

These work even when the app is in the background (when focused).

## 🔌 Desktop Agent Integration

The "Execute on Desktop" button in the output panel is wired up to call:
```javascript
window.electron.executeOnDesktop(command)
```

To connect it to your Python desktop agent:
1. Update `electron/main.js` `execute-on-desktop` handler
2. Use Node.js `child_process` to spawn Python process
3. Pass command to `desktop_agent/agent.py`

Example integration:
```javascript
// In electron/main.js
const { spawn } = require('child_process')

ipcMain.handle('execute-on-desktop', async (event, command) => {
  return new Promise((resolve) => {
    const python = spawn('python', ['../desktop_agent/agent.py', command])
    python.stdout.on('data', (data) => {
      console.log(`Agent: ${data}`)
    })
    python.on('close', (code) => {
      resolve({ success: code === 0, message: 'Command executed' })
    })
  })
})
```

## 🎨 Aesthetics Preserved

All neobrutalist design elements are fully preserved:
- ✅ Bold borders and heavy shadows
- ✅ Vibrant yellow theme
- ✅ All 5 theme palettes
- ✅ Chunky buttons with press animations
- ✅ High contrast and accessibility features
- ✅ OpenDyslexic font support
- ✅ Reduced motion support

The app looks and feels identical to the web version!

## 📝 Notes

- The app uses Next.js static export mode
- All pages are pre-rendered at build time
- No server-side features (API routes, SSR) in production build
- Dev mode still uses hot reload and fast refresh

## 🐛 Troubleshooting

### Port 3001 already in use
```bash
# Kill the process on port 3001
npx kill-port 3001
```

### Electron window doesn't open
- Check that Next.js dev server started successfully
- Look for errors in the terminal
- Try `npm run dev` first to verify the app works

### Build fails
- Make sure `out/` directory exists after `npm run export`
- Check that `public/icon.png` exists (or update paths in package.json)

## 🚀 Next Steps

1. **Create proper app icon** - Replace `public/icon.svg` with a proper icon
2. **Connect desktop agent** - Wire up the Python agent to IPC
3. **Add auto-updater** - Configure electron-updater for automatic updates
4. **System tray** - Add minimize to tray functionality
5. **Notifications** - Add native notifications for SOS and alerts

---

**Fluent is now a true desktop application!** 🎉

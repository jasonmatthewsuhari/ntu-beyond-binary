const { app, BrowserWindow, ipcMain, globalShortcut, session, screen, dialog } = require('electron')
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'
const backendManager = require('./backend-manager')

let mainWindow
let isDocked = false
let savedBounds = null
let isBeingDragged = false

function createWindow() {
    const isMac = process.platform === 'darwin'
    
    mainWindow = new BrowserWindow({
        width: 900,
        height: 900,
        minWidth: 400,
        minHeight: 400,
        backgroundColor: '#FFEB3B',
        icon: path.join(__dirname, '../public/icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: true,
        },
        // On macOS: use hiddenInset to keep traffic lights, hide title bar
        // On Windows/Linux: use frameless window for full custom controls
        titleBarStyle: isMac ? 'hiddenInset' : 'hidden',
        frame: !isMac, // Frameless on Windows/Linux
        show: false, // Don't show until ready
        resizable: true, // Allow resizing
    })

    // Grant permissions for media devices and speech recognition
    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
        console.log('Permission requested:', permission)
        // Grant microphone and camera permissions automatically
        if (permission === 'media' || permission === 'microphone' || permission === 'camera') {
            callback(true)
        } else {
            callback(false)
        }
    })

    // Grant permissions for specific origins (needed for Speech Recognition API)
    session.defaultSession.setPermissionCheckHandler((webContents, permission, requestingOrigin) => {
        console.log('Permission check:', permission, 'from', requestingOrigin)
        if (permission === 'media' || permission === 'microphone') {
            return true
        }
        return false
    })

    // Allow connections to Google's Speech API
    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
        if (details.url.includes('google.com')) {
            console.log('Allowing request to:', details.url)
        }
        callback({ requestHeaders: details.requestHeaders })
    })

    // Log any blocked requests
    session.defaultSession.webRequest.onErrorOccurred((details) => {
        if (details.url.includes('speech') || details.url.includes('google')) {
            console.error('Request failed:', details.url, details.error)
        }
    })

    // Load the app
    if (isDev) {
        mainWindow.loadURL('http://localhost:3001')
        // Open DevTools in development
        mainWindow.webContents.openDevTools()
    } else {
        mainWindow.loadFile(path.join(__dirname, '../out/index.html'))
    }

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
        mainWindow.focus()
    })

    // Handle window close
    mainWindow.on('closed', () => {
        mainWindow = null
    })

    // Register global shortcuts for accessibility
    registerAccessibilityShortcuts()
}

function registerAccessibilityShortcuts() {
    // Emergency SOS - Ctrl+Shift+S
    globalShortcut.register('CommandOrControl+Shift+S', () => {
        if (mainWindow) {
            mainWindow.webContents.send('trigger-sos')
        }
    })

    // Toggle sidebar - Ctrl+B
    globalShortcut.register('CommandOrControl+B', () => {
        if (mainWindow) {
            mainWindow.webContents.send('toggle-sidebar')
        }
    })

    // Focus output - Ctrl+O
    globalShortcut.register('CommandOrControl+O', () => {
        if (mainWindow) {
            mainWindow.webContents.send('focus-output')
        }
    })

    // Speak output - Ctrl+Shift+T
    globalShortcut.register('CommandOrControl+Shift+T', () => {
        if (mainWindow) {
            mainWindow.webContents.send('speak-output')
        }
    })

    // Zoom in - Ctrl/Cmd + Plus
    globalShortcut.register('CommandOrControl+Plus', () => {
        if (mainWindow) {
            const currentZoom = mainWindow.webContents.getZoomLevel()
            mainWindow.webContents.setZoomLevel(currentZoom + 1)
        }
    })

    // Zoom in - Ctrl/Cmd + = (alternative)
    globalShortcut.register('CommandOrControl+=', () => {
        if (mainWindow) {
            const currentZoom = mainWindow.webContents.getZoomLevel()
            mainWindow.webContents.setZoomLevel(currentZoom + 1)
        }
    })

    // Zoom out - Ctrl/Cmd + Minus
    globalShortcut.register('CommandOrControl+-', () => {
        if (mainWindow) {
            const currentZoom = mainWindow.webContents.getZoomLevel()
            mainWindow.webContents.setZoomLevel(currentZoom - 1)
        }
    })

    // Reset zoom - Ctrl/Cmd + 0
    globalShortcut.register('CommandOrControl+0', () => {
        if (mainWindow) {
            mainWindow.webContents.setZoomLevel(0)
        }
    })
}

// Enable speech recognition features
app.commandLine.appendSwitch('enable-speech-input')
app.commandLine.appendSwitch('enable-speech-dispatcher')

// App lifecycle
app.whenReady().then(async () => {
    try {
        console.log('Starting Fluent application...')
        
        // Start the backend server
        await backendManager.startBackendServer()
        console.log('Backend server started successfully')
        
        // Create the main window
        createWindow()
    } catch (error) {
        console.error('Failed to start backend server:', error)
        
        // Show error dialog
        dialog.showErrorBox(
            'Backend Server Error',
            'Failed to start the Fluent backend server.\n\n' +
            'Please ensure your Google API key is configured in the .env file.\n\n' +
            'Error: ' + error.message
        )
        
        // Create window anyway, user might want to configure settings
        createWindow()
    }

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    backendManager.stopBackendServer()
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('will-quit', () => {
    // Unregister all shortcuts
    globalShortcut.unregisterAll()
    // Stop backend server
    backendManager.stopBackendServer()
})

// IPC Handlers
ipcMain.handle('get-app-version', () => {
    return app.getVersion()
})

ipcMain.handle('get-app-path', () => {
    return app.getPath('userData')
})

// Handle desktop agent execution (via Python backend)
ipcMain.handle('execute-on-desktop', async (event, command) => {
    console.log('Execute on desktop:', command)
    
    try {
        // Send command to Python backend via HTTP
        const response = await fetch('http://127.0.0.1:8000/api/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: command, input_method: 'electron' })
        })
        const result = await response.json()
        return result
    } catch (error) {
        console.error('Failed to execute command:', error)
        return { success: false, message: error.message }
    }
})

// Handle SOS emergency
ipcMain.handle('trigger-sos-emergency', async (event, data) => {
    console.log('SOS Emergency triggered:', data)
    // In production: send notifications, emails, etc.
    return { success: true }
})

// Window controls
ipcMain.on('minimize-window', () => {
    if (mainWindow) {
        mainWindow.minimize()
    }
})

ipcMain.on('maximize-window', () => {
    if (mainWindow) {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize()
        } else {
            mainWindow.maximize()
        }
    }
})

ipcMain.on('close-window', () => {
    if (mainWindow) {
        mainWindow.close()
    }
})

ipcMain.handle('is-maximized', () => {
    if (mainWindow) {
        return mainWindow.isMaximized()
    }
    return false
})

// Minimize to tray (optional future feature)
ipcMain.on('minimize-to-tray', () => {
    if (mainWindow) {
        mainWindow.hide()
    }
})

// Dock/Undock window
ipcMain.handle('toggle-dock', async () => {
    if (!mainWindow) return { success: false }

    if (isDocked) {
        undockWindow()
    } else {
        dockWindow()
    }

    return { success: true, isDocked }
})

ipcMain.handle('get-dock-state', () => {
    return { isDocked }
})

function dockWindow() {
    if (!mainWindow || isDocked) return

    // Save current window bounds before changing
    savedBounds = mainWindow.getBounds()
    console.log('Saving bounds before docking:', savedBounds)

    // Get the primary display's work area (excluding taskbar)
    const primaryDisplay = screen.getPrimaryDisplay()
    const { x: workAreaX, y: workAreaY, width: workAreaWidth, height: workAreaHeight } = primaryDisplay.workArea

    // Set window to small square (400x400) at bottom right of work area
    const dockSize = 400
    const margin = 20 // margin from screen edge
    
    const newBounds = {
        x: workAreaX + workAreaWidth - dockSize - margin,
        y: workAreaY + workAreaHeight - dockSize - margin,
        width: dockSize,
        height: dockSize
    }

    // Apply docked configuration
    mainWindow.setBounds(newBounds)
    mainWindow.setAlwaysOnTop(true, 'floating')
    mainWindow.setMinimumSize(dockSize, dockSize)
    mainWindow.setMaximumSize(dockSize, dockSize)
    
    isDocked = true

    // Listen for window move to undock
    setupDragListener()

    // Notify renderer
    mainWindow.webContents.send('dock-state-changed', { isDocked: true })
}

function undockWindow() {
    if (!mainWindow || !isDocked) return

    // Remove docked constraints first
    mainWindow.setAlwaysOnTop(false)
    mainWindow.setMinimumSize(400, 400)
    mainWindow.setMaximumSize(0, 0) // Remove max size constraint

    // Restore original bounds
    if (savedBounds) {
        console.log('Restoring saved bounds:', savedBounds)
        mainWindow.setBounds(savedBounds)
    } else {
        // Fallback to comfortable desktop size
        console.log('No saved bounds, using default size')
        mainWindow.setBounds({ width: 1200, height: 800 })
        mainWindow.center()
    }

    isDocked = false
    isBeingDragged = false

    // Notify renderer
    mainWindow.webContents.send('dock-state-changed', { isDocked: false })
}

function setupDragListener() {
    if (!mainWindow) return

    let lastPosition = mainWindow.getPosition()

    const checkPosition = setInterval(() => {
        if (!isDocked || !mainWindow) {
            clearInterval(checkPosition)
            return
        }

        const currentPosition = mainWindow.getPosition()
        
        // If window has moved, user is dragging it
        if (currentPosition[0] !== lastPosition[0] || currentPosition[1] !== lastPosition[1]) {
            isBeingDragged = true
            clearInterval(checkPosition)
            undockWindow()
        }

        lastPosition = currentPosition
    }, 100) // Check every 100ms
}

// Log errors
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error)
})

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error)
})

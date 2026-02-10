const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron')
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1024,
        minHeight: 768,
        backgroundColor: '#FFEB3B',
        icon: path.join(__dirname, '../public/icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: true,
        },
        titleBarStyle: 'default',
        frame: true,
        show: false, // Don't show until ready
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
}

// App lifecycle
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('will-quit', () => {
    // Unregister all shortcuts
    globalShortcut.unregisterAll()
})

// IPC Handlers
ipcMain.handle('get-app-version', () => {
    return app.getVersion()
})

ipcMain.handle('get-app-path', () => {
    return app.getPath('userData')
})

// Handle desktop agent execution
ipcMain.handle('execute-on-desktop', async (event, command) => {
    // This will be connected to the Python desktop agent
    console.log('Execute on desktop:', command)
    return { success: true, message: 'Command sent to desktop agent' }
})

// Handle SOS emergency
ipcMain.handle('trigger-sos-emergency', async (event, data) => {
    console.log('SOS Emergency triggered:', data)
    // In production: send notifications, emails, etc.
    return { success: true }
})

// Minimize to tray (optional future feature)
ipcMain.on('minimize-to-tray', () => {
    if (mainWindow) {
        mainWindow.hide()
    }
})

// Log errors
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error)
})

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error)
})

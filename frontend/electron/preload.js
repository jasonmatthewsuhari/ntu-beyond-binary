const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
    // App info
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    getAppPath: () => ipcRenderer.invoke('get-app-path'),

    // Desktop agent integration
    executeOnDesktop: (command) => ipcRenderer.invoke('execute-on-desktop', command),

    // Emergency SOS
    triggerSOS: (data) => ipcRenderer.invoke('trigger-sos-emergency', data),

    // Window controls
    minimizeToTray: () => ipcRenderer.send('minimize-to-tray'),
    minimizeWindow: () => ipcRenderer.send('minimize-window'),
    maximizeWindow: () => ipcRenderer.send('maximize-window'),
    closeWindow: () => ipcRenderer.send('close-window'),
    toggleDock: () => ipcRenderer.invoke('toggle-dock'),
    getDockState: () => ipcRenderer.invoke('get-dock-state'),
    isMaximized: () => ipcRenderer.invoke('is-maximized'),

    // Listen for main process events
    onTriggerSOS: (callback) => {
        ipcRenderer.on('trigger-sos', () => callback())
    },
    onToggleSidebar: (callback) => {
        ipcRenderer.on('toggle-sidebar', () => callback())
    },
    onFocusOutput: (callback) => {
        ipcRenderer.on('focus-output', () => callback())
    },
    onSpeakOutput: (callback) => {
        ipcRenderer.on('speak-output', () => callback())
    },
    onDockStateChanged: (callback) => {
        ipcRenderer.on('dock-state-changed', (event, data) => callback(data))
    },

    // Remove listeners
    removeAllListeners: (channel) => {
        ipcRenderer.removeAllListeners(channel)
    },
})

// Expose a flag to detect Electron environment
contextBridge.exposeInMainWorld('isElectron', true)

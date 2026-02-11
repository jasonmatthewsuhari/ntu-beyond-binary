interface ElectronAPI {
    // App info
    getAppVersion: () => Promise<string>
    getAppPath: () => Promise<string>

    // Desktop agent integration
    executeOnDesktop: (command: any) => Promise<{ success: boolean; message: string }>

    // Emergency SOS
    triggerSOS: (data: any) => Promise<{ success: boolean }>

    // Window controls
    minimizeToTray: () => void
    minimizeWindow: () => void
    maximizeWindow: () => void
    closeWindow: () => void
    toggleDock: () => Promise<{ success: boolean; isDocked: boolean }>
    getDockState: () => Promise<{ isDocked: boolean }>
    isMaximized: () => Promise<boolean>

    // Event listeners
    onTriggerSOS: (callback: () => void) => void
    onToggleSidebar: (callback: () => void) => void
    onFocusOutput: (callback: () => void) => void
    onSpeakOutput: (callback: () => void) => void
    onDockStateChanged: (callback: (data: { isDocked: boolean }) => void) => void

    // Cleanup
    removeAllListeners: (channel: string) => void
}

interface Window {
    electron?: ElectronAPI
    isElectron?: boolean
}

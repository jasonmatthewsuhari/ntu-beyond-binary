'use client'

import React, { useState, useEffect } from 'react'
import { X, Minimize2, Maximize2 } from 'lucide-react'
import { useFluentContext } from '@/lib/fluent-context'

export function TitleBar() {
    const [isElectron, setIsElectron] = useState(false)
    const [isDocked, setIsDocked] = useState(false)
    const { settings, updateSetting } = useFluentContext()

    useEffect(() => {
        // Check if running in Electron
        if (typeof window !== 'undefined' && window.isElectron) {
            setIsElectron(true)

            // Get initial dock state
            if (window.electron?.getDockState) {
                window.electron.getDockState().then((state) => {
                    setIsDocked(state.isDocked)
                })
            }

            // Listen for dock state changes
            if (window.electron?.onDockStateChanged) {
                window.electron.onDockStateChanged((data) => {
                    setIsDocked(data.isDocked)
                })
            }

            return () => {
                if (window.electron?.removeAllListeners) {
                    window.electron.removeAllListeners('dock-state-changed')
                }
            }
        }
    }, [])

    const handleClose = () => {
        if (window.electron?.closeWindow) {
            window.electron.closeWindow()
        }
    }

    const handleToggleDock = async () => {
        if (window.electron?.toggleDock) {
            try {
                const result = await window.electron.toggleDock()
                if (result.success) {
                    setIsDocked(result.isDocked)
                }
            } catch (error) {
                console.error('Failed to toggle dock:', error)
            }
        }
    }

    const decreaseTextSize = () => {
        const newSize = Math.max(12, settings.fontSize - 2)
        updateSetting('fontSize', newSize)
    }

    const increaseTextSize = () => {
        const newSize = Math.min(32, settings.fontSize + 2)
        updateSetting('fontSize', newSize)
    }

    const resetTextSize = () => {
        updateSetting('fontSize', 16)
    }

    const getTextSizePercentage = () => {
        // Base size is 16px = 100%
        return Math.round((settings.fontSize / 16) * 100)
    }

    return (
        <div
            className="fixed top-0 left-0 right-0 h-10 bg-[#FFEB3B] border-b-4 border-border flex items-center justify-between z-50 px-2 sm:px-4"
            style={{
                WebkitAppRegion: 'drag',
                userSelect: 'none'
            } as React.CSSProperties}
        >
            {/* Text Size Controls */}
            <div
                className="flex items-center gap-0.5 sm:gap-1"
                style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
            >
                <button
                    onClick={decreaseTextSize}
                    className="w-7 sm:w-8 h-6 sm:h-7 flex items-center justify-center rounded-md bg-background border-2 border-border hover:bg-muted transition-colors font-bold text-xs sm:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
                    aria-label="Decrease text size"
                    disabled={settings.fontSize <= 12}
                >
                    -
                </button>
                <button
                    onClick={resetTextSize}
                    className="min-w-[50px] sm:min-w-[60px] h-6 sm:h-7 flex items-center justify-center rounded-md bg-background border-2 border-border hover:bg-muted transition-colors font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] px-1 sm:px-2"
                    aria-label="Reset text size to 100%"
                >
                    {getTextSizePercentage()}%
                </button>
                <button
                    onClick={increaseTextSize}
                    className="w-7 sm:w-8 h-6 sm:h-7 flex items-center justify-center rounded-md bg-background border-2 border-border hover:bg-muted transition-colors font-bold text-xs sm:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
                    aria-label="Increase text size"
                    disabled={settings.fontSize >= 32}
                >
                    +
                </button>
            </div>

            {/* Window controls */}
            <div
                className="flex items-center gap-1 sm:gap-2"
                style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
            >
                {/* Dock button */}
                <button
                    onClick={handleToggleDock}
                    className="w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center rounded-md hover:bg-black/10 transition-colors"
                    aria-label={isDocked ? 'Undock window' : 'Dock window'}
                    title={isDocked ? 'Undock window' : 'Dock window'}
                >
                    {isDocked ? (
                        <Maximize2 className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                    ) : (
                        <Minimize2 className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                    )}
                </button>

                {/* Close */}
                <button
                    onClick={handleClose}
                    className="w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center rounded-md hover:bg-red-500 hover:text-white transition-colors"
                    aria-label="Close window"
                >
                    <X className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                </button>
            </div>
        </div>
    )
}

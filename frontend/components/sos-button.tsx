'use client'

import React, { useState } from 'react'
import { ShieldAlert } from 'lucide-react'

interface SOSButtonProps {
    compact?: boolean
}

export function SOSButton({ compact }: SOSButtonProps) {
    const [triggered, setTriggered] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)

    const triggerSOS = () => {
        setConfirmOpen(true)
    }

    const confirmSOS = () => {
        setTriggered(true)
        setConfirmOpen(false)
        // In production: send emergency message to contacts
        // For now, show alert and vibrate if available
        if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200])
        setTimeout(() => setTriggered(false), 5000)
    }

    return (
        <div className="relative">
            <button
                onClick={triggerSOS}
                className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-lg font-black text-sm transition-all ${triggered
                        ? 'bg-destructive text-destructive-foreground animate-pulse'
                        : 'bg-destructive/90 text-destructive-foreground hover:bg-destructive shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]'
                    }`}
                aria-label="Emergency SOS"
            >
                <ShieldAlert className="h-5 w-5 flex-shrink-0" />
                {!compact && <span>{triggered ? 'SOS SENT' : 'SOS'}</span>}
            </button>

            {/* Confirmation dialog */}
            {confirmOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 p-3 bg-card border-4 border-destructive rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50">
                    <p className="text-sm font-bold mb-2">Send emergency alert?</p>
                    <div className="flex gap-2">
                        <button
                            onClick={confirmSOS}
                            className="flex-1 py-1.5 bg-destructive text-destructive-foreground rounded-lg font-bold text-xs border-2 border-border"
                        >
                            Send SOS
                        </button>
                        <button
                            onClick={() => setConfirmOpen(false)}
                            className="flex-1 py-1.5 bg-muted text-foreground rounded-lg font-bold text-xs border-2 border-border"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

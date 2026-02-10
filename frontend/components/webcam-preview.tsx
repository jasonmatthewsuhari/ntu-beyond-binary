'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Camera, CameraOff, FlipHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WebcamPreviewProps {
    onFrame?: (video: HTMLVideoElement) => void
    frameInterval?: number
    mirror?: boolean
    className?: string
    showControls?: boolean
}

export function WebcamPreview({ onFrame, frameInterval = 100, mirror = true, className = '', showControls = true }: WebcamPreviewProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [mirrored, setMirrored] = useState(mirror)
    const [active, setActive] = useState(false)

    const startCamera = async () => {
        try {
            const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } })
            if (videoRef.current) {
                videoRef.current.srcObject = s
                await videoRef.current.play()
            }
            setStream(s)
            setActive(true)
            setError(null)
        } catch {
            setError('Could not access camera. Please allow camera permissions.')
        }
    }

    const stopCamera = () => {
        stream?.getTracks().forEach(t => t.stop())
        setStream(null)
        setActive(false)
    }

    // Frame callback
    useEffect(() => {
        if (!active || !onFrame || !videoRef.current) return
        const id = setInterval(() => {
            if (videoRef.current) onFrame(videoRef.current)
        }, frameInterval)
        return () => clearInterval(id)
    }, [active, onFrame, frameInterval])

    // Cleanup
    useEffect(() => () => { stream?.getTracks().forEach(t => t.stop()) }, [stream])

    if (error) {
        return (
            <div className={`flex flex-col items-center justify-center gap-3 p-8 bg-card border-4 border-border rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${className}`}>
                <CameraOff className="h-12 w-12 text-muted-foreground" />
                <p className="text-sm font-bold text-center text-muted-foreground">{error}</p>
                <Button onClick={startCamera} className="font-bold border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    Try Again
                </Button>
            </div>
        )
    }

    return (
        <div className={`relative bg-card border-4 border-border rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden ${className}`}>
            {active ? (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${mirrored ? 'scale-x-[-1]' : ''}`}
                />
            ) : (
                <div className="flex flex-col items-center justify-center gap-3 p-8 min-h-[200px]">
                    <Camera className="h-12 w-12 text-muted-foreground" />
                    <Button onClick={startCamera} className="font-bold border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        Start Camera
                    </Button>
                </div>
            )}

            {showControls && active && (
                <div className="absolute bottom-2 right-2 flex gap-1">
                    <button
                        onClick={() => setMirrored(!mirrored)}
                        className="p-1.5 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
                        aria-label="Flip camera"
                    >
                        <FlipHorizontal className="h-4 w-4" />
                    </button>
                    <button
                        onClick={stopCamera}
                        className="p-1.5 bg-destructive/80 text-white rounded-lg hover:bg-destructive transition-colors"
                        aria-label="Stop camera"
                    >
                        <CameraOff className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    )
}

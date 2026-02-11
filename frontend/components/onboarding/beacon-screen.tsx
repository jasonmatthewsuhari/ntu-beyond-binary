'use client'

import React, { useState, useEffect, useRef } from 'react'
import { usePassiveSensing, type InputType } from '@/lib/use-passive-sensing'
import { Volume2, Eye, Hand, Keyboard, Activity, Wind, Smile, Move } from 'lucide-react'

export function BeaconScreen({ onInputDetected }: { onInputDetected: (type: InputType) => void }) {
    const [audioPlayed, setAudioPlayed] = useState(false)
    const [timeoutCounter, setTimeoutCounter] = useState(0)
    const [autoScanStarted, setAutoScanStarted] = useState(false)
    const { detectedInput, transcription, audioLevel, videoRef, faceData, status } = usePassiveSensing(true, {
        voiceVolumeThreshold: 25,
        voiceConsecutiveFrames: 3,
        suppressVoiceWhileSpeaking: true
    })
    const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    // Auto-play welcome audio (ONCE)
    useEffect(() => {
        if (audioPlayed) return

        const speak = () => {
            window.speechSynthesis.cancel()
            const utterance = new SpeechSynthesisUtterance(
                'I am listening. Make any sound, move your head, or press any switch to start.'
            )
            utterance.rate = 0.9
            utterance.pitch = 1.0
            window.speechSynthesis.speak(utterance)
            setAudioPlayed(true)
        }

        const timer = setTimeout(speak, 500)
        return () => clearTimeout(timer)
    }, [audioPlayed])

    // Counter for timeout
    useEffect(() => {
        if (detectedInput) return

        const interval = setInterval(() => {
            setTimeoutCounter(prev => prev + 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [detectedInput])

    // Repeat reminder every 15 seconds
    useEffect(() => {
        if (detectedInput || autoScanStarted || timeoutCounter === 0) return

        if (timeoutCounter % 15 === 0) {
            window.speechSynthesis.cancel()
            const utterance = new SpeechSynthesisUtterance(
                'Still listening. Make any sound or movement to begin.'
            )
            utterance.rate = 0.9
            window.speechSynthesis.speak(utterance)
        }
    }, [timeoutCounter, detectedInput, autoScanStarted])

    // Auto-scan mode after 30 seconds (ONCE)
    useEffect(() => {
        if (timeoutCounter >= 30 && !detectedInput && !autoScanStarted) {
            setAutoScanStarted(true)

            window.speechSynthesis.cancel()
            const utterance = new SpeechSynthesisUtterance(
                'Entering auto-scan mode. Press any key or make a sound when you hear Setup.'
            )
            utterance.rate = 0.8
            window.speechSynthesis.speak(utterance)

            utterance.onend = () => {
                let scanIndex = 0
                const options = ['Setup', 'Exit']

                scanIntervalRef.current = setInterval(() => {
                    const scanUtterance = new SpeechSynthesisUtterance(options[scanIndex])
                    scanUtterance.rate = 0.9
                    window.speechSynthesis.speak(scanUtterance)

                    scanIndex = (scanIndex + 1) % options.length
                }, 2000)
            }
        }
    }, [timeoutCounter, detectedInput, autoScanStarted])

    // Cleanup scan interval when input detected
    useEffect(() => {
        if (detectedInput && scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current)
            scanIntervalRef.current = null
            window.speechSynthesis.cancel()
        }
    }, [detectedInput])

    // Handle detected input - for onboarding, accept ANY detection (no confidence threshold)
    useEffect(() => {
        console.log('🚨 BeaconScreen detectedInput changed:', detectedInput)
        if (detectedInput) {
            console.log('🚨 Calling onInputDetected with type:', detectedInput.type, 'confidence:', detectedInput.confidence)
            onInputDetected(detectedInput.type)
        }
    }, [detectedInput, onInputDetected])

    // CRITICAL: Cleanup on unmount
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel()
            if (scanIntervalRef.current) {
                clearInterval(scanIntervalRef.current)
            }
        }
    }, [])

    // Draw waveform visualization - ACCESSIBLE: Yellow on Black
    useEffect(() => {
        if (!canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const draw = () => {
            // Black background
            ctx.fillStyle = '#000000'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            const barCount = 50
            const barWidth = canvas.width / barCount
            const normalizedLevel = Math.min(audioLevel / 100, 1)

            for (let i = 0; i < barCount; i++) {
                const phase = (i / barCount) * Math.PI * 2
                const amplitude = Math.sin(phase + Date.now() / 200) * 0.5 + 0.5
                const height = amplitude * normalizedLevel * canvas.height * 0.8

                // ACCESSIBLE: Solid yellow, no gradients
                ctx.fillStyle = '#FFFF00'

                const x = i * barWidth
                const y = (canvas.height - height) / 2

                ctx.fillRect(x, y, barWidth - 2, height)
            }
        }

        draw()
    }, [audioLevel])

    return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">
            <video ref={videoRef} className="hidden" playsInline muted />

            <div className="relative mb-8">
                <div className="w-32 h-32 rounded-full bg-white animate-pulse"
                    style={{ animationDuration: '3s' }} />

                {detectedInput && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        {detectedInput.type === 'voice' && <Volume2 className="h-16 w-16 text-black animate-bounce" />}
                        {detectedInput.type === 'motion' && <Activity className="h-16 w-16 text-black animate-bounce" />}
                        {detectedInput.type === 'switch' && <Keyboard className="h-16 w-16 text-black animate-bounce" />}
                        {detectedInput.type === 'blink' && <Eye className="h-16 w-16 text-black animate-bounce" />}
                        {detectedInput.type === 'gaze' && <Eye className="h-16 w-16 text-black animate-bounce" />}
                        {detectedInput.type === 'head' && <Move className="h-16 w-16 text-black animate-bounce" />}
                        {detectedInput.type === 'sign' && <Hand className="h-16 w-16 text-black animate-bounce" />}
                        {detectedInput.type === 'facial' && <Smile className="h-16 w-16 text-black animate-bounce" />}
                        {detectedInput.type === 'sip-puff' && <Wind className="h-16 w-16 text-black animate-bounce" />}
                    </div>
                )}
            </div>

            {/* GAZE INDICATOR - Shows where you're looking! */}
            {faceData?.gazeDirection && (
                <div className="absolute top-1/2 left-1/2 pointer-events-none">
                    <div
                        className="w-8 h-8 rounded-full bg-red-500 border-4 border-white shadow-lg transition-transform duration-100"
                        style={{
                            transform: `translate(calc(-50% + ${faceData.gazeDirection.x * 100}px), calc(-50% + ${faceData.gazeDirection.y * 100}px))`
                        }}
                    />
                </div>
            )}

            {/* HEAD ROTATION INDICATOR */}
            {faceData?.headRotation && (
                <div className="absolute top-8 left-8 bg-black/80 text-white p-4 rounded-lg font-mono text-sm">
                    <div>Pitch: {faceData.headRotation.pitch.toFixed(1)}°</div>
                    <div>Yaw: {faceData.headRotation.yaw.toFixed(1)}°</div>
                    <div>Roll: {faceData.headRotation.roll.toFixed(1)}°</div>
                    <div className="mt-2 font-bold">
                        Total: {(Math.abs(faceData.headRotation.pitch) + Math.abs(faceData.headRotation.yaw) + Math.abs(faceData.headRotation.roll)).toFixed(1)}°
                    </div>
                </div>
            )}

            <div className="mb-8">
                <canvas
                    ref={canvasRef}
                    width={600}
                    height={100}
                    className="rounded-lg border-2 border-white/20"
                />
            </div>

            {transcription && (
                <div className="bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-2xl px-8 py-4 max-w-2xl animate-in fade-in slide-in-from-bottom-4">
                    <p className="text-white text-2xl font-bold text-center">
                        "{transcription.text}"
                    </p>
                    <p className="text-white/60 text-sm text-center mt-2">
                        Confidence: {(transcription.confidence * 100).toFixed(0)}%
                    </p>
                </div>
            )}

            {autoScanStarted && !detectedInput && (
                <div className="absolute bottom-16 text-white text-2xl font-black">
                    Auto-Scan Mode Active
                </div>
            )}

            {!transcription && !detectedInput && (
                <div className="text-white/60 text-lg font-medium text-center max-w-xl">
                    {autoScanStarted
                        ? 'Press any key when you hear "Setup"'
                        : 'Listening for voice, motion, keyboard, or any input...'}
                </div>
            )}

            {/* Debug Status Panel */}
            <div className="absolute top-6 right-6 bg-black/80 text-white border border-white/20 rounded-lg p-4 text-xs font-mono w-72">
                <div className="font-bold mb-2">System Status</div>
                <div>Mic: {status.audioReady ? 'READY' : 'NO'}</div>
                <div>Camera: {status.videoReady ? 'READY' : 'NO'}</div>
                <div>Speech API: {status.speechAvailable ? 'YES' : 'NO'}</div>
                <div>Speech Active: {status.speechActive ? 'YES' : 'NO'}</div>
                <div>Speech Error: {status.speechError ?? 'none'}</div>
                <div>MediaPipe: {status.mediaPipeReady ? 'READY' : 'NO'}</div>
                <div>Face Detected: {status.faceDetected ? 'YES' : 'NO'}</div>
                <div>Detection Lock: {status.detectionLocked ? 'LOCKED' : 'OPEN'}</div>
                <div>Audio Level: {Math.round(status.audioLevel)}</div>
                <div>Last Transcript: {status.lastTranscript || '—'}</div>
                <div>Speech Event: {status.lastSpeechEvent}</div>
            </div>

            <div className="sr-only" role="status" aria-live="polite">
                {detectedInput
                    ? `${detectedInput.type} input detected`
                    : autoScanStarted
                        ? 'Auto-scan mode active. Press any key when you hear Setup.'
                        : 'Waiting for input. Make any sound or movement to begin.'}
                {transcription && ` Heard: ${transcription.text}`}
            </div>
        </div>
    )
}

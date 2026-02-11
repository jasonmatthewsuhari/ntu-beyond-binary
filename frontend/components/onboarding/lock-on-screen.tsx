'use client'

import React, { useState, useEffect } from 'react'
import { type InputType, usePassiveSensing } from '@/lib/use-passive-sensing'
import { Button } from '@/components/ui/button'

interface LockOnScreenProps {
    detectedInput: InputType
    onConfirmed: () => void
    onTimeout?: () => void
}

export function LockOnScreen({ detectedInput, onConfirmed, onTimeout }: LockOnScreenProps) {
    const [confirmed, setConfirmed] = useState(false)
    const [listenForConfirm, setListenForConfirm] = useState(false)
    const [sensingEnabled, setSensingEnabled] = useState(false)
    const [confirmCount, setConfirmCount] = useState(0)
    const [timeoutCounter, setTimeoutCounter] = useState(0)
    const requiredConfirmations = 3

    // Re-enable passive sensing for confirmation ONLY after initial delay
    const { detectedInput: confirmInput, videoRef, status } = usePassiveSensing(
        sensingEnabled && !confirmed,
        {
            disableGaze: detectedInput === 'head',
            disableVoiceVolume: true,  // Always disable voice volume - we only need the specific input type
            suppressVoiceWhileSpeaking: true,
            allowedInputTypes: [detectedInput]  // Only allow the specific detected input
        }
    )

    const messages: Record<InputType, { initial: string; confirm: string; detected: string }> = {
        voice: {
            initial: 'I heard a voice. Speak 3 times to confirm.',
            confirm: 'Speak now.',
            detected: 'Voice confirmed!'
        },
        motion: {
            initial: 'I see movement. Move 3 times to confirm.',
            confirm: 'Move your mouse again.',
            detected: 'Motion confirmed!'
        },
        switch: {
            initial: 'Switch detected. Press 3 times to confirm.',
            confirm: 'Press your switch.',
            detected: 'Switch confirmed!'
        },
        blink: {
            initial: 'I saw a blink. Blink 3 times to confirm.',
            confirm: 'Blink deliberately.',
            detected: 'Blink confirmed!'
        },
        gaze: {
            initial: 'Eye gaze detected. Look away and back 3 times.',
            confirm: 'Look away and back.',
            detected: 'Eye gaze confirmed!'
        },
        head: {
            initial: 'Head movement detected. Nod 3 times to confirm.',
            confirm: 'Nod your head.',
            detected: 'Head motion confirmed!'
        },
        sign: {
            initial: 'Sign language detected. Repeat 3 times to confirm.',
            confirm: 'Repeat your gesture.',
            detected: 'Sign language confirmed!'
        },
        facial: {
            initial: 'Facial expression detected. Make it 3 times to confirm.',
            confirm: 'Make the expression.',
            detected: 'Facial expression confirmed!'
        },
        'sip-puff': {
            initial: 'Sip or puff detected. Do it 3 times to confirm.',
            confirm: 'Sip or puff.',
            detected: 'Sip-puff confirmed!'
        },
        none: {
            initial: 'Waiting for input...',
            confirm: 'Please try again.',
            detected: 'Input confirmed!'
        }
    }

    const message = messages[detectedInput] || messages.none

    // Auto-play audio (ONCE)
    useEffect(() => {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(message.initial)
        utterance.rate = 0.9

        // Wait for TTS to finish, then enable listening
        utterance.onend = () => {
            console.log('🎯 TTS finished, enabling listening')
            setTimeout(() => {
                window.speechSynthesis.cancel() // Ensure fully cancelled
                setListenForConfirm(true)
                setSensingEnabled(true)
                console.log('🎯 Lock-on: Ready for confirmation input')
            }, 200)
        }

        window.speechSynthesis.speak(utterance)
    }, []) // Empty deps - only run once

    // Timeout counter
    useEffect(() => {
        if (confirmed || !listenForConfirm) return

        const interval = setInterval(() => {
            setTimeoutCounter(prev => {
                if (prev + 1 >= 30) {
                    console.log('⏰ Confirmation timeout')
                    if (onTimeout) onTimeout()
                    return prev
                }
                return prev + 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [confirmed, listenForConfirm, onTimeout])

    // Listen for confirmation via passive sensing
    useEffect(() => {
        if (!listenForConfirm || confirmed || !confirmInput) return

        // Check if the same input type was detected again
        if (confirmInput.type === detectedInput) {
            const newCount = confirmCount + 1
            console.log(`✓ Confirmation ${newCount}/${requiredConfirmations}:`, confirmInput.type)
            setConfirmCount(newCount)

            // Visual/audio feedback
            const beep = new SpeechSynthesisUtterance(`${newCount}`)
            beep.rate = 1.2
            beep.volume = 0.8
            window.speechSynthesis.speak(beep)

            if (newCount >= requiredConfirmations) {
                confirmInputAction()
            } else {
                // Reset sensing to allow next detection
                setSensingEnabled(false)
                setTimeout(() => setSensingEnabled(true), 500)
            }
        }
    }, [confirmInput, listenForConfirm, confirmed, detectedInput, confirmCount])

    // Listen for confirmation input (fallback for non-passive inputs)
    useEffect(() => {
        if (!listenForConfirm || confirmed) return

        let clickCount = 0
        let clickTimer: NodeJS.Timeout

        const handleConfirm = (e: KeyboardEvent) => {
            if (detectedInput === 'switch' && (e.key === ' ' || e.key === 'Enter')) {
                const newCount = confirmCount + 1
                setConfirmCount(newCount)
                console.log(`✓ Switch confirmation ${newCount}/${requiredConfirmations}`)

                if (newCount >= requiredConfirmations) {
                    confirmInputAction()
                }
            }
        }

        const handleClick = () => {
            if (detectedInput === 'motion') {
                clickCount++
                console.log(`🖱️ Motion confirmation ${clickCount}/${requiredConfirmations}`)
                setConfirmCount(clickCount)

                if (clickCount >= requiredConfirmations) {
                    confirmInputAction()
                }

                clearTimeout(clickTimer)
                clickTimer = setTimeout(() => { clickCount = 0 }, 2000)
            }
        }

        window.addEventListener('keydown', handleConfirm)
        window.addEventListener('click', handleClick)

        return () => {
            window.removeEventListener('keydown', handleConfirm)
            window.removeEventListener('click', handleClick)
            clearTimeout(clickTimer)
        }
    }, [listenForConfirm, confirmed, detectedInput, confirmCount])

    const confirmInputAction = () => {
        if (confirmed) return
        setConfirmed(true)

        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(message.detected)
        utterance.rate = 1.0
        window.speechSynthesis.speak(utterance)

        setTimeout(() => {
            onConfirmed()
        }, 1500)
    }

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel()
        }
    }, [])

    return (
        <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center p-8">
            {/* Hidden video element for face detection */}
            <video ref={videoRef} className="hidden" playsInline muted />

            <div className="max-w-2xl text-center space-y-8">
                <div className={`text-6xl font-black transition-all duration-500 ${confirmed ? 'scale-125 text-green-400' : ''}`}>
                    {confirmed ? '✓' : '?'}
                </div>

                <h1 className="text-3xl font-black">
                    {confirmed ? message.detected : message.initial}
                </h1>

                {!confirmed && (
                    <>
                        <p className="text-xl text-gray-400">
                            {message.confirm}
                        </p>

                        {/* Progress indicator */}
                        <div className="flex justify-center gap-4 mt-8">
                            {[...Array(requiredConfirmations)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-16 h-16 rounded-full border-4 border-white flex items-center justify-center text-2xl font-black transition-all ${i < confirmCount ? 'bg-green-500 scale-110' : 'bg-white/20'
                                        }`}
                                >
                                    {i < confirmCount ? '✓' : i + 1}
                                </div>
                            ))}
                        </div>

                        {/* Timeout indicator */}
                        <p className="text-sm text-gray-500 mt-4">
                            Time remaining: {30 - timeoutCounter}s
                        </p>
                    </>
                )}

                {/* Manual confirm button (accessible fallback) */}
                {!confirmed && listenForConfirm && (
                    <Button
                        onClick={() => {
                            const newCount = confirmCount + 1
                            setConfirmCount(newCount)
                            if (newCount >= requiredConfirmations) {
                                confirmInputAction()
                            }
                        }}
                        className="mt-8 text-xl px-8 py-6 font-bold border-4 border-white bg-green-600 hover:bg-green-700 text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                    >
                        Count ({confirmCount}/{requiredConfirmations})
                    </Button>
                )}
            </div>

            <div className="sr-only" role="status" aria-live="polite">
                {confirmed ? message.detected : message.initial}
            </div>

            {/* Debug Status Panel */}
            <div className="absolute top-6 right-6 bg-black/80 text-white border border-white/20 rounded-lg p-4 text-xs font-mono w-80">
                <div className="font-bold mb-2">System Status</div>
                <div>Mic: {status.audioReady ? 'READY' : 'NO'}</div>
                <div>Camera: {status.videoReady ? 'READY' : 'NO'}</div>
                <div className="mt-2 font-bold">Web Speech API</div>
                <div>Available: {status.speechAvailable ? 'YES' : 'NO'}</div>
                <div>Active: {status.speechActive ? 'YES' : 'NO'}</div>
                <div>Error: {status.speechError ?? 'none'}</div>
                <div className="mt-2 font-bold">Local Speech (Whisper)</div>
                <div className={status.localSpeechAvailable ? 'text-green-400' : 'text-red-400'}>
                    Service: {status.localSpeechAvailable ? 'READY ✓' : 'NOT RUNNING ✗'}
                </div>
                <div>Recording: {status.localSpeechRecording ? 'YES' : 'NO'}</div>
                {status.localSpeechError && (
                    <div className="text-yellow-400 text-xs mt-1">
                        {status.localSpeechError}
                    </div>
                )}
                <div className="mt-2 font-bold">Detection</div>
                <div>MediaPipe: {status.mediaPipeReady ? 'READY' : 'NO'}</div>
                <div>Face: {status.faceDetected ? 'YES' : 'NO'}</div>
                <div>Lock: {status.detectionLocked ? 'LOCKED' : 'OPEN'}</div>
                <div>Audio Level: {Math.round(status.audioLevel)}</div>
                <div className="mt-2 font-bold">Transcript</div>
                <div className="text-white break-words">{status.lastTranscript || '—'}</div>
            </div>
        </div>
    )
}

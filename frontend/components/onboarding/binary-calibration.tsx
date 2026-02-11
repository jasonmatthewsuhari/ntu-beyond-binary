'use client'

import React, { useState, useEffect } from 'react'
import { type InputType } from '@/lib/use-passive-sensing'

interface BinaryCalibrationProps {
    inputType: InputType
    onComplete: (calibrationData: CalibrationData) => void
}

export interface CalibrationData {
    primaryInput: InputType
    availableInputs: InputType[]
    precision: 'high' | 'medium' | 'low'
    tremorDetected: boolean
    dwellTime: number
    rangeOfMotion: number
    preferredSpeed: 'fast' | 'medium' | 'slow'
}

export function BinaryCalibration({ inputType, onComplete }: BinaryCalibrationProps) {
    const [step, setStep] = useState(0)
    const [calibrationData, setCalibrationData] = useState<Partial<CalibrationData>>({
        primaryInput: inputType,
        availableInputs: [inputType], // Start with detected input
        precision: 'medium',
        tremorDetected: false,
        dwellTime: 1000,
        rangeOfMotion: 100,
        preferredSpeed: 'medium'
    })
    const [selection, setSelection] = useState<'left' | 'right' | null>(null)
    const [jitterCount, setJitterCount] = useState(0)
    const [audioPlayed, setAudioPlayed] = useState(false)

    const questions = [
        {
            text: 'Can you hold your selection on the GREEN box?',
            audio: 'Can you hold your gaze or cursor on the Green box?',
            leftLabel: 'No',
            rightLabel: 'Yes',
            onYes: () => setCalibrationData(prev => ({ ...prev, precision: 'high' })),
            onNo: () => setCalibrationData(prev => ({ ...prev, precision: 'low' }))
        },
        {
            text: 'Would you like FASTER responses?',
            audio: 'Would you like faster responses, or more time to select?',
            leftLabel: 'More Time',
            rightLabel: 'Faster',
            onYes: () => setCalibrationData(prev => ({ ...prev, preferredSpeed: 'fast', dwellTime: 600 })),
            onNo: () => setCalibrationData(prev => ({ ...prev, preferredSpeed: 'slow', dwellTime: 2000 }))
        },
        {
            text: 'Can you reach the TOP of the screen?',
            audio: 'Can you comfortably reach the top of the screen?',
            leftLabel: 'Difficult',
            rightLabel: 'Yes',
            onYes: () => setCalibrationData(prev => ({ ...prev, rangeOfMotion: 100 })),
            onNo: () => setCalibrationData(prev => ({ ...prev, rangeOfMotion: 70 }))
        },
        {
            text: 'Can you also use your VOICE?',
            audio: 'Can you also use your voice to control this app?',
            leftLabel: 'No',
            rightLabel: 'Yes',
            onYes: () => addAvailableInput('voice'),
            onNo: () => { }
        },
        {
            text: 'Can you also use a KEYBOARD or SWITCH?',
            audio: 'Can you also use a keyboard or switch?',
            leftLabel: 'No',
            rightLabel: 'Yes',
            onYes: () => addAvailableInput('switch'),
            onNo: () => { }
        },
        {
            text: 'Can you also use MOUSE or TOUCH?',
            audio: 'Can you also use a mouse or touchscreen?',
            leftLabel: 'No',
            rightLabel: 'Yes',
            onYes: () => addAvailableInput('motion'),
            onNo: () => { }
        }
    ]

    const currentQuestion = questions[step]

    const addAvailableInput = (input: InputType) => {
        setCalibrationData(prev => ({
            ...prev,
            availableInputs: [...(prev.availableInputs || []), input]
        }))
    }

    // Auto-play question audio (ONCE per question)
    useEffect(() => {
        if (!currentQuestion || audioPlayed) return

        window.speechSynthesis.cancel() // Stop any previous speech

        const utterance = new SpeechSynthesisUtterance(currentQuestion.audio)
        utterance.rate = 0.9
        window.speechSynthesis.speak(utterance)
        setAudioPlayed(true)
    }, [step, currentQuestion, audioPlayed])

    // Reset audio flag when step changes
    useEffect(() => {
        setAudioPlayed(false)
    }, [step])

    // Detect jitter/tremor
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setLastMousePos(mousePos)
            setMousePos({ x: e.clientX, y: e.clientY })

            const dx = Math.abs(e.clientX - lastMousePos.x)
            const dy = Math.abs(e.clientY - lastMousePos.y)

            if (dx > 50 || dy > 50) {
                setJitterCount(prev => prev + 1)
            }
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [mousePos, lastMousePos])

    // Auto-detect tremor
    useEffect(() => {
        if (jitterCount > 10 && !calibrationData.tremorDetected) {
            setCalibrationData(prev => ({ ...prev, tremorDetected: true }))

            window.speechSynthesis.cancel()
            const utterance = new SpeechSynthesisUtterance(
                'I noticed some movement. I have smoothed the cursor for you.'
            )
            window.speechSynthesis.speak(utterance)
        }
    }, [jitterCount, calibrationData.tremorDetected])

    const handleSelection = (side: 'left' | 'right') => {
        setSelection(side)

        if (side === 'right') {
            currentQuestion.onYes()
        } else {
            currentQuestion.onNo()
        }

        // Move to next question
        setTimeout(() => {
            if (step < questions.length - 1) {
                setStep(step + 1)
                setSelection(null)
            } else {
                // Calibration complete
                onComplete(calibrationData as CalibrationData)
            }
        }, 1000)
    }

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel()
        }
    }, [])

    if (!currentQuestion) return null

    return (
        <div className="fixed inset-0 flex">
            {/* Left side - No/Back */}
            <button
                onClick={() => handleSelection('left')}
                className={`flex-1 flex flex-col items-center justify-center transition-all duration-300
          ${selection === 'left' ? 'bg-red-600 scale-105' : 'bg-red-500 hover:bg-red-600'}
          ${calibrationData.tremorDetected ? 'cursor-smooth' : ''}`}
                aria-label={currentQuestion.leftLabel}
            >
                <div className="text-white text-center p-8">
                    <div className="text-8xl font-black mb-4">✗</div>
                    <div className="text-4xl font-black">{currentQuestion.leftLabel}</div>
                </div>
            </button>

            {/* Right side - Yes/Next */}
            <button
                onClick={() => handleSelection('right')}
                className={`flex-1 flex flex-col items-center justify-center transition-all duration-300
          ${selection === 'right' ? 'bg-green-600 scale-105' : 'bg-green-500 hover:bg-green-600'}
          ${calibrationData.tremorDetected ? 'cursor-smooth' : ''}`}
                aria-label={currentQuestion.rightLabel}
            >
                <div className="text-white text-center p-8">
                    <div className="text-8xl font-black mb-4">✓</div>
                    <div className="text-4xl font-black">{currentQuestion.rightLabel}</div>
                </div>
            </button>

            {/* Question overlay */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-8 py-4 rounded-2xl border-4 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] max-w-2xl">
                <p className="text-2xl font-black text-center">{currentQuestion.text}</p>
                <p className="text-sm text-gray-400 text-center mt-2">Question {step + 1} of {questions.length}</p>
            </div>

            {/* Screen reader */}
            <div className="sr-only" role="status" aria-live="polite">
                {currentQuestion.audio}. {selection ? `Selected ${selection === 'right' ? currentQuestion.rightLabel : currentQuestion.leftLabel}` : ''}
            </div>
        </div>
    )
}

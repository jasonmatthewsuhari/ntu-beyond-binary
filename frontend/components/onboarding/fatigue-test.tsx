'use client'

import React, { useState } from 'react'
import { type CalibrationData } from './binary-calibration'

interface FatigueTestProps {
    calibrationData: CalibrationData
    onComplete: (fatigueData: FatigueData) => void
}

export interface FatigueData {
    maxRange: number
    avgTimeToTarget: number
    accuracyScore: number
    fatigueDetected: boolean
}

export function FatigueTest({ calibrationData, onComplete }: FatigueTestProps) {
    const [currentTarget, setCurrentTarget] = useState(0)
    const [startTime, setStartTime] = useState(Date.now())
    const [times, setTimes] = useState<number[]>([])
    const [accuracies, setAccuracies] = useState<number[]>([])

    const targets = [
        { x: 50, y: 10, label: 'Top' },
        { x: 90, y: 50, label: 'Right' },
        { x: 50, y: 90, label: 'Bottom' },
        { x: 10, y: 50, label: 'Left' },
        { x: 50, y: 50, label: 'Center' }
    ]

    const target = targets[currentTarget]

    // Auto-play instructions
    React.useEffect(() => {
        const utterance = new SpeechSynthesisUtterance(
            `Move to the ${target.label} target. This helps me understand your range of motion.`
        )
        utterance.rate = 0.9
        window.speechSynthesis.speak(utterance)
        setStartTime(Date.now())
    }, [currentTarget, target.label])

    const handleTargetHit = (accuracy: number) => {
        const timeToTarget = Date.now() - startTime
        setTimes(prev => [...prev, timeToTarget])
        setAccuracies(prev => [...prev, accuracy])

        if (currentTarget < targets.length - 1) {
            setCurrentTarget(prev => prev + 1)
        } else {
            // Test complete
            const avgTime = times.reduce((a, b) => a + b, 0) / times.length
            const avgAccuracy = accuracies.reduce((a, b) => a + b, 0) / accuracies.length
            const fatigueDetected = accuracies[accuracies.length - 1] < accuracies[0] * 0.7

            onComplete({
                maxRange: 100, // Would calculate from actual movement
                avgTimeToTarget: avgTime,
                accuracyScore: avgAccuracy,
                fatigueDetected
            })
        }
    }

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900 to-black flex items-center justify-center">
            {/* Instruction */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-lg font-black">Move to the {target.label} target ({currentTarget + 1}/{targets.length})</p>
            </div>

            {/* Target */}
            <button
                onClick={() => handleTargetHit(0.9)} // Simplified - would calculate actual accuracy
                className="absolute w-24 h-24 rounded-full bg-yellow-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transition-transform animate-pulse"
                style={{
                    left: `${target.x}%`,
                    top: `${target.y}%`,
                    transform: 'translate(-50%, -50%)'
                }}
                aria-label={`Target at ${target.label}`}
            >
                <div className="text-4xl">🎯</div>
            </button>

            {/* Progress */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
                {targets.map((_, i) => (
                    <div
                        key={i}
                        className={`w-4 h-4 rounded-full border-2 border-white ${i < currentTarget ? 'bg-green-400' : i === currentTarget ? 'bg-yellow-400 animate-pulse' : 'bg-gray-600'}`}
                    />
                ))}
            </div>

            {/* Screen reader */}
            <div className="sr-only" role="status" aria-live="polite">
                Target {currentTarget + 1} of {targets.length}: {target.label}
            </div>
        </div>
    )
}

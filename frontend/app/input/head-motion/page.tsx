'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useFluentContext } from '@/lib/fluent-context'
import { recordInput } from '@/lib/adaptive-engine'
import { ModePageLayout } from '@/components/mode-page-layout'
import { WebcamPreview } from '@/components/webcam-preview'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Move, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Settings2 } from 'lucide-react'

interface MotionMapping {
    motion: string
    action: string
    icon: React.ReactNode
}

const DEFAULT_MAPPINGS: MotionMapping[] = [
    { motion: 'Nod Up', action: 'Yes', icon: <ArrowUp className="h-5 w-5" /> },
    { motion: 'Nod Down', action: 'No', icon: <ArrowDown className="h-5 w-5" /> },
    { motion: 'Tilt Left', action: 'Previous', icon: <ArrowLeft className="h-5 w-5" /> },
    { motion: 'Tilt Right', action: 'Next', icon: <ArrowRight className="h-5 w-5" /> },
]

export default function HeadMotionPage() {
    const { appendOutput } = useFluentContext()
    const [isTracking, setIsTracking] = useState(false)
    const [lastMotion, setLastMotion] = useState<string | null>(null)
    const [mappings, setMappings] = useState(DEFAULT_MAPPINGS)
    const [sensitivity, setSensitivity] = useState(50)
    const [detectedPose, setDetectedPose] = useState({ pitch: 0, yaw: 0, roll: 0 })

    // Mock head motion detection using mouse position
    useEffect(() => {
        if (!isTracking) return

        const handleMouseMove = (e: MouseEvent) => {
            const centerX = window.innerWidth / 2
            const centerY = window.innerHeight / 2
            const yaw = ((e.clientX - centerX) / centerX) * 30
            const pitch = ((e.clientY - centerY) / centerY) * 30
            setDetectedPose({ pitch, yaw, roll: 0 })

            const threshold = (100 - sensitivity) / 100 * 25 + 5
            if (pitch < -threshold && lastMotion !== 'Nod Up') {
                triggerMotion('Nod Up')
            } else if (pitch > threshold && lastMotion !== 'Nod Down') {
                triggerMotion('Nod Down')
            } else if (yaw < -threshold && lastMotion !== 'Tilt Left') {
                triggerMotion('Tilt Left')
            } else if (yaw > threshold && lastMotion !== 'Tilt Right') {
                triggerMotion('Tilt Right')
            } else if (Math.abs(pitch) < threshold / 2 && Math.abs(yaw) < threshold / 2) {
                setLastMotion(null)
            }
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [isTracking, sensitivity, lastMotion])

    const triggerMotion = (motion: string) => {
        setLastMotion(motion)
        const mapping = mappings.find(m => m.motion === motion)
        if (mapping) {
            appendOutput(mapping.action + ' ')
            recordInput('head-motion', true, 500, mapping.action)
            if (navigator.vibrate) navigator.vibrate(50)
        }
    }

    const updateMapping = (index: number, newAction: string) => {
        setMappings(prev => prev.map((m, i) => i === index ? { ...m, action: newAction } : m))
    }

    return (
        <ModePageLayout
            title="Head Motion"
            description="Nod, shake, and tilt your head to input commands. Fully customizable mappings."
            icon={<Move className="h-6 w-6 text-white" />}
            color="bg-amber-500"
            helpContent="Start tracking, then move your head. Nod up/down and tilt left/right trigger mapped actions. In this demo, mouse position simulates head pose."
        >
            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                <div className="space-y-4">
                    <WebcamPreview className="aspect-video" />

                    <Button
                        onClick={() => setIsTracking(!isTracking)}
                        className={`w-full gap-2 font-bold border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all ${isTracking ? 'bg-destructive hover:bg-destructive' : ''
                            }`}
                    >
                        <Move className="h-4 w-4" />
                        {isTracking ? 'Stop Tracking' : 'Start Tracking'}
                    </Button>

                    {/* Pose indicator */}
                    {isTracking && (
                        <Card className="p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex justify-between mb-2">
                                <span className="text-xs font-bold text-muted-foreground">Detected pose:</span>
                                {lastMotion && (
                                    <span className="text-xs font-black bg-primary text-primary-foreground px-2 py-0.5 rounded-lg">{lastMotion}</span>
                                )}
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center">
                                {(['pitch', 'yaw', 'roll'] as const).map(axis => (
                                    <div key={axis} className="p-2 bg-muted rounded-lg">
                                        <p className="text-xs font-bold text-muted-foreground uppercase">{axis}</p>
                                        <p className="text-sm font-black">{detectedPose[axis].toFixed(1)}°</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    <p className="text-xs font-medium text-center text-muted-foreground">
                        💡 Mouse position simulates head pose in this demo. Production uses webcam face tracking.
                    </p>
                </div>

                {/* Config sidebar */}
                <div className="space-y-4">
                    <Card className="p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="font-black text-sm mb-3 flex items-center gap-2">
                            <Settings2 className="h-4 w-4" /> Motion Mappings
                        </h3>
                        <div className="space-y-2">
                            {mappings.map((m, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 w-24">
                                        {m.icon}
                                        <span className="text-xs font-bold">{m.motion}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">→</span>
                                    <input
                                        type="text"
                                        value={m.action}
                                        onChange={(e) => updateMapping(i, e.target.value)}
                                        className="flex-1 px-2 py-1 border-2 border-border rounded-lg text-xs font-bold bg-input"
                                        aria-label={`Action for ${m.motion}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="font-black text-sm mb-2">Sensitivity</h3>
                        <input
                            type="range" min={10} max={90} value={sensitivity}
                            onChange={(e) => setSensitivity(Number(e.target.value))}
                            className="w-full"
                            aria-label="Motion sensitivity"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground font-bold mt-1">
                            <span>Less sensitive</span>
                            <span>More sensitive</span>
                        </div>
                    </Card>
                </div>
            </div>
        </ModePageLayout>
    )
}

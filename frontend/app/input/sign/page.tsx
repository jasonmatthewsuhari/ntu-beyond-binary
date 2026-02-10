'use client'

import React, { useState, useCallback } from 'react'
import { useFluentContext } from '@/lib/fluent-context'
import { recordInput } from '@/lib/adaptive-engine'
import { ModePageLayout } from '@/components/mode-page-layout'
import { WebcamPreview } from '@/components/webcam-preview'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Accessibility, Play, Square, Plus, Globe } from 'lucide-react'

export default function SignPage() {
    const { appendOutput } = useFluentContext()
    const [isInterpreting, setIsInterpreting] = useState(false)
    const [translation, setTranslation] = useState('')
    const [signLanguage, setSignLanguage] = useState('asl')
    const [customGestures, setCustomGestures] = useState<{ name: string; label: string }[]>([
        { name: 'thumbs-up', label: 'Yes / Agree' },
        { name: 'wave', label: 'Hello' },
        { name: 'point-up', label: 'I have a question' },
    ])
    const [newGestureName, setNewGestureName] = useState('')
    const [isRecordingGesture, setIsRecordingGesture] = useState(false)

    const mockTranslations = [
        'Hello, how are you?',
        'Thank you very much.',
        'I need help with this.',
        'Nice to meet you.',
        'Can you repeat that please?',
        'I understand.',
        'Good morning!',
        'See you later.',
    ]

    const handleFrame = useCallback(() => {
        if (!isInterpreting) return
        // Mock: periodically produce translations
    }, [isInterpreting])

    const toggleInterpret = () => {
        if (isInterpreting) {
            setIsInterpreting(false)
        } else {
            setIsInterpreting(true)
            // Mock periodic translations
            const interval = setInterval(() => {
                const text = mockTranslations[Math.floor(Math.random() * mockTranslations.length)]
                setTranslation(text)
                appendOutput(text + ' ')
                recordInput('sign', true, 3000, text)
            }, 4000)
            // Store interval for cleanup
            setTimeout(() => clearInterval(interval), 60000)
                ; (window as any).__signInterval = interval
        }
    }

    const addCustomGesture = () => {
        if (!newGestureName.trim()) return
        setCustomGestures(prev => [...prev, { name: `custom-${Date.now()}`, label: newGestureName }])
        setNewGestureName('')
        setIsRecordingGesture(false)
    }

    return (
        <ModePageLayout
            title="Sign Language"
            description="Use your webcam to sign. Fluent interprets ASL, BSL, and custom gestures in real-time."
            icon={<Accessibility className="h-6 w-6 text-white" />}
            color="bg-pink-500"
            helpContent="Start your camera and click 'Start Interpreting'. Sign naturally — Fluent will translate your gestures. You can also register custom gestures below."
        >
            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                {/* Main area */}
                <div className="space-y-4">
                    {/* Language selector */}
                    <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={signLanguage}
                            onChange={(e) => setSignLanguage(e.target.value)}
                            className="bg-input border-2 border-border rounded-lg px-3 py-1.5 font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            aria-label="Select sign language"
                        >
                            <option value="asl">American Sign Language (ASL)</option>
                            <option value="bsl">British Sign Language (BSL)</option>
                            <option value="isl">International Sign Language</option>
                            <option value="custom">Custom Gestures Only</option>
                        </select>
                    </div>

                    {/* Webcam */}
                    <WebcamPreview onFrame={handleFrame} className="aspect-video" />

                    {/* Controls */}
                    <div className="flex gap-3">
                        <Button
                            onClick={toggleInterpret}
                            className={`flex-1 gap-2 font-bold border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all ${isInterpreting ? 'bg-destructive hover:bg-destructive' : ''
                                }`}
                        >
                            {isInterpreting ? <><Square className="h-4 w-4" /> Stop</> : <><Play className="h-4 w-4" /> Start Interpreting</>}
                        </Button>
                    </div>

                    {/* Translation */}
                    {translation && (
                        <Card className="p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <p className="text-xs font-bold text-muted-foreground mb-1">Translation:</p>
                            <p className="text-lg font-bold">{translation}</p>
                        </Card>
                    )}
                </div>

                {/* Custom gestures sidebar */}
                <div className="space-y-4">
                    <Card className="p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="font-black text-sm mb-3">Custom Gestures</h3>
                        <div className="space-y-2">
                            {customGestures.map((g, i) => (
                                <div key={i} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                                    <span className="text-xs font-bold">{g.label}</span>
                                    <button
                                        onClick={() => setCustomGestures(prev => prev.filter((_, j) => j !== i))}
                                        className="text-xs text-destructive font-bold"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        {isRecordingGesture ? (
                            <div className="mt-3 space-y-2">
                                <input
                                    type="text"
                                    value={newGestureName}
                                    onChange={(e) => setNewGestureName(e.target.value)}
                                    placeholder="Gesture meaning (e.g. 'Water')"
                                    className="w-full px-3 py-2 border-2 border-border rounded-lg text-sm font-medium bg-input"
                                    aria-label="Gesture name"
                                />
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={addCustomGesture} className="flex-1 font-bold text-xs border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                        Save
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setIsRecordingGesture(false)} className="flex-1 font-bold text-xs border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <Button
                                size="sm"
                                onClick={() => setIsRecordingGesture(true)}
                                className="w-full mt-3 gap-1 font-bold text-xs border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
                            >
                                <Plus className="h-3 w-3" /> Add Custom Gesture
                            </Button>
                        )}
                    </Card>

                    <Card className="p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="font-black text-sm mb-2">Tips</h3>
                        <ul className="space-y-1.5 text-xs font-medium text-muted-foreground">
                            <li>• Good lighting improves accuracy</li>
                            <li>• Keep hands within frame</li>
                            <li>• Sign at a natural pace</li>
                            <li>• Register custom gestures for personal vocabulary</li>
                        </ul>
                    </Card>
                </div>
            </div>
        </ModePageLayout>
    )
}

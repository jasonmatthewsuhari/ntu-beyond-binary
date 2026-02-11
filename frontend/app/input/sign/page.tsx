'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useFluentContext } from '@/lib/fluent-context'
import { recordInput } from '@/lib/adaptive-engine'
import { useWebSocket } from '@/lib/use-websocket'
import { ModePageLayout } from '@/components/mode-page-layout'
import { WebcamPreview } from '@/components/webcam-preview'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Accessibility, Play, Square, Plus, Globe, Send } from 'lucide-react'

export default function SignPage() {
    const { appendOutput } = useFluentContext()
    const [isInterpreting, setIsInterpreting] = useState(true) // Start interpreting by default for mockup
    const [translation, setTranslation] = useState('')
    const [signLanguage, setSignLanguage] = useState('asl')

    const { isConnected, executeQuery } = useWebSocket({
        inputMethod: 'sign',
        onExecutionResult: (result) => {
            console.log('Sign query executed:', result)
        }
    })
    const [customGestures, setCustomGestures] = useState<{ name: string; label: string }[]>([
        { name: 'thumbs-up', label: 'Yes / Agree' },
        { name: 'wave', label: 'Hello' },
        { name: 'point-up', label: 'I have a question' },
    ])
    const [newGestureName, setNewGestureName] = useState('')
    const [isRecordingGesture, setIsRecordingGesture] = useState(false)
    const [displayedWords, setDisplayedWords] = useState<string[]>([])

    const handleFrame = useCallback(() => {
        if (!isInterpreting) return
        // TODO: Implement actual sign language recognition using MediaPipe
        // Would process webcam frames and detect hand landmarks
    }, [isInterpreting])

    const toggleInterpret = () => {
        setIsInterpreting(!isInterpreting)
        if (!isInterpreting) {
            // Clear previous translation when starting
            setTranslation('')
            setDisplayedWords([])
        }
    }
    
    // Manual add word for testing (simulates real-time sign detection)
    const addWord = (word: string) => {
        setDisplayedWords(prev => [...prev, word])
        const newTranslation = [...displayedWords, word].join(' ')
        setTranslation(newTranslation)
    }
    
    // Execute translation
    const executeTranslation = () => {
        if (translation.trim()) {
            appendOutput(translation + ' ')
            recordInput('sign', true, 3000, translation)
            executeQuery(translation)
            setDisplayedWords([])
            setTranslation('')
        }
    }

    const addCustomGesture = () => {
        if (!newGestureName.trim()) return
        setCustomGestures(prev => [...prev, { name: `custom-${Date.now()}`, label: newGestureName }])
        setNewGestureName('')
        setIsRecordingGesture(false)
    }

    return (
        <>
            <style jsx>{`
                .scrollable-words::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
            <ModePageLayout
                title="Sign Language"
                icon={<Accessibility className="h-6 w-6 text-white" />}
                color="bg-pink-500"
                helpContent="Start your camera and click 'Start Interpreting'. Sign naturally — Fluent will translate your gestures. You can also register custom gestures below."
            >
                <div className="space-y-6">
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

                {/* Translation Display - Horizontal Scrollable Word Boxes */}
                <Card className="p-0 border-4 border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative">
                    <div className="p-6">
                        <p className="text-xs font-bold text-muted-foreground mb-4">Real-time Translation:</p>
                        
                        {/* Scrollable container with fade effects */}
                        <div className="relative min-h-[200px] flex items-center">
                            {/* Left fade */}
                            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                            
                            {/* Right fade */}
                            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
                            
                            {/* Scrollable word boxes */}
                            <div 
                                className="flex gap-4 overflow-x-auto pb-2 px-12 scrollable-words"
                                style={{ 
                                    scrollbarWidth: 'none',
                                    msOverflowStyle: 'none',
                                    WebkitOverflowScrolling: 'touch'
                                }}
                            >
                                {displayedWords.map((word, index) => (
                                    <div
                                        key={index}
                                        className="flex-shrink-0 px-8 py-6 bg-primary text-primary-foreground rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-in fade-in zoom-in duration-500"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <span className="text-4xl font-black whitespace-nowrap">{word}</span>
                                    </div>
                                ))}
                                
                                {/* Cursor */}
                                {displayedWords.length > 0 && displayedWords.length < 3 && (
                                    <div className="flex-shrink-0 flex items-center">
                                        <div className="w-2 h-16 bg-primary animate-pulse rounded-full" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Status indicator */}
                    {isInterpreting && (
                        <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg border-2 border-white shadow-lg">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            <span className="text-xs font-bold">INTERPRETING</span>
                        </div>
                    )}
                </Card>

                {/* Controls */}
                <div className="flex gap-3">
                    <Button
                        onClick={toggleInterpret}
                        className={`flex-1 gap-2 font-bold border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all ${isInterpreting ? 'bg-destructive hover:bg-destructive' : ''
                            }`}
                    >
                        {isInterpreting ? <><Square className="h-4 w-4" /> Stop</> : <><Play className="h-4 w-4" /> Start Interpreting</>}
                    </Button>
                    <Button
                        onClick={executeTranslation}
                        disabled={!translation.trim() || !isConnected}
                        variant="outline"
                        className="gap-2 font-bold border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                        <Send className="h-4 w-4" /> Execute
                    </Button>
                </div>
            </div>

            {/* Quick test words for manual signing */}
            <Card className="p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="font-black text-sm mb-3">Quick Words (Click to Add)</h3>
                <div className="flex flex-wrap gap-2">
                    {['Hello', 'Help', 'Yes', 'No', 'Please', 'Thank you', 'Water', 'Food', 'Pain', 'Doctor', 'Emergency', 'Call'].map(word => (
                        <button
                            key={word}
                            onClick={() => addWord(word)}
                            className="px-3 py-1.5 bg-muted border-2 border-border rounded-lg font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                        >
                            {word}
                        </button>
                    ))}
                </div>
            </Card>

            {/* Custom Gestures */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="font-black text-sm mb-3">Custom Gestures</h3>
                    <div className="space-y-2 max-h-[120px] overflow-y-auto">
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
                
                <Card className="p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="font-black text-sm mb-2">Status</h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-muted-foreground">Language:</span>
                            <span className="text-xs font-black">{signLanguage.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-muted-foreground">Words detected:</span>
                            <span className="text-xs font-black">{displayedWords.length}</span>
                        </div>
                    </div>
                </Card>
            </div>
            </ModePageLayout>
        </>
    )
}

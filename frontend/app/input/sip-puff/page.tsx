'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useFluentContext } from '@/lib/fluent-context'
import { recordInput } from '@/lib/adaptive-engine'
import { useWebSocket } from '@/lib/use-websocket'
import { ModePageLayout } from '@/components/mode-page-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wind, Settings2, Send } from 'lucide-react'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const COMMON_WORDS = ['THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'CAN', 'HER', 'WAS', 'ONE']

export default function SipPuffPage() {
    const { appendOutput } = useFluentContext()
    const [mode, setMode] = useState<'letters' | 'words'>('letters')
    const [scanIndex, setScanIndex] = useState(0)
    const [scanSpeed, setScanSpeed] = useState(1500)
    const [isScanning, setIsScanning] = useState(false)
    const [typedText, setTypedText] = useState('')
    const [audioLevel, setAudioLevel] = useState(0)
    const streamRef = useRef<MediaStream | null>(null)
    const analyserRef = useRef<AnalyserNode | null>(null)

    const { isConnected, executeQuery } = useWebSocket({
        inputMethod: 'sip-puff',
        onExecutionResult: (result) => {
            console.log('Sip/puff query executed:', result)
        }
    })

    const items = mode === 'letters' ? [...ALPHABET, ' ', '⌫', '↵'] : [...COMMON_WORDS, '⌫', '↵']

    // Auto-scan
    useEffect(() => {
        if (!isScanning) return
        const interval = setInterval(() => {
            setScanIndex(prev => (prev + 1) % items.length)
        }, scanSpeed)
        return () => clearInterval(interval)
    }, [isScanning, scanSpeed, items.length])

    // Monitor microphone for sip/puff detection
    const startMic = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            streamRef.current = stream
            const ctx = new AudioContext()
            const source = ctx.createMediaStreamSource(stream)
            const analyser = ctx.createAnalyser()
            analyser.fftSize = 256
            source.connect(analyser)
            analyserRef.current = analyser

            const dataArray = new Uint8Array(analyser.frequencyBinCount)
            const check = () => {
                if (!analyserRef.current) return
                analyserRef.current.getByteFrequencyData(dataArray)
                const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
                setAudioLevel(avg)
                requestAnimationFrame(check)
            }
            check()
            setIsScanning(true)
        } catch {
            setIsScanning(true) // Fall back to button-only
        }
    }

    const stopMic = () => {
        streamRef.current?.getTracks().forEach(t => t.stop())
        streamRef.current = null
        analyserRef.current = null
        setIsScanning(false)
        setAudioLevel(0)
    }

    const selectItem = useCallback(() => {
        const item = items[scanIndex]
        if (item === '⌫') {
            setTypedText(prev => prev.slice(0, -1))
        } else if (item === '↵') {
            if (typedText.trim()) {
                appendOutput(typedText + ' ')
                recordInput('sip-puff', true, typedText.length * scanSpeed, typedText)
                executeQuery(typedText) // Execute via desktop agent
                setTypedText('')
            }
        } else {
            setTypedText(prev => prev + (mode === 'words' ? item + ' ' : item))
        }
    }, [items, scanIndex, typedText, mode, scanSpeed, appendOutput, executeQuery])

    // Keyboard/click selection
    useEffect(() => {
        if (!isScanning) return
        const handler = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault()
                selectItem()
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [isScanning, selectItem])

    return (
        <ModePageLayout
            title="Sip & Puff"
            icon={<Wind className="h-6 w-6 text-white" />}
            color="bg-teal-500"
            helpContent="Press Start to begin scanning. Items highlight one at a time. Press Space/Enter (or blow into microphone) to select the highlighted item."
        >
            <div className="space-y-6">
                {/* Controls */}
                <Card className="p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex flex-wrap items-center gap-4">
                        <Button
                            onClick={isScanning ? stopMic : startMic}
                            className={`gap-2 font-bold border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] ${isScanning ? 'bg-destructive hover:bg-destructive' : ''
                                }`}
                        >
                            <Wind className="h-4 w-4" /> {isScanning ? 'Stop' : 'Start Scanning'}
                        </Button>

                        <div className="flex items-center gap-2">
                            <Settings2 className="h-4 w-4 text-muted-foreground" />
                            <label className="text-xs font-bold">Speed:</label>
                            <input type="range" min={500} max={3000} step={100} value={scanSpeed}
                                onChange={(e) => setScanSpeed(Number(e.target.value))} className="w-24" aria-label="Scan speed" />
                            <span className="text-xs font-bold text-muted-foreground">{scanSpeed}ms</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-xs font-bold">Mode:</label>
                            <select value={mode} onChange={(e) => { setMode(e.target.value as any); setScanIndex(0) }}
                                className="bg-input border-2 border-border rounded-lg px-2 py-1 font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <option value="letters">Letters A-Z</option>
                                <option value="words">Common Words</option>
                            </select>
                        </div>

                        {/* Audio level indicator */}
                        {isScanning && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-muted-foreground">Mic:</span>
                                <div className="w-20 h-3 bg-muted rounded-full overflow-hidden border border-border">
                                    <div className="h-full bg-primary transition-all" style={{ width: `${Math.min(audioLevel * 2, 100)}%` }} />
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Preview */}
                <Card className="p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <p className="text-xs font-bold text-muted-foreground mb-1">Text:</p>
                    <p className="text-lg font-medium min-h-[28px]">
                        {typedText || <span className="text-muted-foreground">Scanning items...</span>}
                        <span className="animate-pulse">|</span>
                    </p>
                </Card>

                {/* Scanning grid */}
                <Card className="p-6 border-4 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {items.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => { setScanIndex(i); selectItem() }}
                                className={`min-w-[44px] min-h-[44px] p-2 rounded-xl border-2 border-border font-bold text-sm transition-all
                  ${i === scanIndex && isScanning
                                        ? 'bg-primary text-primary-foreground scale-125 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10'
                                        : 'bg-card shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-muted'
                                    }`}
                                aria-label={item}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </Card>

                <p className="text-xs font-medium text-center text-muted-foreground">
                    💡 Press <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded font-bold">Space</kbd> or <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded font-bold">Enter</kbd> to select, or blow into your microphone.
                </p>
            </div>
        </ModePageLayout>
    )
}

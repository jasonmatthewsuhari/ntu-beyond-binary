'use client'

import React, { useState, useRef, useCallback } from 'react'
import { useFluentContext } from '@/lib/fluent-context'
import { recordInput } from '@/lib/adaptive-engine'
import { ModePageLayout } from '@/components/mode-page-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Hand, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

const MORSE_MAP: Record<string, string> = {
    '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E',
    '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
    '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O',
    '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
    '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y',
    '--..': 'Z', '.----': '1', '..---': '2', '...--': '3', '....-': '4',
    '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9',
    '-----': '0',
}

export default function HapticPage() {
    const { appendOutput, settings } = useFluentContext()
    const { morseThresholds } = settings
    const [currentMorse, setCurrentMorse] = useState('')
    const [morseHistory, setMorseHistory] = useState('')
    const [isPressing, setIsPressing] = useState(false)
    const [showReference, setShowReference] = useState(false)
    const [feedback, setFeedback] = useState<'dot' | 'dash' | null>(null)
    const pressStart = useRef(0)
    const letterTimer = useRef<NodeJS.Timeout | null>(null)
    const wordTimer = useRef<NodeJS.Timeout | null>(null)

    const decodeMorse = useCallback((morse: string) => {
        const char = MORSE_MAP[morse] || '?'
        appendOutput(char)
        setMorseHistory(prev => `${prev} ${morse}`)
        setCurrentMorse('')
        recordInput('haptic', char !== '?', Date.now() - pressStart.current, char)
    }, [appendOutput])

    const handlePressStart = () => {
        setIsPressing(true)
        pressStart.current = Date.now()
        if (letterTimer.current) clearTimeout(letterTimer.current)
        if (wordTimer.current) clearTimeout(wordTimer.current)
    }

    const handlePressEnd = () => {
        setIsPressing(false)
        const duration = Date.now() - pressStart.current
        const signal = duration >= morseThresholds.dash ? '-' : '.'
        setCurrentMorse(prev => prev + signal)
        setFeedback(signal === '.' ? 'dot' : 'dash')
        setTimeout(() => setFeedback(null), 300)

        // Vibration feedback
        if (navigator.vibrate) navigator.vibrate(signal === '.' ? 50 : 150)

        letterTimer.current = setTimeout(() => {
            setCurrentMorse(prev => { if (prev) decodeMorse(prev); return '' })
        }, morseThresholds.letterGap)

        wordTimer.current = setTimeout(() => {
            appendOutput(' ')
        }, morseThresholds.wordGap)
    }

    const clear = () => {
        setCurrentMorse('')
        setMorseHistory('')
        if (letterTimer.current) clearTimeout(letterTimer.current)
        if (wordTimer.current) clearTimeout(wordTimer.current)
    }

    return (
        <ModePageLayout
            title="Haptic / Morse"
            description="Tap for dot, hold for dash. Communicate using Morse code with customizable timing."
            icon={<Hand className="h-6 w-6 text-white" />}
            color="bg-purple-500"
            helpContent="Quick tap = dot (·), long press = dash (—). After a pause, the letter is decoded. A longer pause adds a space between words. Customize timing in Settings."
        >
            <div className="grid gap-6 md:grid-cols-[1fr_280px]">
                <Card className="p-6 border-4 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-6">
                    {/* Current buffer */}
                    <div className="w-full p-4 bg-input border-4 border-border rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
                        <p className="text-3xl font-mono font-black tracking-[0.5em]">
                            {currentMorse || <span className="text-muted-foreground">Ready...</span>}
                        </p>
                    </div>

                    {/* Feedback indicator */}
                    <div className="flex gap-4 items-center">
                        <div className={`w-6 h-6 rounded-full border-2 border-border transition-all ${feedback === 'dot' ? 'bg-primary scale-125' : 'bg-muted'}`} />
                        <div className={`w-12 h-6 rounded-full border-2 border-border transition-all ${feedback === 'dash' ? 'bg-primary scale-110' : 'bg-muted'}`} />
                    </div>

                    {/* Main tap button */}
                    <button
                        onMouseDown={handlePressStart}
                        onMouseUp={handlePressEnd}
                        onMouseLeave={() => isPressing && handlePressEnd()}
                        onTouchStart={(e) => { e.preventDefault(); handlePressStart() }}
                        onTouchEnd={(e) => { e.preventDefault(); handlePressEnd() }}
                        className={`h-36 w-36 rounded-full border-4 border-border flex items-center justify-center transition-all select-none
              shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
              ${isPressing
                                ? 'bg-accent scale-95 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[4px] translate-y-[4px]'
                                : 'bg-purple-500 hover:bg-purple-600'
                            }`}
                        aria-label="Press for morse code input"
                    >
                        <Hand className="h-14 w-14 text-white" />
                    </button>

                    <p className="text-sm font-bold text-muted-foreground">
                        {isPressing ? 'Release for signal...' : 'Tap or hold'}
                    </p>

                    {/* History */}
                    {morseHistory && (
                        <div className="w-full p-3 bg-input border-2 border-border rounded-xl">
                            <p className="text-xs font-bold text-muted-foreground mb-1">Morse history:</p>
                            <p className="font-mono text-sm font-medium break-all">{morseHistory}</p>
                        </div>
                    )}

                    <Button variant="outline" onClick={clear} className="gap-2 font-bold border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]">
                        <Trash2 className="h-4 w-4" /> Clear
                    </Button>
                </Card>

                {/* Reference */}
                <div className="space-y-4">
                    <Card className="p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <button
                            onClick={() => setShowReference(!showReference)}
                            className="flex items-center justify-between w-full"
                        >
                            <h3 className="font-black text-sm">Morse Reference</h3>
                            {showReference ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                        {showReference && (
                            <div className="mt-3 grid grid-cols-2 gap-1 text-xs font-mono">
                                {Object.entries(MORSE_MAP).map(([code, char]) => (
                                    <div key={code} className="flex justify-between px-2 py-0.5 rounded hover:bg-muted">
                                        <span className="font-bold">{char}</span>
                                        <span className="text-muted-foreground">{code}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                    <Card className="p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="font-black text-sm mb-2">Timing</h3>
                        <div className="space-y-1 text-xs font-medium text-muted-foreground">
                            <p>Dot: &lt; {morseThresholds.dash}ms</p>
                            <p>Dash: ≥ {morseThresholds.dash}ms</p>
                            <p>Letter gap: {morseThresholds.letterGap}ms</p>
                            <p>Word gap: {morseThresholds.wordGap}ms</p>
                            <p className="text-primary font-bold mt-2">Customize in Settings →</p>
                        </div>
                    </Card>
                </div>
            </div>
        </ModePageLayout>
    )
}

'use client'

import React, { useState } from 'react'
import { useFluentContext } from '@/lib/fluent-context'
import { recordInput } from '@/lib/adaptive-engine'
import { ModePageLayout } from '@/components/mode-page-layout'
import { WebcamPreview } from '@/components/webcam-preview'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Smile, Play, Square, Settings2 } from 'lucide-react'

interface ExpressionMapping {
    expression: string
    emoji: string
    action: string
}

const DEFAULT_EXPRESSIONS: ExpressionMapping[] = [
    { expression: 'Smile', emoji: '😊', action: 'Yes' },
    { expression: 'Frown', emoji: '😟', action: 'No' },
    { expression: 'Eyebrow Raise', emoji: '🤨', action: 'Help' },
    { expression: 'Mouth Open', emoji: '😮', action: 'Wow' },
    { expression: 'Blink ×2', emoji: '😑', action: 'Enter' },
    { expression: 'Wink Left', emoji: '😉', action: 'Yes' },
    { expression: 'Wink Right', emoji: '😏', action: 'No' },
    { expression: 'Pout', emoji: '😤', action: 'Undo' },
]

export default function FacialPage() {
    const { appendOutput } = useFluentContext()
    const [isDetecting, setIsDetecting] = useState(false)
    const [expressions, setExpressions] = useState(DEFAULT_EXPRESSIONS)
    const [lastExpression, setLastExpression] = useState<string | null>(null)
    const [detectionLog, setDetectionLog] = useState<string[]>([])

    const toggleDetection = () => {
        if (isDetecting) {
            setIsDetecting(false)
        } else {
            setIsDetecting(true)
            // Mock: random expression detection every few seconds
            const interval = setInterval(() => {
                const expr = expressions[Math.floor(Math.random() * expressions.length)]
                setLastExpression(expr.expression)
                appendOutput(expr.action + ' ')
                setDetectionLog(prev => [`${expr.emoji} ${expr.expression} → "${expr.action}"`, ...prev.slice(0, 9)])
                recordInput('facial', true, 2000, expr.action)
            }, 3500)
            setTimeout(() => clearInterval(interval), 60000)
        }
    }

    const updateMapping = (index: number, newAction: string) => {
        setExpressions(prev => prev.map((e, i) => i === index ? { ...e, action: newAction } : e))
    }

    // Direct trigger for demo
    const triggerExpression = (expr: ExpressionMapping) => {
        setLastExpression(expr.expression)
        appendOutput(expr.action + ' ')
        setDetectionLog(prev => [`${expr.emoji} ${expr.expression} → "${expr.action}"`, ...prev.slice(0, 9)])
        recordInput('facial', true, 500, expr.action)
    }

    return (
        <ModePageLayout
            title="Facial Expression"
            description="Use facial expressions to input commands. Smile, frown, blink, and more — all customizable."
            icon={<Smile className="h-6 w-6 text-white" />}
            color="bg-rose-500"
            helpContent="Start detection and make facial expressions. Each expression triggers a mapped action. You can also click expressions directly below to trigger them manually."
        >
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="space-y-4">
                    <WebcamPreview className="aspect-video" />

                    <Button
                        onClick={toggleDetection}
                        className={`w-full gap-2 font-bold border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all ${isDetecting ? 'bg-destructive hover:bg-destructive' : ''
                            }`}
                    >
                        {isDetecting ? <><Square className="h-4 w-4" /> Stop Detection</> : <><Play className="h-4 w-4" /> Start Detection</>}
                    </Button>

                    {/* Manual trigger grid */}
                    <Card className="p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="font-black text-sm mb-3">Quick Trigger (click to activate)</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {expressions.map((expr, i) => (
                                <button
                                    key={i}
                                    onClick={() => triggerExpression(expr)}
                                    className={`p-3 rounded-xl border-2 border-border text-center transition-all
                    shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]
                    ${lastExpression === expr.expression ? 'bg-primary text-primary-foreground scale-105' : 'bg-card hover:bg-muted'}`}
                                    aria-label={`Trigger ${expr.expression}`}
                                >
                                    <div className="text-2xl mb-1">{expr.emoji}</div>
                                    <div className="text-[10px] font-bold leading-tight">{expr.expression}</div>
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    <Card className="p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="font-black text-sm mb-3 flex items-center gap-2">
                            <Settings2 className="h-4 w-4" /> Expression Mappings
                        </h3>
                        <div className="space-y-2">
                            {expressions.map((e, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <span className="text-lg">{e.emoji}</span>
                                    <span className="text-xs font-bold flex-shrink-0 w-20">{e.expression}</span>
                                    <span className="text-xs text-muted-foreground">→</span>
                                    <input
                                        type="text"
                                        value={e.action}
                                        onChange={(ev) => updateMapping(i, ev.target.value)}
                                        className="flex-1 px-2 py-1 border-2 border-border rounded-lg text-xs font-bold bg-input min-w-0"
                                        aria-label={`Action for ${e.expression}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>

                    {detectionLog.length > 0 && (
                        <Card className="p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="font-black text-sm mb-2">Detection Log</h3>
                            <div className="space-y-1 max-h-[200px] overflow-y-auto">
                                {detectionLog.map((entry, i) => (
                                    <p key={i} className="text-xs font-medium text-muted-foreground">{entry}</p>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </ModePageLayout>
    )
}

'use client'

import React, { useState, useCallback } from 'react'
import { useFluentContext } from '@/lib/fluent-context'
import { recordInput } from '@/lib/adaptive-engine'
import { ModePageLayout } from '@/components/mode-page-layout'
import { OnScreenKeyboard } from '@/components/on-screen-keyboard'
import { Card } from '@/components/ui/card'
import { Eye, Settings2 } from 'lucide-react'

export default function EyeGazePage() {
    const { appendOutput, settings } = useFluentContext()
    const [typedText, setTypedText] = useState('')
    const [dwellTime, setDwellTime] = useState(settings.dwellTime)
    const [layout, setLayout] = useState<'qwerty' | 'alphabetical'>('qwerty')

    const handleKey = useCallback((key: string) => {
        if (key === '\b') {
            setTypedText(prev => prev.slice(0, -1))
        } else if (key === '\n') {
            appendOutput(typedText + ' ')
            recordInput('eye-gaze', true, typedText.length * dwellTime, typedText)
            setTypedText('')
        } else {
            setTypedText(prev => prev + key)
        }
    }, [appendOutput, typedText, dwellTime])

    return (
        <ModePageLayout
            title="Eye Gaze"
            description="Look at keys to type. Dwell on a key to select it. Mocked with mouse hover."
            icon={<Eye className="h-6 w-6 text-white" />}
            color="bg-cyan-500"
            helpContent="Hover over a key and hold still. After the dwell time, the key will be selected. Adjust dwell time below. In production, this uses webcam-based eye tracking."
        >
            <div className="space-y-6">
                {/* Settings */}
                <Card className="p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Settings2 className="h-4 w-4 text-muted-foreground" />
                            <label className="text-xs font-bold">Dwell Time:</label>
                            <input
                                type="range" min={400} max={3000} step={100} value={dwellTime}
                                onChange={(e) => setDwellTime(Number(e.target.value))}
                                className="w-32"
                                aria-label="Dwell time"
                            />
                            <span className="text-xs font-bold text-muted-foreground">{dwellTime}ms</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-bold">Layout:</label>
                            <select
                                value={layout}
                                onChange={(e) => setLayout(e.target.value as 'qwerty' | 'alphabetical')}
                                className="bg-input border-2 border-border rounded-lg px-2 py-1 font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            >
                                <option value="qwerty">QWERTY</option>
                                <option value="alphabetical">A-Z</option>
                            </select>
                        </div>
                    </div>
                </Card>

                {/* Text preview */}
                <Card className="p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <p className="text-xs font-bold text-muted-foreground mb-1">Preview:</p>
                    <p className="text-lg font-medium min-h-[28px]">
                        {typedText || <span className="text-muted-foreground">Hover over keys to type...</span>}
                        <span className="animate-pulse">|</span>
                    </p>
                </Card>

                {/* Keyboard */}
                <Card className="p-6 border-4 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <OnScreenKeyboard
                        onKeyPress={handleKey}
                        mode="dwell"
                        dwellTime={dwellTime}
                        layout={layout}
                    />
                </Card>

                <p className="text-xs font-medium text-center text-muted-foreground">
                    💡 In this demo, mouse hover simulates eye gaze. In production, webcam-based eye tracking is used.
                </p>
            </div>
        </ModePageLayout>
    )
}

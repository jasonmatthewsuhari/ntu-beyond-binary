'use client'

import React, { useState, useCallback } from 'react'
import { useFluentContext } from '@/lib/fluent-context'
import { recordInput } from '@/lib/adaptive-engine'
import { ModePageLayout } from '@/components/mode-page-layout'
import { OnScreenKeyboard } from '@/components/on-screen-keyboard'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ToggleLeft, Settings2 } from 'lucide-react'

export default function SwitchPage() {
    const { appendOutput, settings } = useFluentContext()
    const [typedText, setTypedText] = useState('')
    const [scanSpeed, setScanSpeed] = useState(settings.scanSpeed)
    const [layout, setLayout] = useState<'qwerty' | 'alphabetical'>('alphabetical')
    const [activationKey, setActivationKey] = useState('Space')

    const handleKey = useCallback((key: string) => {
        if (key === '\b') {
            setTypedText(prev => prev.slice(0, -1))
        } else if (key === '\n') {
            appendOutput(typedText + ' ')
            recordInput('switch', true, typedText.length * scanSpeed, typedText)
            setTypedText('')
        } else {
            setTypedText(prev => prev + key)
        }
    }, [appendOutput, typedText, scanSpeed])

    return (
        <ModePageLayout
            title="Switch Scanning"
            description="Single-button input. Items highlight sequentially — press any key to select."
            icon={<ToggleLeft className="h-6 w-6 text-white" />}
            color="bg-indigo-500"
            helpContent="Keys highlight one at a time automatically. Press Space or Enter (or any configured switch) to select the highlighted key. Works with any single-button assistive device."
        >
            <div className="space-y-6">
                {/* Settings */}
                <Card className="p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Settings2 className="h-4 w-4 text-muted-foreground" />
                            <label className="text-xs font-bold">Scan Speed:</label>
                            <input type="range" min={500} max={4000} step={100} value={scanSpeed}
                                onChange={(e) => setScanSpeed(Number(e.target.value))} className="w-32" aria-label="Scan speed" />
                            <span className="text-xs font-bold text-muted-foreground">{scanSpeed}ms</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-bold">Layout:</label>
                            <select value={layout} onChange={(e) => setLayout(e.target.value as any)}
                                className="bg-input border-2 border-border rounded-lg px-2 py-1 font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <option value="qwerty">QWERTY</option>
                                <option value="alphabetical">A-Z</option>
                            </select>
                        </div>
                    </div>
                </Card>

                {/* Preview */}
                <Card className="p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <p className="text-xs font-bold text-muted-foreground mb-1">Text:</p>
                    <p className="text-lg font-medium min-h-[28px]">
                        {typedText || <span className="text-muted-foreground">Press Space/Enter when the right key is highlighted...</span>}
                        <span className="animate-pulse">|</span>
                    </p>
                </Card>

                {/* Keyboard */}
                <Card className="p-6 border-4 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <OnScreenKeyboard
                        onKeyPress={handleKey}
                        mode="scan"
                        scanSpeed={scanSpeed}
                        layout={layout}
                    />
                </Card>

                <p className="text-xs font-medium text-center text-muted-foreground">
                    💡 Press <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded font-bold">Space</kbd> or <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded font-bold">Enter</kbd> to select the highlighted key. Compatible with any single-button switch device.
                </p>
            </div>
        </ModePageLayout>
    )
}

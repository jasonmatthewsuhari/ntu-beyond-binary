'use client'

import React, { useState } from 'react'
import { useFluentContext } from '@/lib/fluent-context'
import { recordInput } from '@/lib/adaptive-engine'
import { ModePageLayout } from '@/components/mode-page-layout'
import { WebcamPreview } from '@/components/webcam-preview'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, Plus, Trash2, Play, Square } from 'lucide-react'

interface CustomInput {
    id: string
    name: string
    output: string
    triggerCount: number
}

export default function CustomPage() {
    const { appendOutput } = useFluentContext()
    const [customInputs, setCustomInputs] = useState<CustomInput[]>([
        { id: '1', name: 'Thumbs up', output: 'Yes, I agree!', triggerCount: 0 },
        { id: '2', name: 'Open palm', output: 'Stop, please.', triggerCount: 0 },
        { id: '3', name: 'Peace sign', output: 'Thank you!', triggerCount: 0 },
    ])
    const [isRecording, setIsRecording] = useState(false)
    const [newName, setNewName] = useState('')
    const [newOutput, setNewOutput] = useState('')
    const [showAddForm, setShowAddForm] = useState(false)

    const addCustomInput = () => {
        if (!newName.trim() || !newOutput.trim()) return
        setCustomInputs(prev => [...prev, {
            id: Date.now().toString(),
            name: newName,
            output: newOutput,
            triggerCount: 0,
        }])
        setNewName('')
        setNewOutput('')
        setShowAddForm(false)
        setIsRecording(false)
    }

    const removeCustomInput = (id: string) => {
        setCustomInputs(prev => prev.filter(i => i.id !== id))
    }

    const triggerInput = (input: CustomInput) => {
        appendOutput(input.output + ' ')
        setCustomInputs(prev => prev.map(i => i.id === input.id ? { ...i, triggerCount: i.triggerCount + 1 } : i))
        recordInput('custom', true, 500, input.output)
        if (navigator.vibrate) navigator.vibrate(50)
    }

    return (
        <ModePageLayout
            title="Custom Input"
            description="Create your own input methods. Record any gesture, motion, or signal → map it to text."
            icon={<Sparkles className="h-6 w-6 text-white" />}
            color="bg-violet-500"
            helpContent="Record a unique gesture via webcam and assign it a text output. Any repeatable motion can become an input method."
        >
            <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
                {/* Recording area */}
                <div className="space-y-4">
                    <WebcamPreview className="aspect-video" />

                    {isRecording ? (
                        <Card className="p-4 border-4 border-destructive shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
                                <p className="font-bold text-sm">Recording gesture...</p>
                            </div>
                            <p className="text-xs text-muted-foreground">Perform your gesture in front of the camera, then click Save.</p>
                            <div className="space-y-2">
                                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Gesture name (e.g. 'Thumbs up')" aria-label="Gesture name"
                                    className="w-full px-3 py-2 border-2 border-border rounded-lg text-sm font-medium bg-input" />
                                <input type="text" value={newOutput} onChange={(e) => setNewOutput(e.target.value)}
                                    placeholder="Output text (e.g. 'I agree!')" aria-label="Output text"
                                    className="w-full px-3 py-2 border-2 border-border rounded-lg text-sm font-medium bg-input" />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={addCustomInput} className="flex-1 font-bold border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                    Save Gesture
                                </Button>
                                <Button variant="outline" onClick={() => { setIsRecording(false); setShowAddForm(false) }}
                                    className="font-bold border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                    Cancel
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        <Button
                            onClick={() => { setIsRecording(true); setShowAddForm(true) }}
                            className="w-full gap-2 font-bold border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                        >
                            <Plus className="h-4 w-4" /> Record New Gesture
                        </Button>
                    )}
                </div>

                {/* Custom inputs list */}
                <div className="space-y-4">
                    <Card className="p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="font-black text-sm mb-3">My Custom Inputs ({customInputs.length})</h3>
                        <div className="space-y-2">
                            {customInputs.map(input => (
                                <div key={input.id} className="flex items-center gap-2 p-2 bg-muted rounded-lg group">
                                    <button
                                        onClick={() => triggerInput(input)}
                                        className="flex-1 text-left"
                                        aria-label={`Trigger: ${input.name}`}
                                    >
                                        <p className="text-sm font-bold">{input.name}</p>
                                        <p className="text-xs text-muted-foreground">→ &quot;{input.output}&quot;</p>
                                    </button>
                                    <span className="text-xs font-bold text-muted-foreground">{input.triggerCount}×</span>
                                    <button
                                        onClick={() => removeCustomInput(input.id)}
                                        className="p-1 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label={`Delete ${input.name}`}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="font-black text-sm mb-2">How it works</h3>
                        <ol className="space-y-1.5 text-xs font-medium text-muted-foreground list-decimal list-inside">
                            <li>Start camera and click &quot;Record New Gesture&quot;</li>
                            <li>Perform your gesture in front of the camera</li>
                            <li>Name your gesture and set the output text</li>
                            <li>Save — now Fluent will recognize it!</li>
                        </ol>
                        <p className="text-xs font-medium text-muted-foreground mt-2">
                            💡 You can click any saved gesture to trigger it manually.
                        </p>
                    </Card>
                </div>
            </div>
        </ModePageLayout>
    )
}

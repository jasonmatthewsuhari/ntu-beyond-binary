'use client'

import React, { useState } from 'react'
import { useFluentContext } from '@/lib/fluent-context'
import { executeOnDesktop } from '@/lib/use-electron'
import { Button } from '@/components/ui/button'
import {
    Volume2, VolumeX, Copy, Trash2, Undo2, Redo2,
    ChevronUp, ChevronDown, Play, Terminal
} from 'lucide-react'

export function OutputPanel() {
    const { output, clearOutput, undoOutput, redoOutput, speak, stopSpeaking, isSpeaking } = useFluentContext()
    const [expanded, setExpanded] = useState(false)

    const wordCount = output.text.trim() ? output.text.trim().split(/\s+/).length : 0
    const charCount = output.text.length

    const copyToClipboard = async () => {
        if (!output.text) return
        try {
            await navigator.clipboard.writeText(output.text)
        } catch (err) {
            // Clipboard permission denied - this is expected in some browsers/contexts
            console.log('Clipboard access not available')
        }
    }

    const handleExecute = async () => {
        if (!output.text) return
        const result = await executeOnDesktop(output.text)
        console.log('Desktop execution result:', result)
    }

    return (
        <div className="border-t-4 border-border bg-card flex-shrink-0" role="region" aria-label="Output panel">
            {/* Toggle bar */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between px-4 py-2 hover:bg-muted transition-colors"
                aria-expanded={expanded}
            >
                <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-muted-foreground" />
                    <span className="font-bold text-sm">Output</span>
                    {output.text && (
                        <span className="text-xs text-muted-foreground">
                            {wordCount} words · {charCount} chars
                        </span>
                    )}
                </div>
                {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </button>

            {/* Expanded content */}
            {expanded && (
                <div className="px-4 pb-3 space-y-2">
                    {/* Text display */}
                    <div className="min-h-[60px] max-h-[150px] overflow-y-auto rounded-lg border-2 border-border bg-input p-3 text-sm font-medium">
                        {output.text || <span className="text-muted-foreground italic">No text yet — use an input mode to start</span>}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2">
                        <Button
                            size="sm"
                            onClick={() => isSpeaking ? stopSpeaking() : speak()}
                            disabled={!output.text}
                            className="gap-1.5 font-bold text-xs border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                            aria-label={isSpeaking ? 'Stop speaking' : 'Speak text aloud'}
                        >
                            {isSpeaking ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                            {isSpeaking ? 'Stop' : 'Speak'}
                        </Button>

                        <Button
                            size="sm" variant="outline"
                            onClick={copyToClipboard}
                            disabled={!output.text}
                            className="gap-1.5 font-bold text-xs border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                            aria-label="Copy text to clipboard"
                        >
                            <Copy className="h-3.5 w-3.5" /> Copy
                        </Button>

                        <Button
                            size="sm" variant="outline"
                            onClick={undoOutput}
                            disabled={output.historyIndex <= 0}
                            className="gap-1.5 font-bold text-xs border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                            aria-label="Undo"
                        >
                            <Undo2 className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                            size="sm" variant="outline"
                            onClick={redoOutput}
                            disabled={output.historyIndex >= output.history.length - 1}
                            className="gap-1.5 font-bold text-xs border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                            aria-label="Redo"
                        >
                            <Redo2 className="h-3.5 w-3.5" />
                        </Button>

                        <div className="flex-1" />

                        <Button
                            size="sm" variant="outline"
                            onClick={handleExecute}
                            disabled={!output.text}
                            className="gap-1.5 font-bold text-xs border-2 border-border bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                            aria-label="Execute on desktop"
                        >
                            <Play className="h-3.5 w-3.5" /> Execute
                        </Button>

                        <Button
                            size="sm" variant="outline"
                            onClick={clearOutput}
                            disabled={!output.text}
                            className="gap-1.5 font-bold text-xs border-2 border-border text-destructive shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                            aria-label="Clear all text"
                        >
                            <Trash2 className="h-3.5 w-3.5" /> Clear
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

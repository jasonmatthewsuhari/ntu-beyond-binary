'use client'

import React, { useState } from 'react'
import { useFluentContext } from '@/lib/fluent-context'
import { recordInput } from '@/lib/adaptive-engine'
import { useWebSocket } from '@/lib/use-websocket'
import { ModePageLayout } from '@/components/mode-page-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Keyboard, Wand2, Sparkles, Send } from 'lucide-react'

const PREDICTIONS = ['the', 'to', 'and', 'is', 'in', 'that', 'it', 'for']

export default function TypePage() {
    const { appendOutput, setOutput, output } = useFluentContext()
    const [localText, setLocalText] = useState('')
    const [isRefining, setIsRefining] = useState(false)
    const [predictions, setPredictions] = useState(PREDICTIONS)

    const { isConnected, executeQuery } = useWebSocket({
        inputMethod: 'type',
        onExecutionResult: (result) => {
            console.log('Query executed:', result)
        }
    })

    const refineText = () => {
        if (!localText.trim()) return
        setIsRefining(true)
        // Mock Gemini text refinement
        setTimeout(() => {
            const refined = localText
                .replace(/\bu\b/gi, 'you')
                .replace(/\br\b/gi, 'are')
                .replace(/\bpls\b/gi, 'please')
                .replace(/\bthx\b/gi, 'thanks')
                .replace(/\bnd\b/gi, 'need')
                .replace(/\bhlp\b/gi, 'help')
                .replace(/\bhw\b/gi, 'how')
                .replace(/\bw\b/gi, 'with')
                .replace(/\bths\b/gi, 'this')
            setLocalText(refined)
            setIsRefining(false)
            recordInput('type', true, 1000, refined)
        }, 800)
    }

    const sendToOutput = () => {
        if (!localText.trim()) return
        const textToExecute = localText.trim()
        appendOutput(textToExecute + ' ')
        recordInput('type', true, textToExecute.length * 50, textToExecute)
        executeQuery(textToExecute)
        setLocalText('')
    }

    const insertPrediction = (word: string) => {
        setLocalText(prev => prev + (prev.endsWith(' ') || !prev ? '' : ' ') + word + ' ')
    }

    return (
        <ModePageLayout
            title="Type"
            icon={<Keyboard className="h-6 w-6 text-white" />}
            color="bg-green-500"
            helpContent="Type naturally using abbreviations like 'u' for 'you', 'pls' for 'please'. Click 'Refine' to clean up your text into proper English."
        >
            <Card className="p-6 border-4 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
                {/* Word prediction bar */}
                <div className="flex flex-wrap gap-1.5">
                    {predictions.map(word => (
                        <button
                            key={word}
                            onClick={() => insertPrediction(word)}
                            className="px-3 py-1.5 bg-muted border-2 border-border rounded-lg font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                        >
                            {word}
                        </button>
                    ))}
                </div>

                {/* Text area */}
                <Textarea
                    value={localText}
                    onChange={(e) => setLocalText(e.target.value)}
                    placeholder="Start typing... use shorthand like 'hw r u? i nd hlp'"
                    className="min-h-[250px] border-4 border-border bg-input text-base font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl p-4 resize-none"
                    aria-label="Text input area"
                />

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        onClick={refineText}
                        disabled={isRefining || !localText.trim()}
                        className="flex-1 gap-2 font-bold border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                        <Wand2 className="h-4 w-4" />
                        {isRefining ? 'Refining...' : 'Refine Text'}
                    </Button>
                    <Button
                        onClick={sendToOutput}
                        disabled={!localText.trim() || !isConnected}
                        variant="outline"
                        className="flex-1 gap-2 font-bold border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                        <Send className="h-4 w-4" /> Execute Command
                    </Button>
                </div>
            </Card>
        </ModePageLayout>
    )
}

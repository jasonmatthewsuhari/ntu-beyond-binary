'use client'

import React, { useState, useRef } from 'react'
import { useFluentContext } from '@/lib/fluent-context'
import { recordInput } from '@/lib/adaptive-engine'
import { ModePageLayout } from '@/components/mode-page-layout'
import { WaveformDisplay } from '@/components/waveform-display'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mic, Square, Globe } from 'lucide-react'

export default function VoicePage() {
    const { appendOutput } = useFluentContext()
    const [isRecording, setIsRecording] = useState(false)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [transcription, setTranscription] = useState('')
    const [language, setLanguage] = useState('en')
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)

    const startRecording = async () => {
        try {
            const s = await navigator.mediaDevices.getUserMedia({ audio: true })
            const recorder = new MediaRecorder(s)
            mediaRecorderRef.current = recorder
            const chunks: BlobPart[] = []

            recorder.ondataavailable = (e) => chunks.push(e.data)
            recorder.onstop = () => {
                s.getTracks().forEach(t => t.stop())
                setStream(null)
                // Mock transcription
                const mockTexts = [
                    'Hello, how are you doing today?',
                    'I would like to send an email to my friend.',
                    'Can you open the browser for me please?',
                    'Thank you for helping me with this.',
                    'I need to schedule a meeting for tomorrow.',
                ]
                const text = mockTexts[Math.floor(Math.random() * mockTexts.length)]
                setTranscription(text)
                appendOutput(text + ' ')
                recordInput('voice', true, 3000, text)
            }

            recorder.start()
            setStream(s)
            setIsRecording(true)
        } catch {
            recordInput('voice', false, 0)
        }
    }

    const stopRecording = () => {
        mediaRecorderRef.current?.stop()
        setIsRecording(false)
    }

    return (
        <ModePageLayout
            title="Voice Input"
            description="Speak clearly and Fluent will transcribe your words. Supports accented speech and speech impediments."
            icon={<Mic className="h-6 w-6 text-white" />}
            color="bg-blue-500"
            helpContent="Click the microphone button and speak. Your speech will be transcribed to text. If you have an accent or speech impediment, Fluent will do its best to understand your intended meaning."
        >
            <div className="grid gap-6 md:grid-cols-[1fr_280px]">
                {/* Main controls */}
                <Card className="p-6 border-4 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-6">
                    {/* Language selector */}
                    <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-input border-2 border-border rounded-lg px-3 py-1.5 font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            aria-label="Select language"
                        >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="zh">Chinese</option>
                            <option value="ms">Malay</option>
                            <option value="ta">Tamil</option>
                            <option value="auto">Auto-detect</option>
                        </select>
                    </div>

                    {/* Waveform */}
                    {stream && <WaveformDisplay stream={stream} className="w-full max-w-md" />}

                    {/* Record button */}
                    <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`h-32 w-32 rounded-full border-4 border-border flex items-center justify-center transition-all
              shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px]
              ${isRecording
                                ? 'bg-destructive animate-pulse'
                                : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                    >
                        {isRecording
                            ? <Square className="h-12 w-12 text-white" />
                            : <Mic className="h-12 w-12 text-white" />
                        }
                    </button>

                    <p className="text-sm font-bold text-muted-foreground">
                        {isRecording ? 'Recording... click to stop' : 'Click to start recording'}
                    </p>

                    {/* Live transcription */}
                    {transcription && (
                        <div className="w-full p-4 bg-input border-2 border-border rounded-xl">
                            <p className="text-xs font-bold text-muted-foreground mb-1">Last transcription:</p>
                            <p className="font-medium">{transcription}</p>
                        </div>
                    )}
                </Card>

                {/* Tips sidebar */}
                <div className="space-y-4">
                    <Card className="p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="font-black text-sm mb-2">Tips</h3>
                        <ul className="space-y-2 text-xs font-medium text-muted-foreground">
                            <li>• Speak clearly at a natural pace</li>
                            <li>• Reduce background noise if possible</li>
                            <li>• Accented speech is supported</li>
                            <li>• You can speak in another language</li>
                        </ul>
                    </Card>
                    <Card className="p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="font-black text-sm mb-2">Status</h3>
                        <div className={`flex items-center gap-2 ${isRecording ? 'text-destructive' : 'text-muted-foreground'}`}>
                            <div className={`h-2 w-2 rounded-full ${isRecording ? 'bg-destructive animate-pulse' : 'bg-muted-foreground'}`} />
                            <span className="text-xs font-bold">{isRecording ? 'Recording...' : 'Ready'}</span>
                        </div>
                    </Card>
                </div>
            </div>
        </ModePageLayout>
    )
}

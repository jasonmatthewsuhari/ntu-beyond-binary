'use client'

import React from "react"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Mic, Pencil, Trash2, Keyboard, HelpCircle, Copy, Hand } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { OnboardingFlow } from '@/components/onboarding-flow'

export default function FluentApp() {
  const [text, setText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [morseCode, setMorseCode] = useState('')
  const [currentMorse, setCurrentMorse] = useState('')
  const [isPressing, setIsPressing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const pressStartTimeRef = useRef<number>(0)
  const letterTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const wordTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  // Check if user has seen onboarding
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('fluent-onboarding-complete')
    console.log('[v0] Onboarding check:', hasSeenOnboarding)
    if (hasSeenOnboarding) {
      setShowOnboarding(false)
    }
  }, [])

  const handleOnboardingComplete = () => {
    localStorage.setItem('fluent-onboarding-complete', 'true')
    setShowOnboarding(false)
    toast({
      title: 'Welcome!',
      description: "You're all set to start using Fluent",
    })
  }

  const handleOnboardingSkip = () => {
    localStorage.setItem('fluent-onboarding-complete', 'true')
    setShowOnboarding(false)
  }

  const restartOnboarding = () => {
    setShowOnboarding(true)
  }

  // Voice recording
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const audioChunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop())
        toast({
          title: 'Recording Complete',
          description: 'Voice input has been processed',
        })
        // Simulate transcription
        setText((prev) => `${prev}${prev ? ' ' : ''}[Voice transcription would appear here]`)
      }

      mediaRecorder.start()
      setIsRecording(true)
      toast({
        title: 'Recording Started',
        description: 'Speak clearly into your microphone',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not access microphone',
        variant: 'destructive',
      })
    }
  }

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  // Drawing canvas
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const recognizeDrawing = () => {
    toast({
      title: 'Processing Drawing',
      description: 'Converting your drawing to text',
    })
    // Simulate OCR/handwriting recognition
    setText((prev) => `${prev}${prev ? ' ' : ''}[Handwriting recognition would appear here]`)
    clearCanvas()
  }

  // Morse code mapping
  const morseToChar: { [key: string]: string } = {
    '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E',
    '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
    '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O',
    '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
    '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y',
    '--..': 'Z', '.----': '1', '..---': '2', '...--': '3', '....-': '4',
    '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9',
    '-----': '0', '': ' '
  }

  // Haptic/Morse code input
  const DOT_DURATION = 200 // milliseconds for a dot
  const DASH_THRESHOLD = 400 // press longer than this for a dash
  const LETTER_TIMEOUT = 1000 // time between morse signals to complete a letter
  const WORD_TIMEOUT = 2000 // time to add a space (new word)

  const handlePressStart = () => {
    setIsPressing(true)
    pressStartTimeRef.current = Date.now()
    
    // Clear existing timeouts
    if (letterTimeoutRef.current) clearTimeout(letterTimeoutRef.current)
    if (wordTimeoutRef.current) clearTimeout(wordTimeoutRef.current)
  }

  const handlePressEnd = () => {
    setIsPressing(false)
    const pressDuration = Date.now() - pressStartTimeRef.current
    
    // Determine if it's a dot or dash
    const signal = pressDuration >= DASH_THRESHOLD ? '-' : '.'
    setCurrentMorse((prev) => prev + signal)
    
    console.log('[v0] Morse signal:', signal, 'Duration:', pressDuration)
    
    // Set timeout to convert morse to character
    if (letterTimeoutRef.current) clearTimeout(letterTimeoutRef.current)
    letterTimeoutRef.current = setTimeout(() => {
      convertMorseToText()
    }, LETTER_TIMEOUT)
    
    // Set timeout for word spacing
    if (wordTimeoutRef.current) clearTimeout(wordTimeoutRef.current)
    wordTimeoutRef.current = setTimeout(() => {
      if (currentMorse === '') {
        setText((prev) => prev + ' ')
        setMorseCode((prev) => prev + ' ')
      }
    }, WORD_TIMEOUT)
  }

  const convertMorseToText = () => {
    if (currentMorse) {
      const char = morseToChar[currentMorse] || '?'
      setText((prev) => prev + char)
      setMorseCode((prev) => `${prev}${prev ? ' ' : ''}${currentMorse}`)
      console.log('[v0] Converting morse:', currentMorse, 'to:', char)
      setCurrentMorse('')
    }
  }

  const clearMorse = () => {
    setCurrentMorse('')
    setMorseCode('')
    setText('')
    if (letterTimeoutRef.current) clearTimeout(letterTimeoutRef.current)
    if (wordTimeoutRef.current) clearTimeout(wordTimeoutRef.current)
  }



  return (
    <>
      {showOnboarding && (
        <OnboardingFlow 
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
      <main className="h-screen overflow-hidden bg-background p-6 md:p-12 flex flex-col">
        <div className="mx-auto w-full max-w-[600px] flex flex-col h-full">
        {/* Header */}
        <header className="mb-6 text-right flex-shrink-0">
          <Button
            onClick={restartOnboarding}
            variant="outline"
            size="lg"
            className="border-4 border-border bg-card text-foreground hover:bg-muted font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            aria-label="Show onboarding tutorial"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center pb-6">
          {/* Input Methods */}
          <Card className="border-4 border-border bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] aspect-square w-full flex flex-col p-6 overflow-hidden" style={{ maxWidth: 'calc(100vh - 200px)', maxHeight: 'calc(100vh - 200px)' }}>
            <h2 className="mb-4 text-2xl font-black text-card-foreground flex-shrink-0">Input Methods</h2>
            <Tabs defaultValue="voice" className="flex-1 flex flex-col" style={{ minHeight: 0 }}>
              <TabsList className="grid w-full grid-cols-4 bg-muted h-12 p-1 gap-1 flex-shrink-0">
                <TabsTrigger value="voice" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-sm">
                  <Mic className="mr-1 h-4 w-4" />
                  Voice
                </TabsTrigger>
                <TabsTrigger value="draw" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-sm">
                  <Pencil className="mr-1 h-4 w-4" />
                  Draw
                </TabsTrigger>
                <TabsTrigger value="haptic" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-sm">
                  <Hand className="mr-1 h-4 w-4" />
                  Haptic
                </TabsTrigger>
                <TabsTrigger value="type" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-sm">
                  <Keyboard className="mr-1 h-4 w-4" />
                  Type
                </TabsTrigger>
              </TabsList>

              <TabsContent value="voice" className="flex-1 flex items-center justify-center data-[state=active]:flex data-[state=inactive]:hidden">
                <div className="flex flex-col items-center justify-center gap-3 max-w-full">
                  <div className="text-center flex-shrink-0">
                    <p className="mb-3 text-sm font-semibold text-foreground">
                      {'Click the button and speak clearly'}
                    </p>
                    {isRecording && (
                      <div className="mb-3 flex items-center justify-center gap-2">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
                        <span className="font-bold text-sm text-foreground">Recording...</span>
                      </div>
                    )}
                  </div>
                  <Button
                    size="lg"
                    onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                    className={`h-28 w-28 rounded-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex-shrink-0 ${
                      isRecording ? 'bg-destructive hover:bg-destructive' : 'bg-primary hover:bg-primary'
                    }`}
                    aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                  >
                    <Mic className="h-10 w-10" />
                  </Button>
                  <p className="text-xs font-semibold text-muted-foreground flex-shrink-0">
                    {isRecording ? 'Click to stop' : 'Click to start'}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="draw" className="flex-1 flex items-center justify-center data-[state=active]:flex data-[state=inactive]:hidden">
                <div className="flex flex-col justify-center gap-3 max-w-full">
                  <p className="text-center text-sm font-semibold text-foreground flex-shrink-0">
                    {'Draw letters or shapes'}
                  </p>
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={200}
                    className="w-full cursor-crosshair rounded-xl border-4 border-border bg-input shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0"
                    style={{ maxHeight: '200px' }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    aria-label="Drawing canvas"
                  />
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      onClick={recognizeDrawing}
                      className="flex-1 bg-primary hover:bg-primary text-primary-foreground font-bold text-xs h-9 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                      <Pencil className="mr-1 h-3 w-3" />
                      Recognize
                    </Button>
                    <Button
                      onClick={clearCanvas}
                      variant="outline"
                      className="flex-1 border-4 border-border bg-card text-foreground hover:bg-muted font-bold text-xs h-9 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Clear
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="haptic" className="flex-1 flex items-center justify-center data-[state=active]:flex data-[state=inactive]:hidden">
                <div className="flex flex-col items-center justify-center gap-2 max-w-full">
                  <div className="text-center flex-shrink-0">
                    <p className="mb-2 text-sm font-semibold text-foreground">
                      {'Tap for dot (.), hold for dash (-)'}
                    </p>
                    <div className="mb-2 min-h-[40px] rounded-xl border-4 border-border bg-input p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <p className="text-lg font-mono font-bold text-foreground">
                        {currentMorse || 'Ready...'}
                      </p>
                    </div>
                    <div className="text-xs font-medium text-muted-foreground mb-2">
                      <p>{'Current: '}{currentMorse || 'None'}</p>
                      <p>{'Text: '}{text || 'None'}</p>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    onMouseDown={handlePressStart}
                    onMouseUp={handlePressEnd}
                    onMouseLeave={() => isPressing && handlePressEnd()}
                    onTouchStart={handlePressStart}
                    onTouchEnd={handlePressEnd}
                    className={`h-28 w-28 rounded-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all select-none flex-shrink-0 ${
                      isPressing ? 'bg-accent scale-95' : 'bg-primary'
                    }`}
                    aria-label="Press for morse code input"
                  >
                    <Hand className="h-10 w-10" />
                  </Button>
                  <div className="flex gap-2 w-full flex-shrink-0">
                    <Button
                      onClick={clearMorse}
                      variant="outline"
                      className="flex-1 border-4 border-border bg-card text-foreground hover:bg-muted font-bold text-xs h-9 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Clear
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="type" className="flex-1 flex items-center justify-center data-[state=active]:flex data-[state=inactive]:hidden">
                <div className="flex flex-col gap-3 w-full px-4">
                  <p className="text-center text-sm font-semibold text-foreground flex-shrink-0">
                    {'Type directly into the text area'}
                  </p>
                  <Textarea
                    placeholder="Start typing here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 border-4 border-border bg-input text-sm text-foreground font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl p-3 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all resize-none"
                    style={{ minHeight: 0 }}
                    aria-label="Text input area"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
        </div>
      </main>
    </>
  )
}

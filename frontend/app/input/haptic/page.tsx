'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useFluentContext } from '@/lib/fluent-context'
import { recordInput } from '@/lib/adaptive-engine'
import { useWebSocket } from '@/lib/use-websocket'
import { ModePageLayout } from '@/components/mode-page-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Hand, Plus, Settings2, Wifi, WifiOff } from 'lucide-react'

interface TapTiming {
  duration: number
  timestamp: number
}

const DEFAULT_PATTERNS: Record<string, string> = {
  'S-S': 'Yes',
  'L-L': 'No',
  'S-S-S': 'Help',
  'L-S': 'Next',
  'S-L': 'Back',
  'S-S-L': 'Enter',
  'L-L-S': 'Delete',
  'S-S-S-S': 'Emergency',
  'L-L-L': 'Call',
  'S-L-S-L': 'Police',
}

export default function HapticPage() {
  const { appendOutput } = useFluentContext()
  const [patterns, setPatterns] = useState(DEFAULT_PATTERNS)
  const [currentPattern, setCurrentPattern] = useState<string[]>([])
  const [recognizedText, setRecognizedText] = useState('')
  const [tapStartTime, setTapStartTime] = useState<number | null>(null)
  const [shortThreshold, setShortThreshold] = useState(200) // ms
  const [patternTimeout, setPatternTimeout] = useState(2000) // ms
  const [lastTapTime, setLastTapTime] = useState(0)
  const [showCustomDialog, setShowCustomDialog] = useState(false)
  const [newPattern, setNewPattern] = useState('')
  const [newMeaning, setNewMeaning] = useState('')
  const [combinedWords, setCombinedWords] = useState<string[]>([])
  const [longPauseTimeout, setLongPauseTimeout] = useState<NodeJS.Timeout | null>(null)
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { isConnected, executeQuery } = useWebSocket({
    inputMethod: 'haptic',
    onExecutionResult: (result) => {
      console.log('Haptic query executed:', result)
    }
  })

  // Reset pattern after timeout
  useEffect(() => {
    if (currentPattern.length > 0) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      
      timeoutRef.current = setTimeout(() => {
        recognizeAndExecute(currentPattern)
        setCurrentPattern([])
      }, patternTimeout)
    }
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [currentPattern, patternTimeout])

  const recognizeAndExecute = (pattern: string[]) => {
    const patternStr = pattern.join('-')
    const meaning = patterns[patternStr]
    
    if (meaning) {
      setRecognizedText(meaning)
      
      // Add to combined words
      setCombinedWords(prev => [...prev, meaning])
      
      // Start long pause detection (5+ seconds to finalize)
      if (longPauseTimeout) clearTimeout(longPauseTimeout)
      const timeout = setTimeout(() => {
        // After 5 seconds, combine all words
        if (combinedWords.length > 0 || meaning) {
          const allWords = [...combinedWords, meaning]
          const combined = allWords.join(' ')
          appendOutput(combined + ' ')
          recordInput('haptic', true, 500, combined)
          executeQuery(combined) // Execute via desktop agent
          setCombinedWords([])
        }
      }, 5000)
      setLongPauseTimeout(timeout)
    } else {
      setRecognizedText(`Unknown pattern: ${patternStr}`)
      recordInput('haptic', false, 500)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.repeat) return // Ignore key repeats
    if (e.code !== 'Space' && e.code !== 'Enter') return
    
    e.preventDefault()
    const now = Date.now()
    setTapStartTime(now)
    setLastTapTime(now)
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.code !== 'Space' && e.code !== 'Enter') return
    
    e.preventDefault()
    if (!tapStartTime) return
    
    const duration = Date.now() - tapStartTime
    const tapType = duration < shortThreshold ? 'S' : 'L'
    
    setCurrentPattern(prev => [...prev, tapType])
    setTapStartTime(null)
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [tapStartTime, shortThreshold])

  const addCustomPattern = () => {
    if (newPattern && newMeaning) {
      setPatterns(prev => ({ ...prev, [newPattern]: newMeaning }))
      setNewPattern('')
      setNewMeaning('')
      setShowCustomDialog(false)
    }
  }

  const currentPatternStr = currentPattern.join('-') || '(none)'

  return (
    <ModePageLayout
      title="Haptic Input"
      icon={<Hand className="h-6 w-6 text-white" />}
      color="bg-purple-500"
      helpContent="Press and hold Space or Enter to create tap patterns. Short tap = S (< 200ms), Long tap = L (> 200ms). Combine taps to create patterns like S-S for Yes or L-L for No."
        >
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="space-y-4">
                    {/* Current Pattern Display */}
                    <Card className="p-6 border-4 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] min-h-[300px] flex flex-col justify-center">
            <div className="text-center space-y-4">
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-2">Current Pattern</p>
                <div className="flex justify-center gap-2 min-h-[60px] items-center">
                  {currentPattern.length === 0 ? (
                    <span className="text-muted-foreground text-sm">Press Space or Enter to start</span>
                  ) : (
                    currentPattern.map((tap, i) => (
                      <div
                        key={i}
                        className={`px-4 py-2 rounded-lg border-2 border-border font-black text-lg ${
                          tap === 'S' ? 'bg-blue-500 text-white' : 'bg-orange-500 text-white'
                        }`}
                      >
                        {tap}
                      </div>
                    ))
                  )}
                </div>
                <p className="text-sm font-bold mt-2">{currentPatternStr}</p>
              </div>

              {recognizedText && (
                <div className="p-4 bg-primary/10 border-2 border-primary rounded-xl">
                  <p className="text-xs font-bold text-muted-foreground mb-1">Recognized:</p>
                  <p className="font-black text-lg">{recognizedText}</p>
                  
                  {combinedWords.length > 0 && (
                    <div className="mt-3 pt-3 border-t-2 border-primary/20">
                      <p className="text-xs font-bold text-muted-foreground mb-1">
                        Building phrase (pause 5s to send):
                      </p>
                      <p className="font-bold text-sm text-primary">
                        {[...combinedWords, recognizedText].join(' ')}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

                    {/* Pattern Library */}
                    <Card className="p-6 border-4 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-sm">Pattern Library</h3>
              <Button
                size="sm"
                onClick={() => setShowCustomDialog(true)}
                className="gap-2 font-bold border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <Plus className="h-3 w-3" /> Add Pattern
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {Object.entries(patterns).map(([pattern, meaning]) => (
                <div
                  key={pattern}
                  className="p-3 bg-muted border-2 border-border rounded-lg text-center"
                >
                  <p className="text-xs font-black text-muted-foreground">{pattern}</p>
                  <p className="font-bold text-sm">{meaning}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Custom Pattern Dialog */}
          {showCustomDialog && (
            <Card className="p-6 border-4 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-background">
              <h3 className="font-black text-sm mb-4">Add Custom Pattern</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold mb-1 block">Pattern (e.g., S-L-S)</label>
                  <input
                    type="text"
                    value={newPattern}
                    onChange={(e) => setNewPattern(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-border rounded-lg font-bold bg-input"
                    placeholder="S-L-S"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold mb-1 block">Meaning</label>
                  <input
                    type="text"
                    value={newMeaning}
                    onChange={(e) => setNewMeaning(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-border rounded-lg font-bold bg-input"
                    placeholder="Save"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={addCustomPattern}
                    className="flex-1 font-bold border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Add
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCustomDialog(false)}
                    className="flex-1 font-bold border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Settings Sidebar */}
        <div className="space-y-4">
          <Card className="p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black text-sm mb-3 flex items-center gap-2">
              <Settings2 className="h-4 w-4" /> Settings
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold mb-1 block">
                  Short Tap Threshold: {shortThreshold}ms
                </label>
                <input
                  type="range"
                  min={50}
                  max={500}
                  step={10}
                  value={shortThreshold}
                  onChange={(e) => setShortThreshold(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground font-bold mt-1">
                  <span>Faster</span>
                  <span>Slower</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold mb-1 block">
                  Pattern Timeout: {patternTimeout}ms
                </label>
                <input
                  type="range"
                  min={1000}
                  max={5000}
                  step={100}
                  value={patternTimeout}
                  onChange={(e) => setPatternTimeout(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground font-bold mt-1">
                  <span>1s</span>
                  <span>5s</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black text-sm mb-2">Instructions</h3>
            <ul className="space-y-2 text-xs font-medium text-muted-foreground">
              <li>• Press and hold Space or Enter</li>
              <li>• Short tap (S) = quick press</li>
              <li>• Long tap (L) = hold longer</li>
              <li>• Pattern completes after pause</li>
              <li>• Adjust thresholds for comfort</li>
            </ul>
          </Card>
        </div>
      </div>
    </ModePageLayout>
  )
}

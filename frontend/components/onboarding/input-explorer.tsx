'use client'

import React, { useState, useEffect } from 'react'
import { type InputType, usePassiveSensing } from '@/lib/use-passive-sensing'
import { Button } from '@/components/ui/button'
import { Volume2, Eye, Hand, Keyboard, Activity, Wind, Smile, Move, Zap } from 'lucide-react'

interface InputExplorerProps {
    primaryInput: InputType
    detectedInputs: InputType[]
    onComplete: (allInputs: InputType[]) => void
}

export function InputExplorer({ primaryInput, detectedInputs: initialInputs, onComplete }: InputExplorerProps) {
    const [detectedInputs, setDetectedInputs] = useState<InputType[]>(initialInputs)
    const [testedInputs, setTestedInputs] = useState<InputType[]>(initialInputs)
    const [currentlyTesting, setCurrentlyTesting] = useState<InputType | null>(null)
    const [skipCount, setSkipCount] = useState(0)
    const [confirmCount, setConfirmCount] = useState(0)
    const [sensingEnabled, setSensingEnabled] = useState(true)
    const [timeoutCounter, setTimeoutCounter] = useState(0)
    const [voiceChallenge, setVoiceChallenge] = useState<{ category: 'color' | 'shape' | 'fruit'; word: string } | null>(null)
    const [voiceChallengeStart, setVoiceChallengeStart] = useState<number>(0)
    const [voiceChallengeExpires, setVoiceChallengeExpires] = useState<number>(0)
    const [voiceSessionStart, setVoiceSessionStart] = useState<number>(0)
    const requiredConfirmations = 3

    const { detectedInput, transcription, videoRef, status, requestSpeechStart } = usePassiveSensing(
        sensingEnabled && !!currentlyTesting,
        {
            disableVoiceVolume: currentlyTesting !== 'voice',  // Only enable for voice testing
            disableGaze: currentlyTesting === 'head',
            disableVoiceVolume: primaryInput === 'voice'
            , allowedInputTypes: currentlyTesting === 'head' ? ['head'] : undefined
        }
    )

    // All possible inputs to test
    const allInputTypes: InputType[] = ['voice', 'head', 'blink', 'gaze', 'switch', 'motion', 'sign', 'facial', 'sip-puff']

    // Inputs we haven't tested yet
    const untested = allInputTypes.filter(input => !testedInputs.includes(input))

    const inputIcons: Record<InputType, React.ReactNode> = {
        voice: <Volume2 className="h-12 w-12" />,
        motion: <Activity className="h-12 w-12" />,
        switch: <Keyboard className="h-12 w-12" />,
        blink: <Eye className="h-12 w-12" />,
        gaze: <Eye className="h-12 w-12" />,
        head: <Move className="h-12 w-12" />,
        sign: <Hand className="h-12 w-12" />,
        facial: <Smile className="h-12 w-12" />,
        'sip-puff': <Wind className="h-12 w-12" />,
        none: <Zap className="h-12 w-12" />
    }

    const inputPrompts: Record<InputType, string> = {
        voice: 'Voice check: say the word shown on screen. Get 3 correct in a row.',
        head: 'Can you move your head? Nod 3 times.',
        blink: 'Can you blink deliberately? Blink 3 times.',
        gaze: 'Can you move your eyes? Look away and back 3 times.',
        switch: 'Can you use a keyboard or switch? Press any key 3 times.',
        motion: 'Can you use a mouse or touch? Click anywhere 3 times.',
        sign: 'Can you make hand gestures? Make a gesture 3 times.',
        facial: 'Can you make facial expressions? Smile or frown 3 times.',
        'sip-puff': 'Can you use sip-puff controls? Use them 3 times.',
        none: ''
    }

    const skipPrompt = primaryInput === 'voice'
        ? 'Say "skip" 3 times to skip'
        : primaryInput === 'head'
            ? 'Nod 3 times to skip'
            : primaryInput === 'blink'
                ? 'Blink 3 times to skip'
                : primaryInput === 'switch'
                    ? 'Press any key 3 times to skip'
                    : 'Use your primary input 3 times to skip'

    // Auto-start testing next input
    useEffect(() => {
        if (!currentlyTesting && untested.length > 0) {
            const nextInput = untested[0]
            setCurrentlyTesting(nextInput)
            setConfirmCount(0)
            setSkipCount(0)
            setTimeoutCounter(0)
            setSensingEnabled(false)
            setTimeout(() => setSensingEnabled(true), 50)
            setVoiceChallenge(null)
            setVoiceChallengeStart(0)
            setVoiceChallengeExpires(0)
            setVoiceSessionStart(Date.now())

            window.speechSynthesis.cancel()
            const utterance = new SpeechSynthesisUtterance(
                `Let's try ${nextInput}. ${inputPrompts[nextInput]} Or ${skipPrompt}.`
            )
            utterance.rate = 0.9
            window.speechSynthesis.speak(utterance)
        } else if (untested.length === 0 && currentlyTesting === null) {
            // All done!
            onComplete(detectedInputs)
        }
    }, [currentlyTesting, untested.length, detectedInputs, onComplete])

    // Watchdog: if we ever get stuck on the "Analyzing inputs..." screen, advance.
    useEffect(() => {
        if (currentlyTesting !== null) return
        const timer = setTimeout(() => {
            if (untested.length > 0) {
                setCurrentlyTesting(untested[0])
            } else {
                onComplete(detectedInputs)
            }
        }, 1500)
        return () => clearTimeout(timer)
    }, [currentlyTesting, untested.length, onComplete, detectedInputs])

    // Timeout counter
    useEffect(() => {
        if (!currentlyTesting) return

        const interval = setInterval(() => {
            setTimeoutCounter(prev => {
                if (prev + 1 >= 30) {
                    console.log('⏰ Timeout - skipping', currentlyTesting)
                    handleSkip()
                    return 0
                }
                return prev + 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [currentlyTesting])

    const pickVoiceChallenge = () => {
        const categories: Array<{ category: 'color' | 'shape' | 'fruit'; words: string[] }> = [
            { category: 'color', words: ['red', 'blue', 'green', 'yellow', 'orange', 'purple'] },
            { category: 'shape', words: ['circle', 'square', 'triangle', 'star', 'heart'] },
            { category: 'fruit', words: ['apple', 'banana', 'orange', 'grape', 'pear'] }
        ]
        const cat = categories[Math.floor(Math.random() * categories.length)]
        const word = cat.words[Math.floor(Math.random() * cat.words.length)]
        setVoiceChallenge({ category: cat.category, word })
        const now = Date.now()
        setVoiceChallengeStart(now)
        setVoiceChallengeExpires(now + 10000)
    }

    // Voice challenge lifecycle
    useEffect(() => {
        if (currentlyTesting !== 'voice') return

        if (!voiceChallenge) {
            pickVoiceChallenge()
            return
        }

        const timer = setInterval(() => {
            const now = Date.now()
            if (now >= voiceChallengeExpires) {
                pickVoiceChallenge()
            }
        }, 500)

        return () => clearInterval(timer)
    }, [currentlyTesting, voiceChallenge, voiceChallengeExpires])

    // Listen for new input detection
    useEffect(() => {
        if (!detectedInput || !currentlyTesting) return
        if (currentlyTesting === 'voice') return

        // Testing for this specific input
        if (detectedInput.type === currentlyTesting) {
            const newCount = confirmCount + 1
            console.log(`✓ ${currentlyTesting} confirmation ${newCount}/${requiredConfirmations}`)
            setConfirmCount(newCount)

            const beep = new SpeechSynthesisUtterance(`${newCount}`)
            beep.rate = 1.2
            window.speechSynthesis.speak(beep)

            if (newCount >= requiredConfirmations) {
                handleConfirm(currentlyTesting)
            } else {
                // Reset sensing
                setSensingEnabled(false)
                setTimeout(() => setSensingEnabled(true), 500)
            }
        }
        // Skip via primary input
        else if (detectedInput.type === primaryInput && primaryInput !== 'voice') {
            const newCount = skipCount + 1
            console.log(`⏭️ Skip count ${newCount}/${requiredConfirmations}`)
            setSkipCount(newCount)

            const beep = new SpeechSynthesisUtterance(`skip ${newCount}`)
            beep.rate = 1.2
            window.speechSynthesis.speak(beep)

            if (newCount >= requiredConfirmations) {
                handleSkip()
            } else {
                // Reset sensing
                setSensingEnabled(false)
                setTimeout(() => setSensingEnabled(true), 500)
            }
        }
    }, [detectedInput, currentlyTesting, confirmCount, skipCount, primaryInput])

    // Voice skip via transcription (all tests)
    useEffect(() => {
        if (primaryInput !== 'voice' || !transcription || !currentlyTesting) return
        const text = transcription.text.toLowerCase()
        if (!text.includes('skip')) return

        const newCount = skipCount + 1
        setSkipCount(newCount)
        const beep = new SpeechSynthesisUtterance(`skip ${newCount}`)
        beep.rate = 1.2
        window.speechSynthesis.speak(beep)
        if (newCount >= requiredConfirmations) {
            handleSkip()
        }
    }, [primaryInput, transcription, currentlyTesting, skipCount])

    // Voice verification via transcription
    useEffect(() => {
        if (currentlyTesting !== 'voice' || !transcription) return
        const text = transcription.text.toLowerCase()

        if (voiceChallenge && text.includes(voiceChallenge.word)) {
            const newCount = confirmCount + 1
            setConfirmCount(newCount)
            const beep = new SpeechSynthesisUtterance(`${newCount}`)
            beep.rate = 1.2
            window.speechSynthesis.speak(beep)

            if (newCount >= requiredConfirmations) {
                handleConfirm('voice')
            } else {
                pickVoiceChallenge()
            }
        }
    }, [currentlyTesting, transcription, voiceChallenge, confirmCount, skipCount, primaryInput])

    const handleConfirm = (inputType: InputType) => {
        console.log('✓ Confirmed:', inputType)
        setDetectedInputs(prev => [...prev, inputType])
        setTestedInputs(prev => (prev.includes(inputType) ? prev : [...prev, inputType]))

        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(`Great! ${inputType} confirmed.`)
        utterance.rate = 1.0
        window.speechSynthesis.speak(utterance)

        setTimeout(() => {
            setCurrentlyTesting(null)
            setConfirmCount(0)
            setSkipCount(0)
        }, 1500)
    }

    const handleSkip = () => {
        console.log('⏭️ Skipped:', currentlyTesting)
        if (currentlyTesting) {
            setTestedInputs(prev => (prev.includes(currentlyTesting) ? prev : [...prev, currentlyTesting]))
        }

        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance('Skipped.')
        utterance.rate = 1.0
        window.speechSynthesis.speak(utterance)

        setTimeout(() => {
            setCurrentlyTesting(null)
            setConfirmCount(0)
            setSkipCount(0)
        }, 800)
    }

    // Cleanup
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel()
        }
    }, [])

    if (!currentlyTesting) {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                <div className="text-white text-center">
                    <div className="text-6xl mb-4 animate-pulse">✓</div>
                    <h2 className="text-3xl font-black">Analyzing inputs...</h2>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center p-8">
            <video ref={videoRef} className="hidden" playsInline muted />

            <div className="max-w-3xl text-center space-y-8">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                        {inputIcons[currentlyTesting]}
                    </div>
                </div>

                {/* Prompt */}
                <h1 className="text-3xl font-black">
                    {inputPrompts[currentlyTesting]}
                </h1>

                {currentlyTesting === 'voice' && voiceChallenge && (
                    <div className="bg-white text-black rounded-2xl px-8 py-6 inline-flex flex-col items-center gap-2 border-4 border-white">
                        <div className="text-sm font-semibold uppercase tracking-wide">
                            Say the {voiceChallenge.category}
                        </div>
                        <div className="text-4xl font-black">
                            {voiceChallenge.word}
                        </div>
                        <div className="text-xs text-gray-600">
                            {Math.max(0, Math.ceil((voiceChallengeExpires - Date.now()) / 1000))}s remaining
                        </div>
                    </div>
                )}

                {currentlyTesting === 'voice' && (!status.speechActive || status.speechError) && (
                    <button
                        onClick={() => requestSpeechStart?.()}
                        className="mt-4 px-6 py-3 bg-white text-black font-bold rounded-lg border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                    >
                        Enable Voice Recognition
                    </button>
                )}

                {/* Progress indicators */}
                <div className="space-y-6">
                    {/* Confirm progress */}
                    <div>
                        <p className="text-sm text-gray-400 mb-2">Try it:</p>
                        <div className="flex justify-center gap-4">
                            {[...Array(requiredConfirmations)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-12 h-12 rounded-full border-4 border-white flex items-center justify-center text-lg font-black transition-all ${i < confirmCount ? 'bg-green-500 scale-110' : 'bg-white/20'
                                        }`}
                                >
                                    {i < confirmCount ? '✓' : i + 1}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skip progress */}
                    <div>
                        <p className="text-sm text-gray-400 mb-2">{skipPrompt}</p>
                        <div className="flex justify-center gap-4">
                            {[...Array(requiredConfirmations)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-12 h-12 rounded-full border-4 border-gray-500 flex items-center justify-center text-lg font-black transition-all ${i < skipCount ? 'bg-gray-600 scale-110' : 'bg-white/10'
                                        }`}
                                >
                                    {i < skipCount ? '⏭' : i + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Timeout */}
                <p className="text-sm text-gray-500">
                    Auto-skip in {30 - timeoutCounter}s
                </p>

                {/* Progress through all inputs */}
                <div className="pt-8 border-t border-white/20">
                    <p className="text-sm text-gray-400 mb-4">
                        Testing {detectedInputs.length + 1} of {allInputTypes.length} inputs
                    </p>
                    <div className="flex justify-center gap-2 flex-wrap">
                        {allInputTypes.map(input => (
                            <div
                                key={input}
                                className={`px-3 py-1 rounded-full text-xs font-bold ${detectedInputs.includes(input)
                                        ? 'bg-green-500 text-white'
                                        : input === currentlyTesting
                                            ? 'bg-yellow-500 text-black'
                                            : 'bg-white/10 text-gray-400'
                                    }`}
                            >
                                {input}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Manual buttons */}
                <div className="flex gap-4 justify-center pt-4">
                    <Button
                        onClick={() => {
                            const newCount = confirmCount + 1
                            setConfirmCount(newCount)
                            if (newCount >= requiredConfirmations) {
                                handleConfirm(currentlyTesting)
                            }
                        }}
                        className="text-lg px-6 py-4 font-bold border-4 border-white bg-green-600 hover:bg-green-700"
                    >
                        Yes ({confirmCount}/{requiredConfirmations})
                    </Button>
                    <Button
                        onClick={() => {
                            const newCount = skipCount + 1
                            setSkipCount(newCount)
                            if (newCount >= requiredConfirmations) {
                                handleSkip()
                            }
                        }}
                        className="text-lg px-6 py-4 font-bold border-4 border-white bg-gray-600 hover:bg-gray-700"
                    >
                        Skip ({skipCount}/{requiredConfirmations})
                    </Button>
                </div>
            </div>

            {/* Debug Status Panel */}
            <div className="absolute top-6 right-6 bg-black/80 text-white border border-white/20 rounded-lg p-4 text-xs font-mono w-72">
                <div className="font-bold mb-2">System Status</div>
                <div>Mic: {status.audioReady ? 'READY' : 'NO'}</div>
                <div>Camera: {status.videoReady ? 'READY' : 'NO'}</div>
                <div>Speech API: {status.speechAvailable ? 'YES' : 'NO'}</div>
                <div>Speech Active: {status.speechActive ? 'YES' : 'NO'}</div>
                <div>Speech Error: {status.speechError ?? 'none'}</div>
                <div>MediaPipe: {status.mediaPipeReady ? 'READY' : 'NO'}</div>
                <div>Face Detected: {status.faceDetected ? 'YES' : 'NO'}</div>
                <div>Detection Lock: {status.detectionLocked ? 'LOCKED' : 'OPEN'}</div>
                <div>Audio Level: {Math.round(status.audioLevel)}</div>
                <div>Last Transcript: {status.lastTranscript || '—'}</div>
                <div>Speech Event: {status.lastSpeechEvent}</div>
            </div>
        </div>
    )
}

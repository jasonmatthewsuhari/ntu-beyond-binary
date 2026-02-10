'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Delete, CornerDownLeft, Space } from 'lucide-react'

interface OnScreenKeyboardProps {
    onKeyPress: (key: string) => void
    mode?: 'click' | 'dwell' | 'scan'
    dwellTime?: number
    scanSpeed?: number
    layout?: 'qwerty' | 'alphabetical'
    className?: string
}

const QWERTY_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
]

const ALPHA_ROWS = [
    ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    ['H', 'I', 'J', 'K', 'L', 'M', 'N'],
    ['O', 'P', 'Q', 'R', 'S', 'T', 'U'],
    ['V', 'W', 'X', 'Y', 'Z'],
]

export function OnScreenKeyboard({
    onKeyPress, mode = 'click', dwellTime = 1200, scanSpeed = 1500,
    layout = 'qwerty', className = ''
}: OnScreenKeyboardProps) {
    const rows = layout === 'qwerty' ? QWERTY_ROWS : ALPHA_ROWS
    const [hoveredKey, setHoveredKey] = useState<string | null>(null)
    const [dwellProgress, setDwellProgress] = useState(0)
    const [scanIndex, setScanIndex] = useState(0)
    const dwellTimer = useRef<NodeJS.Timeout | null>(null)
    const dwellStart = useRef(0)
    const allKeys = rows.flat().concat(['SPACE', 'BACKSPACE', 'ENTER'])

    // Dwell-click mode
    const handleMouseEnter = useCallback((key: string) => {
        if (mode !== 'dwell') return
        setHoveredKey(key)
        dwellStart.current = Date.now()
        setDwellProgress(0)

        const tick = () => {
            const elapsed = Date.now() - dwellStart.current
            const progress = Math.min(elapsed / dwellTime, 1)
            setDwellProgress(progress)
            if (progress >= 1) {
                onKeyPress(key === 'SPACE' ? ' ' : key === 'BACKSPACE' ? '\b' : key === 'ENTER' ? '\n' : key)
                setDwellProgress(0)
                dwellStart.current = Date.now()
            } else {
                dwellTimer.current = setTimeout(tick, 50)
            }
        }
        dwellTimer.current = setTimeout(tick, 50)
    }, [mode, dwellTime, onKeyPress])

    const handleMouseLeave = useCallback(() => {
        if (dwellTimer.current) clearTimeout(dwellTimer.current)
        setHoveredKey(null)
        setDwellProgress(0)
    }, [])

    // Switch scanning mode
    useEffect(() => {
        if (mode !== 'scan') return
        const interval = setInterval(() => {
            setScanIndex(prev => (prev + 1) % allKeys.length)
        }, scanSpeed)
        return () => clearInterval(interval)
    }, [mode, scanSpeed, allKeys.length])

    // Spacebar selects in scan mode
    useEffect(() => {
        if (mode !== 'scan') return
        const handler = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault()
                const key = allKeys[scanIndex]
                onKeyPress(key === 'SPACE' ? ' ' : key === 'BACKSPACE' ? '\b' : key === 'ENTER' ? '\n' : key)
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [mode, scanIndex, allKeys, onKeyPress])

    const handleClick = (key: string) => {
        if (mode !== 'click') return
        onKeyPress(key === 'SPACE' ? ' ' : key === 'BACKSPACE' ? '\b' : key === 'ENTER' ? '\n' : key)
    }

    const flatIndex = (key: string) => allKeys.indexOf(key)

    const keyStyle = (key: string) => {
        const isScanned = mode === 'scan' && flatIndex(key) === scanIndex
        const isDwelling = mode === 'dwell' && hoveredKey === key
        return `relative font-bold text-sm border-2 border-border rounded-lg transition-all
      ${isScanned ? 'bg-primary text-primary-foreground scale-110 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-card hover:bg-muted shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}
      ${isDwelling ? 'ring-2 ring-primary' : ''}
      min-w-[40px] min-h-[40px] p-2 flex items-center justify-center cursor-pointer
      hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]`
    }

    return (
        <div className={`space-y-2 ${className}`} role="group" aria-label="On-screen keyboard">
            {rows.map((row, ri) => (
                <div key={ri} className="flex justify-center gap-1.5">
                    {row.map(key => (
                        <button
                            key={key}
                            className={keyStyle(key)}
                            onClick={() => handleClick(key)}
                            onMouseEnter={() => handleMouseEnter(key)}
                            onMouseLeave={handleMouseLeave}
                            aria-label={key}
                        >
                            {key}
                            {mode === 'dwell' && hoveredKey === key && dwellProgress > 0 && (
                                <div
                                    className="absolute bottom-0 left-0 h-1 bg-primary rounded-b-lg transition-all"
                                    style={{ width: `${dwellProgress * 100}%` }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            ))}
            {/* Action row */}
            <div className="flex justify-center gap-1.5">
                <button
                    className={`${keyStyle('BACKSPACE')} px-4`}
                    onClick={() => handleClick('BACKSPACE')}
                    onMouseEnter={() => handleMouseEnter('BACKSPACE')}
                    onMouseLeave={handleMouseLeave}
                    aria-label="Backspace"
                >
                    <Delete className="h-4 w-4" />
                </button>
                <button
                    className={`${keyStyle('SPACE')} flex-1 max-w-[200px]`}
                    onClick={() => handleClick('SPACE')}
                    onMouseEnter={() => handleMouseEnter('SPACE')}
                    onMouseLeave={handleMouseLeave}
                    aria-label="Space"
                >
                    <Space className="h-4 w-4" />
                </button>
                <button
                    className={`${keyStyle('ENTER')} px-4`}
                    onClick={() => handleClick('ENTER')}
                    onMouseEnter={() => handleMouseEnter('ENTER')}
                    onMouseLeave={handleMouseLeave}
                    aria-label="Enter"
                >
                    <CornerDownLeft className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}

'use client'

import React, { useEffect, useRef } from 'react'

interface WaveformDisplayProps {
    stream: MediaStream | null
    className?: string
    color?: string
    bgColor?: string
}

export function WaveformDisplay({ stream, className = '', color = '#000', bgColor = 'transparent' }: WaveformDisplayProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animRef = useRef<number>(0)

    useEffect(() => {
        if (!stream || !canvasRef.current) return

        const ctx = canvasRef.current.getContext('2d')
        if (!ctx) return

        const audioCtx = new AudioContext()
        const source = audioCtx.createMediaStreamSource(stream)
        const analyser = audioCtx.createAnalyser()
        analyser.fftSize = 256
        source.connect(analyser)

        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)

        const draw = () => {
            const canvas = canvasRef.current
            if (!canvas) return
            const c = canvas.getContext('2d')
            if (!c) return

            analyser.getByteTimeDomainData(dataArray)
            c.fillStyle = bgColor
            c.fillRect(0, 0, canvas.width, canvas.height)

            c.lineWidth = 2
            c.strokeStyle = color
            c.beginPath()

            const sliceWidth = canvas.width / bufferLength
            let x = 0
            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0
                const y = (v * canvas.height) / 2
                if (i === 0) c.moveTo(x, y)
                else c.lineTo(x, y)
                x += sliceWidth
            }
            c.lineTo(canvas.width, canvas.height / 2)
            c.stroke()

            animRef.current = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            cancelAnimationFrame(animRef.current)
            source.disconnect()
            audioCtx.close()
        }
    }, [stream, color, bgColor])

    return (
        <canvas
            ref={canvasRef}
            width={400}
            height={80}
            className={`w-full rounded-lg border-2 border-border ${className}`}
            aria-label="Audio waveform visualization"
        />
    )
}

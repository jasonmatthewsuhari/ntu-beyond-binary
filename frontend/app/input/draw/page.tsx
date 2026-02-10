'use client'

import React, { useRef, useState } from 'react'
import { useFluentContext } from '@/lib/fluent-context'
import { recordInput } from '@/lib/adaptive-engine'
import { ModePageLayout } from '@/components/mode-page-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, Eraser, Check } from 'lucide-react'

export default function DrawPage() {
    const { appendOutput } = useFluentContext()
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [strokeWidth, setStrokeWidth] = useState(4)
    const [strokeColor, setStrokeColor] = useState('#000000')
    const [recognized, setRecognized] = useState('')

    const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas) return { x: 0, y: 0 }
        const rect = canvas.getBoundingClientRect()
        if ('touches' in e) {
            return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
        }
        return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        setIsDrawing(true)
        const ctx = canvasRef.current?.getContext('2d')
        if (!ctx) return
        const { x, y } = getPos(e)
        ctx.beginPath()
        ctx.moveTo(x, y)
    }

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return
        const ctx = canvasRef.current?.getContext('2d')
        if (!ctx) return
        const { x, y } = getPos(e)
        ctx.strokeStyle = strokeColor
        ctx.lineWidth = strokeWidth
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.lineTo(x, y)
        ctx.stroke()
    }

    const stopDraw = () => setIsDrawing(false)

    const clearCanvas = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
        setRecognized('')
    }

    const recognize = () => {
        const mockResults = [
            'Hello', 'Help', 'Water', 'Thank you', 'Yes', 'No',
            'Medicine', 'Pain', 'Doctor', 'Family',
        ]
        const text = mockResults[Math.floor(Math.random() * mockResults.length)]
        setRecognized(text)
        appendOutput(text + ' ')
        recordInput('draw', true, 2000, text)
        clearCanvas()
    }

    return (
        <ModePageLayout
            title="Draw / Write"
            description="Draw letters, symbols, or words. Supports mouse, touch, and pen input."
            icon={<Pencil className="h-6 w-6 text-white" />}
            color="bg-orange-500"
            helpContent="Use your finger, mouse, or stylus to write letters or draw shapes. Click 'Recognize' to convert your drawing to text."
        >
            <Card className="p-6 border-4 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                {/* Controls */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-bold">Size:</label>
                        <input
                            type="range" min={1} max={20} value={strokeWidth}
                            onChange={(e) => setStrokeWidth(Number(e.target.value))}
                            className="w-24"
                            aria-label="Stroke width"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-bold">Color:</label>
                        <div className="flex gap-1">
                            {['#000000', '#FF0000', '#0000FF', '#008000'].map(c => (
                                <button
                                    key={c}
                                    onClick={() => setStrokeColor(c)}
                                    className={`w-7 h-7 rounded-lg border-2 ${strokeColor === c ? 'border-primary scale-110' : 'border-border'}`}
                                    style={{ backgroundColor: c }}
                                    aria-label={`Color ${c}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Canvas */}
                <canvas
                    ref={canvasRef}
                    width={700}
                    height={350}
                    className="w-full border-4 border-border rounded-xl bg-white cursor-crosshair shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] touch-none"
                    style={{ maxHeight: '350px' }}
                    onMouseDown={startDraw}
                    onMouseMove={draw}
                    onMouseUp={stopDraw}
                    onMouseLeave={stopDraw}
                    onTouchStart={startDraw}
                    onTouchMove={draw}
                    onTouchEnd={stopDraw}
                    aria-label="Drawing canvas"
                />

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                    <Button
                        onClick={recognize}
                        className="flex-1 font-bold border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all gap-2"
                    >
                        <Check className="h-4 w-4" /> Recognize
                    </Button>
                    <Button
                        variant="outline"
                        onClick={clearCanvas}
                        className="flex-1 font-bold border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all gap-2"
                    >
                        <Trash2 className="h-4 w-4" /> Clear
                    </Button>
                </div>

                {/* Recognition result */}
                {recognized && (
                    <div className="mt-4 p-3 bg-input border-2 border-border rounded-xl">
                        <span className="text-xs font-bold text-muted-foreground">Recognized: </span>
                        <span className="font-bold">{recognized}</span>
                    </div>
                )}
            </Card>
        </ModePageLayout>
    )
}

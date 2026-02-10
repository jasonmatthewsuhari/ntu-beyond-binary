'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useFluentContext } from '@/lib/fluent-context'
import { getFrequentPhrases, getModeStats, getSuggestion } from '@/lib/adaptive-engine'
import { INPUT_MODES } from '@/components/app-shell'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Zap, TrendingUp, TrendingDown, Minus, AlertTriangle,
  Smile, Meh, Frown, Heart, HelpCircle, Star
} from 'lucide-react'

const MOODS = [
  { emoji: '😊', label: 'Good', icon: Smile },
  { emoji: '😐', label: 'Okay', icon: Meh },
  { emoji: '😟', label: 'Struggling', icon: Frown },
  { emoji: '❤️', label: 'Great', icon: Heart },
]

export default function Dashboard() {
  const { appendOutput } = useFluentContext()
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [phrases, setPhrases] = useState<string[]>([])
  const [suggestion, setSuggestion] = useState<ReturnType<typeof getSuggestion>>({ type: 'none', message: '' })

  useEffect(() => {
    setPhrases(getFrequentPhrases())
    setSuggestion(getSuggestion())
  }, [])

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* ── Hero ─────────────────────────────────────── */}
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
          Welcome to <span className="text-primary bg-accent px-2 py-0.5 border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] inline-block rotate-[-1deg]">Fluent</span>
        </h1>
        <p className="text-lg font-medium text-muted-foreground max-w-2xl">
          Your universal bridge between ability and technology. Choose an input mode to start communicating.
        </p>
      </div>

      {/* ── Mood Selector ────────────────────────────── */}
      <Card className="p-4 border-4 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <p className="font-bold text-sm mb-3">How are you feeling today?</p>
        <div className="flex gap-2 flex-wrap">
          {MOODS.map((mood, i) => (
            <button
              key={i}
              onClick={() => setSelectedMood(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-border font-bold text-sm transition-all
                shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]
                ${selectedMood === i ? 'bg-primary text-primary-foreground' : 'bg-card'}`}
              aria-label={`Mood: ${mood.label}`}
            >
              <span className="text-lg">{mood.emoji}</span>
              {mood.label}
            </button>
          ))}
        </div>
      </Card>

      {/* ── Suggestion Banner ────────────────────────── */}
      {suggestion.type !== 'none' && (
        <div className="flex items-center gap-3 p-4 bg-accent/20 border-4 border-border rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-foreground" />
          <p className="text-sm font-bold flex-1">{suggestion.message}</p>
          {suggestion.suggestedMode && (
            <Link href={`/input/${suggestion.suggestedMode}`}>
              <Button size="sm" className="font-bold border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                Try it
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* ── Input Mode Grid ──────────────────────────── */}
      <div>
        <h2 className="text-xl font-black mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5" /> Input Modes
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {INPUT_MODES.map((mode) => {
            const Icon = mode.icon
            const stats = getModeStats().find(s => s.mode === mode.id)
            return (
              <Link key={mode.id} href={mode.href}>
                <Card className="group p-4 border-4 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer h-full">
                  <div className={`w-12 h-12 rounded-xl border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${mode.color} flex items-center justify-center mb-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-black text-base">{mode.label}</h3>
                  {stats && (
                    <div className="flex items-center gap-1 mt-1">
                      {stats.trend === 'improving' && <TrendingUp className="h-3 w-3 text-green-600" />}
                      {stats.trend === 'declining' && <TrendingDown className="h-3 w-3 text-red-500" />}
                      {stats.trend === 'stable' && <Minus className="h-3 w-3 text-muted-foreground" />}
                      <span className="text-xs font-medium text-muted-foreground">
                        {Math.round((stats.successfulInputs / stats.totalInputs) * 100)}% accuracy
                      </span>
                    </div>
                  )}
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── Quick Phrases ────────────────────────────── */}
      <div>
        <h2 className="text-xl font-black mb-4 flex items-center gap-2">
          <Star className="h-5 w-5" /> Quick Phrases
        </h2>
        <div className="flex flex-wrap gap-2">
          {(phrases.length > 0 ? phrases : [
            'Hello!', 'Thank you', 'Yes', 'No', 'Help me please',
            'I need a break', 'I love you', 'Good morning',
          ]).map((phrase, i) => (
            <Button
              key={i}
              variant="outline"
              onClick={() => appendOutput(phrase + ' ')}
              className="border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all font-bold text-sm"
            >
              {phrase}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

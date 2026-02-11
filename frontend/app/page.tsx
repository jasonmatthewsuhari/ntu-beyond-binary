'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useFluentContext } from '@/lib/fluent-context'
import { getFrequentPhrases, getModeStats, getSuggestion } from '@/lib/adaptive-engine'
import { INPUT_MODES } from '@/components/app-shell'
import { getEnabledInputModes, getCurrentProfile } from '@/lib/profile-utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Zap, TrendingUp, TrendingDown, Minus, AlertTriangle,
  Smile, Meh, Frown, Heart, HelpCircle, Star, Sparkles
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
  const [enabledModes, setEnabledModes] = useState<string[]>([])
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    setPhrases(getFrequentPhrases())
    setSuggestion(getSuggestion())
    setEnabledModes(getEnabledInputModes())
    setProfile(getCurrentProfile())
  }, [])

  // Filter INPUT_MODES based on user's enabled inputs
  const filteredModes = INPUT_MODES.filter(mode => enabledModes.includes(mode.id))
  
  // Get primary input mode for highlighting
  const primaryMode = profile?.primaryInput ? 
    INPUT_MODES.find(mode => {
      const inputTypeMap: any = {
        'voice': 'voice',
        'motion': 'head-motion',
        'switch': 'switch',
        'blink': 'eye-gaze',
        'gaze': 'eye-gaze',
        'head': 'head-motion',
        'sign': 'sign',
        'facial': 'facial',
        'sip-puff': 'sip-puff'
      }
      return mode.id === inputTypeMap[profile.primaryInput]
    })?.id
    : null

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
        {profile && profile.availableInputs && profile.availableInputs.length > 0 && (
          <div className="flex items-center gap-2 mt-3 text-sm font-medium">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">
              Optimized for: <span className="font-bold text-foreground">
                {profile.availableInputs.map((input: string) => 
                  input.charAt(0).toUpperCase() + input.slice(1)
                ).join(', ')}
              </span>
            </span>
          </div>
        )}
      </div>

            {/* ── Onboarding Prompt ───────────────────────── */}
            {(!profile || !profile.availableInputs || profile.availableInputs.length === 0) && (
                <div className="flex items-center gap-3 p-4 bg-primary/10 border-4 border-primary rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Sparkles className="h-5 w-5 flex-shrink-0 text-primary" />
          <p className="text-sm font-bold flex-1">
            Complete onboarding to optimize Fluent for your preferred inputs!
          </p>
          <Link href="/onboarding">
            <Button size="sm" className="font-bold border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-primary text-primary-foreground">
              Start Now
            </Button>
          </Link>
        </div>
      )}

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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredModes.map((mode) => {
          const Icon = mode.icon
          const stats = getModeStats().find(s => s.mode === mode.id)
          const isPrimary = mode.id === primaryMode
          return (
            <Link key={mode.id} href={mode.href}>
              <Card className={`group p-4 border-4 ${isPrimary ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border'} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer h-full`}>
                <div className={`w-12 h-12 rounded-xl border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${mode.color} flex items-center justify-center mb-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-base">{mode.label}</h3>
                  {isPrimary && (
                    <span className="text-xs font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                      PRIMARY
                    </span>
                  )}
                </div>
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

'use client'

import React, { useState, useEffect } from 'react'
import { useFluentContext, type ThemeName } from '@/lib/fluent-context'
import { resetAdaptive } from '@/lib/adaptive-engine'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Settings, Palette, Type, Monitor, Hand, Volume2,
    ShieldAlert, User, RotateCcw, Download, Upload, Save
} from 'lucide-react'

const THEMES: { id: ThemeName; name: string; desc: string; preview: string }[] = [
    { id: 'light', name: 'Light', desc: 'Bright neobrutalist yellow', preview: 'bg-yellow-400 border-black' },
    { id: 'dark', name: 'Dark', desc: 'Easy on the eyes', preview: 'bg-gray-800 border-gray-600' },
    { id: 'high-contrast', name: 'High Contrast', desc: 'Maximum visibility', preview: 'bg-black border-white' },
    { id: 'colorblind', name: 'Colorblind Safe', desc: 'Blue/orange palette', preview: 'bg-blue-600 border-orange-400' },
    { id: 'calm', name: 'Calm', desc: 'Soft, reduced stimuli', preview: 'bg-indigo-100 border-indigo-300' },
]

export default function SettingsPage() {
    const { settings, updateSetting, resetSettings } = useFluentContext()
    const [activeTab, setActiveTab] = useState('appearance')
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
    const [profileName, setProfileName] = useState('')
    const [savedProfiles, setSavedProfiles] = useState<string[]>([])
    const [sosContacts, setSosContacts] = useState(settings.sosContacts.join(', '))

    useEffect(() => {
        const loadVoices = () => setVoices(window.speechSynthesis.getVoices())
        loadVoices()
        window.speechSynthesis.onvoiceschanged = loadVoices
        try {
            const profiles = JSON.parse(localStorage.getItem('fluent-profiles') || '{}')
            setSavedProfiles(Object.keys(profiles))
        } catch { }
    }, [])

    const saveProfile = () => {
        if (!profileName.trim()) return
        try {
            const profiles = JSON.parse(localStorage.getItem('fluent-profiles') || '{}')
            profiles[profileName] = settings
            localStorage.setItem('fluent-profiles', JSON.stringify(profiles))
            setSavedProfiles(Object.keys(profiles))
            setProfileName('')
        } catch { }
    }

    const loadProfile = (name: string) => {
        try {
            const profiles = JSON.parse(localStorage.getItem('fluent-profiles') || '{}')
            if (profiles[name]) {
                Object.entries(profiles[name]).forEach(([key, value]) => {
                    updateSetting(key as any, value as any)
                })
            }
        } catch { }
    }

    const exportSettings = () => {
        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'fluent-settings.json'
        a.click()
        URL.revokeObjectURL(url)
    }

    const TABS = [
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'input', label: 'Input Tuning', icon: Hand },
        { id: 'output', label: 'Output', icon: Volume2 },
        { id: 'profiles', label: 'Profiles', icon: User },
        { id: 'emergency', label: 'Emergency', icon: ShieldAlert },
    ]

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-black flex items-center gap-3">
                    <Settings className="h-8 w-8" /> Settings
                </h1>
                <p className="text-sm font-medium text-muted-foreground mt-1">Customize Fluent to your needs</p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
                {TABS.map(tab => {
                    const Icon = tab.icon
                    return (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border-2 border-border font-bold text-sm transition-all
                shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]
                ${activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                            <Icon className="h-4 w-4" /> {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* ── Appearance ──────────────────────────────── */}
            {activeTab === 'appearance' && (
                <Card className="p-6 border-4 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
                    <div>
                        <h3 className="font-black text-lg mb-3 flex items-center gap-2"><Palette className="h-5 w-5" /> Theme</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            {THEMES.map(theme => (
                                <button key={theme.id} onClick={() => updateSetting('theme', theme.id)}
                                    className={`p-3 rounded-xl border-2 transition-all
                    shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]
                    ${settings.theme === theme.id ? 'border-primary ring-2 ring-primary' : 'border-border'}`}>
                                    <div className={`w-full h-8 rounded-lg border-2 mb-2 ${theme.preview}`} />
                                    <p className="text-xs font-black">{theme.name}</p>
                                    <p className="text-[10px] text-muted-foreground">{theme.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-black text-lg mb-3 flex items-center gap-2"><Type className="h-5 w-5" /> Typography</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-bold w-32">Font Size</label>
                                <input type="range" min={12} max={32} value={settings.fontSize}
                                    onChange={(e) => updateSetting('fontSize', Number(e.target.value))} className="flex-1" />
                                <span className="text-sm font-bold w-12">{settings.fontSize}px</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-bold w-32">Line Height</label>
                                <input type="range" min={1.2} max={2.5} step={0.1} value={settings.lineHeight}
                                    onChange={(e) => updateSetting('lineHeight', Number(e.target.value))} className="flex-1" />
                                <span className="text-sm font-bold w-12">{settings.lineHeight}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-bold w-32">Letter Spacing</label>
                                <input type="range" min={0} max={4} step={0.5} value={settings.letterSpacing}
                                    onChange={(e) => updateSetting('letterSpacing', Number(e.target.value))} className="flex-1" />
                                <span className="text-sm font-bold w-12">{settings.letterSpacing}px</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-bold w-32">Dyslexia Font</label>
                                <button onClick={() => updateSetting('fontFamily', settings.fontFamily === 'opendyslexic' ? 'inter' : 'opendyslexic')}
                                    className={`px-4 py-1.5 rounded-lg border-2 border-border font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                    ${settings.fontFamily === 'opendyslexic' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                                    {settings.fontFamily === 'opendyslexic' ? 'ON' : 'OFF'}
                                </button>
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-bold w-32">Reduced Motion</label>
                                <button onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                                    className={`px-4 py-1.5 rounded-lg border-2 border-border font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                    ${settings.reducedMotion ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                                    {settings.reducedMotion ? 'ON' : 'OFF'}
                                </button>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* ── Input Tuning ─────────────────────────────── */}
            {activeTab === 'input' && (
                <Card className="p-6 border-4 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
                    <div>
                        <h3 className="font-black text-lg mb-3">Morse Code Timing</h3>
                        <div className="space-y-3">
                            {([
                                ['Dash Threshold', 'dash', 200, 800, 'ms'] as const,
                                ['Letter Gap', 'letterGap', 500, 3000, 'ms'] as const,
                                ['Word Gap', 'wordGap', 1000, 5000, 'ms'] as const,
                            ]).map(([label, key, min, max, unit]) => (
                                <div key={key} className="flex items-center gap-4">
                                    <label className="text-sm font-bold w-36">{label}</label>
                                    <input type="range" min={min} max={max} step={50}
                                        value={settings.morseThresholds[key]}
                                        onChange={(e) => updateSetting('morseThresholds', { ...settings.morseThresholds, [key]: Number(e.target.value) })}
                                        className="flex-1" />
                                    <span className="text-sm font-bold w-16">{settings.morseThresholds[key]}{unit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-black text-lg mb-3">Eye Gaze</h3>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-bold w-36">Dwell Time</label>
                            <input type="range" min={400} max={3000} step={100} value={settings.dwellTime}
                                onChange={(e) => updateSetting('dwellTime', Number(e.target.value))} className="flex-1" />
                            <span className="text-sm font-bold w-16">{settings.dwellTime}ms</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-black text-lg mb-3">Switch Scanning</h3>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-bold w-36">Scan Speed</label>
                            <input type="range" min={500} max={4000} step={100} value={settings.scanSpeed}
                                onChange={(e) => updateSetting('scanSpeed', Number(e.target.value))} className="flex-1" />
                            <span className="text-sm font-bold w-16">{settings.scanSpeed}ms</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-black text-lg mb-3">Tremor Filter</h3>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-bold w-36">Filter Strength</label>
                            <input type="range" min={0} max={100} value={settings.tremorFilter}
                                onChange={(e) => updateSetting('tremorFilter', Number(e.target.value))} className="flex-1" />
                            <span className="text-sm font-bold w-16">{settings.tremorFilter}%</span>
                        </div>
                    </div>
                </Card>
            )}

            {/* ── Output ───────────────────────────────────── */}
            {activeTab === 'output' && (
                <Card className="p-6 border-4 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
                    <h3 className="font-black text-lg mb-1">Text-to-Speech</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-bold w-32">Voice</label>
                            <select value={settings.ttsVoice}
                                onChange={(e) => updateSetting('ttsVoice', e.target.value)}
                                className="flex-1 px-3 py-1.5 border-2 border-border rounded-lg text-sm font-medium bg-input">
                                <option value="">Default</option>
                                {voices.map(v => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
                            </select>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-bold w-32">Speed</label>
                            <input type="range" min={0.5} max={2} step={0.1} value={settings.ttsSpeed}
                                onChange={(e) => updateSetting('ttsSpeed', Number(e.target.value))} className="flex-1" />
                            <span className="text-sm font-bold w-12">{settings.ttsSpeed}x</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-bold w-32">Pitch</label>
                            <input type="range" min={0.5} max={2} step={0.1} value={settings.ttsPitch}
                                onChange={(e) => updateSetting('ttsPitch', Number(e.target.value))} className="flex-1" />
                            <span className="text-sm font-bold w-12">{settings.ttsPitch}</span>
                        </div>
                    </div>
                    <Button onClick={() => {
                        const u = new SpeechSynthesisUtterance('This is how Fluent sounds with your current settings.')
                        u.rate = settings.ttsSpeed; u.pitch = settings.ttsPitch
                        if (settings.ttsVoice) { const v = voices.find(v => v.name === settings.ttsVoice); if (v) u.voice = v }
                        window.speechSynthesis.speak(u)
                    }} className="gap-2 font-bold border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        <Volume2 className="h-4 w-4" /> Test Voice
                    </Button>
                </Card>
            )}

            {/* ── Profiles ─────────────────────────────────── */}
            {activeTab === 'profiles' && (
                <Card className="p-6 border-4 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
                    <div>
                        <h3 className="font-black text-lg mb-3">Save Current Settings</h3>
                        <div className="flex gap-2">
                            <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)}
                                placeholder="Profile name (e.g. 'Work', 'Home')"
                                className="flex-1 px-3 py-2 border-2 border-border rounded-lg text-sm font-medium bg-input" />
                            <Button onClick={saveProfile} className="gap-1.5 font-bold border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                <Save className="h-4 w-4" /> Save
                            </Button>
                        </div>
                    </div>
                    {savedProfiles.length > 0 && (
                        <div>
                            <h3 className="font-black text-lg mb-3">Saved Profiles</h3>
                            <div className="flex flex-wrap gap-2">
                                {savedProfiles.map(name => (
                                    <Button key={name} variant="outline" onClick={() => loadProfile(name)}
                                        className="font-bold border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                        {name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={exportSettings}
                            className="gap-1.5 font-bold border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                            <Download className="h-4 w-4" /> Export JSON
                        </Button>
                        <Button variant="outline" onClick={resetSettings}
                            className="gap-1.5 font-bold border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-destructive">
                            <RotateCcw className="h-4 w-4" /> Reset All
                        </Button>
                        <Button variant="outline" onClick={resetAdaptive}
                            className="gap-1.5 font-bold border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                            <RotateCcw className="h-4 w-4" /> Reset Usage Data
                        </Button>
                        <Button variant="outline" onClick={() => {
                            localStorage.removeItem('fluent-onboarding-complete')
                            localStorage.removeItem('fluent-primary-input')
                            localStorage.removeItem('fluent-calibration')
                            window.location.href = '/onboarding'
                        }}
                            className="gap-1.5 font-bold border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-orange-600">
                            <RotateCcw className="h-4 w-4" /> Reset Onboarding
                        </Button>
                    </div>
                </Card>
            )}

            {/* ── Emergency ─────────────────────────────────── */}
            {activeTab === 'emergency' && (
                <Card className="p-6 border-4 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
                    <h3 className="font-black text-lg flex items-center gap-2"><ShieldAlert className="h-5 w-5 text-destructive" /> Emergency SOS</h3>
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-bold w-36">SOS Enabled</label>
                        <button onClick={() => updateSetting('sosEnabled', !settings.sosEnabled)}
                            className={`px-4 py-1.5 rounded-lg border-2 border-border font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                ${settings.sosEnabled ? 'bg-destructive text-destructive-foreground' : 'bg-card'}`}>
                            {settings.sosEnabled ? 'ON' : 'OFF'}
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-bold w-36">Trigger Method</label>
                        <select value={settings.sosTrigger}
                            onChange={(e) => updateSetting('sosTrigger', e.target.value as any)}
                            className="px-3 py-1.5 border-2 border-border rounded-lg text-sm font-bold bg-input">
                            <option value="taps">5 Rapid Taps</option>
                            <option value="blinks">3 Rapid Blinks</option>
                            <option value="voice">Voice Keyword</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-bold block mb-2">Emergency Contacts (comma-separated)</label>
                        <input type="text" value={sosContacts}
                            onChange={(e) => {
                                setSosContacts(e.target.value)
                                updateSetting('sosContacts', e.target.value.split(',').map(s => s.trim()).filter(Boolean))
                            }}
                            placeholder="email@example.com, +1234567890"
                            className="w-full px-3 py-2 border-2 border-border rounded-lg text-sm font-medium bg-input" />
                    </div>
                    <div className="p-3 bg-destructive/10 border-2 border-destructive/30 rounded-xl">
                        <p className="text-xs font-bold text-destructive">
                            ⚠️ SOS will send your pre-configured emergency message to all contacts listed above.
                            Make sure at least one contact is set up.
                        </p>
                    </div>
                </Card>
            )}
        </div>
    )
}

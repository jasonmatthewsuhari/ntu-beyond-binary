'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { User, Plus, Trash2 } from 'lucide-react'

interface Profile {
    name: string
    primaryInput: string
    lastUsed: string
    calibration?: any
}

export default function ProfileSelectPage() {
    const router = useRouter()
    const [profiles, setProfiles] = useState<Profile[]>([])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [scanMode, setScanMode] = useState(false)

    useEffect(() => {
        // Load saved profiles
        try {
            const savedProfiles = JSON.parse(localStorage.getItem('fluent-user-profiles') || '[]')
            setProfiles(savedProfiles)
        } catch {
            setProfiles([])
        }

        // Start auto-scan after 5 seconds
        const timer = setTimeout(() => {
            setScanMode(true)
            const utterance = new SpeechSynthesisUtterance(
                'Auto-scan mode. Press any key to select the highlighted profile.'
            )
            window.speechSynthesis.speak(utterance)
        }, 5000)

        return () => {
            clearTimeout(timer)
            window.speechSynthesis.cancel() // Stop speech when leaving page
        }
    }, [])

    // Auto-scan through profiles
    useEffect(() => {
        if (!scanMode) return

        const interval = setInterval(() => {
            setSelectedIndex(prev => (prev + 1) % (profiles.length + 1)) // +1 for "New Profile"
        }, 2000)

        return () => clearInterval(interval)
    }, [scanMode, profiles.length])

    // Keyboard selection
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                selectProfile(selectedIndex)
            } else if (e.key === 'ArrowDown') {
                setSelectedIndex(prev => (prev + 1) % (profiles.length + 1))
            } else if (e.key === 'ArrowUp') {
                setSelectedIndex(prev => (prev - 1 + profiles.length + 1) % (profiles.length + 1))
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [selectedIndex, profiles.length])

    const selectProfile = (index: number) => {
        console.log('Selecting profile:', index, 'Total profiles:', profiles.length)

        if (index === profiles.length) {
            // New Profile - go to onboarding
            console.log('Starting new profile - clearing flags and navigating to onboarding')

            // Clear all onboarding flags
            localStorage.removeItem('fluent-onboarding-complete')
            localStorage.removeItem('fluent-current-profile')
            localStorage.removeItem('fluent-primary-input')
            localStorage.removeItem('fluent-calibration')

            // Set intentional navigation flag to prevent ClientLayout from redirecting
            sessionStorage.setItem('fluent-intentional-nav', 'true')

            // Navigate to onboarding
            console.log('Navigating to /onboarding')
            router.push('/onboarding')
        } else {
            // Load existing profile
            const profile = profiles[index]
            console.log('Loading existing profile:', profile.name)
            localStorage.setItem('fluent-current-profile', profile.name)
            localStorage.setItem('fluent-onboarding-complete', 'true')

            // Update last used
            profile.lastUsed = new Date().toISOString()
            const updatedProfiles = [...profiles]
            updatedProfiles[index] = profile
            localStorage.setItem('fluent-user-profiles', JSON.stringify(updatedProfiles))

            // Set intentional navigation flag
            sessionStorage.setItem('fluent-intentional-nav', 'true')

            router.push('/')
        }
    }

    const deleteProfile = (index: number, e: React.MouseEvent) => {
        e.stopPropagation()
        const updatedProfiles = profiles.filter((_, i) => i !== index)
        setProfiles(updatedProfiles)
        localStorage.setItem('fluent-user-profiles', JSON.stringify(updatedProfiles))
    }

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center p-8">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-6xl font-black mb-4 text-black">Welcome to Fluent</h1>
                    <p className="text-2xl font-bold text-black/80">
                        {scanMode ? 'Press any key to select' : 'Choose your profile or create a new one'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Existing Profiles */}
                    {profiles.map((profile, index) => (
                        <button
                            key={profile.name}
                            onClick={() => selectProfile(index)}
                            className={`relative p-6 rounded-2xl border-4 border-black transition-all
                ${selectedIndex === index
                                    ? 'bg-white scale-105 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
                                    : 'bg-white/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-105'}`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <User className="h-12 w-12" />
                                <button
                                    onClick={(e) => deleteProfile(index, e)}
                                    className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                                    aria-label="Delete profile"
                                >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                </button>
                            </div>

                            <h3 className="text-2xl font-black mb-2">{profile.name}</h3>
                            <p className="text-sm font-bold text-gray-600 mb-1">
                                Primary Input: {profile.primaryInput || 'Not set'}
                            </p>
                            <p className="text-xs text-gray-500">
                                Last used: {new Date(profile.lastUsed).toLocaleDateString()}
                            </p>

                            {selectedIndex === index && scanMode && (
                                <div className="absolute inset-0 border-4 border-green-500 rounded-2xl animate-pulse pointer-events-none" />
                            )}
                        </button>
                    ))}

                    {/* New Profile Button */}
                    <button
                        onClick={() => selectProfile(profiles.length)}
                        className={`p-6 rounded-2xl border-4 border-black transition-all flex flex-col items-center justify-center min-h-[200px]
              ${selectedIndex === profiles.length
                                ? 'bg-green-400 scale-105 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
                                : 'bg-green-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-105'}`}
                    >
                        <Plus className="h-16 w-16 mb-4" />
                        <h3 className="text-2xl font-black">New Profile</h3>
                        <p className="text-sm font-bold text-black/70 mt-2">
                            Start onboarding
                        </p>

                        {selectedIndex === profiles.length && scanMode && (
                            <div className="absolute inset-0 border-4 border-green-500 rounded-2xl animate-pulse pointer-events-none" />
                        )}
                    </button>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm font-bold text-black/60">
                        Use arrow keys to navigate, Enter or Space to select
                    </p>
                </div>
            </div>

            {/* Screen reader */}
            <div className="sr-only" role="status" aria-live="polite">
                {selectedIndex === profiles.length
                    ? 'New Profile selected. Press Enter to start onboarding.'
                    : profiles[selectedIndex]
                        ? `${profiles[selectedIndex].name} profile selected. Press Enter to continue.`
                        : 'Select a profile'}
            </div>
        </div>
    )
}

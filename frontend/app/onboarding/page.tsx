'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BeaconScreen } from '@/components/onboarding/beacon-screen'
import { LockOnScreen } from '@/components/onboarding/lock-on-screen'
import { InputExplorer } from '@/components/onboarding/input-explorer'
import { type InputType } from '@/lib/use-passive-sensing'
import { useFluentContext } from '@/lib/fluent-context'

type OnboardingStep = 'beacon' | 'lock-on' | 'explore' | 'name' | 'complete'

export default function OnboardingPage() {
    const router = useRouter()
    const { updateSetting } = useFluentContext()
    const [step, setStep] = useState<OnboardingStep>('beacon')
    const [detectedInputType, setDetectedInputType] = useState<InputType>('none')
    const [allDetectedInputs, setAllDetectedInputs] = useState<InputType[]>([])
    const [profileName, setProfileName] = useState('')

    const handleInputDetected = (type: InputType) => {
        console.log('🎯 OnboardingPage.handleInputDetected called with type:', type)
        setDetectedInputType(type)
        setAllDetectedInputs([type])
        setStep('lock-on')
    }

    const handleLockOnConfirmed = () => {
        console.log('Lock-on confirmed, exploring other inputs')
        setStep('explore')
    }

    const handleLockOnTimeout = () => {
        console.log('Lock-on timeout, returning to beacon')
        setStep('beacon')
        setDetectedInputType('none')
    }

    const handleExplorationComplete = (allInputs: InputType[]) => {
        console.log('Exploration complete:', allInputs)
        setAllDetectedInputs(allInputs)
        setStep('name')
    }

    const handleProfileNameSubmit = () => {
        if (!profileName.trim() || allDetectedInputs.length === 0) return

        // Default settings based on inputs
        updateSetting('dwellTime', 1000)
        updateSetting('tremorFilter', 0)

        // Create profile object
        const profile = {
            name: profileName.trim(),
            primaryInput: detectedInputType,
            availableInputs: allDetectedInputs,
            lastUsed: new Date().toISOString(),
            calibration: {
                primaryInput: detectedInputType,
                availableInputs: allDetectedInputs,
                precision: 'medium' as const,
                tremorDetected: false,
                dwellTime: 1000,
                rangeOfMotion: 100,
                preferredSpeed: 'medium' as const
            }
        }

        // Save to profiles list
        const existingProfiles = JSON.parse(localStorage.getItem('fluent-user-profiles') || '[]')
        existingProfiles.push(profile)
        localStorage.setItem('fluent-user-profiles', JSON.stringify(existingProfiles))

        // Mark onboarding as complete
        localStorage.setItem('fluent-onboarding-complete', 'true')
        localStorage.setItem('fluent-current-profile', profileName.trim())
        localStorage.setItem('fluent-primary-input', detectedInputType)
        localStorage.setItem('fluent-available-inputs', JSON.stringify(allDetectedInputs))
        localStorage.setItem('fluent-calibration', JSON.stringify(profile.calibration))

        setStep('complete')

        // Redirect to dashboard after showing success
        setTimeout(() => {
            router.push('/')
        }, 3000)
    }

    const handleSkipOnboarding = () => {
        // Set minimal defaults
        updateSetting('dwellTime', 1000)
        updateSetting('tremorFilter', 0)

        // Create default profile
        const defaultProfile = {
            name: 'Guest',
            primaryInput: 'type' as InputType,
            availableInputs: ['type', 'voice'] as InputType[],
            lastUsed: new Date().toISOString(),
            calibration: {
                primaryInput: 'type' as InputType,
                availableInputs: ['type', 'voice'] as InputType[],
                precision: 'medium' as const,
                tremorDetected: false,
                dwellTime: 1000,
                rangeOfMotion: 100,
                preferredSpeed: 'medium' as const
            }
        }

        // Save minimal profile
        const existingProfiles = JSON.parse(localStorage.getItem('fluent-user-profiles') || '[]')
        existingProfiles.push(defaultProfile)
        localStorage.setItem('fluent-user-profiles', JSON.stringify(existingProfiles))

        // Mark onboarding as skipped/complete
        localStorage.setItem('fluent-onboarding-complete', 'true')
        localStorage.setItem('fluent-current-profile', 'Guest')
        localStorage.setItem('fluent-primary-input', 'type')
        localStorage.setItem('fluent-available-inputs', JSON.stringify(['type', 'voice']))
        localStorage.setItem('fluent-calibration', JSON.stringify(defaultProfile.calibration))

        // Redirect to dashboard
        router.push('/')
    }

    return (
        <>
            {/* Skip Button - Always visible except on complete step */}
            {step !== 'complete' && (
                <button
                    onClick={handleSkipOnboarding}
                    className="fixed top-6 left-6 z-50 bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all"
                    aria-label="Skip onboarding"
                >
                    Skip Onboarding →
                </button>
            )}

            {step === 'beacon' && <BeaconScreen onInputDetected={handleInputDetected} />}

            {step === 'lock-on' && (
                <LockOnScreen
                    detectedInput={detectedInputType}
                    onConfirmed={handleLockOnConfirmed}
                    onTimeout={handleLockOnTimeout}
                />
            )}

            {step === 'explore' && (
                <InputExplorer
                    primaryInput={detectedInputType}
                    detectedInputs={allDetectedInputs}
                    onComplete={handleExplorationComplete}
                />
            )}

            {step === 'name' && (
                <div className="fixed inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-8">
                    <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 max-w-md w-full">
                        <h2 className="text-3xl font-black mb-4 text-center">What's your name?</h2>
                        <p className="text-gray-600 mb-6 text-center">This helps us save your settings</p>

                        <input
                            type="text"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleProfileNameSubmit()}
                            placeholder="Enter your name"
                            className="w-full px-4 py-3 border-4 border-black rounded-lg text-lg font-bold mb-4 focus:outline-none focus:ring-4 focus:ring-blue-400"
                            autoFocus
                        />

                        <button
                            onClick={handleProfileNameSubmit}
                            disabled={!profileName.trim()}
                            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-black py-3 px-6 rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all disabled:cursor-not-allowed"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {step === 'complete' && (
                <div className="fixed inset-0 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-8">
                    <div className="text-center">
                        <div className="text-9xl mb-8 animate-bounce">✓</div>
                        <h1 className="text-6xl font-black text-white mb-4">Welcome, {profileName}!</h1>
                        <p className="text-2xl text-white/80 font-bold">Your profile is ready</p>
                        <p className="text-lg text-white/60 mt-4">
                            Primary Input: {detectedInputType}
                        </p>
                        {allDetectedInputs.length > 1 && (
                            <p className="text-lg text-white/60">
                                Also available: {allDetectedInputs.filter(i => i !== detectedInputType).join(', ')}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

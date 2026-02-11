'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { FluentProvider } from '@/lib/fluent-context'
import { AppShell } from '@/components/app-shell'
import { TitleBar } from '@/components/title-bar'

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const [isOnboarding, setIsOnboarding] = useState(false)
    const [isProfileSelect, setIsProfileSelect] = useState(false)
    const [checkComplete, setCheckComplete] = useState(false)

    useEffect(() => {
        console.log('ClientLayout check - pathname:', pathname)

        // Don't redirect if already on onboarding or profile-select pages
        if (pathname === '/onboarding' || pathname === '/profile-select') {
            console.log('Already on special page, skipping redirect check')
            setIsOnboarding(pathname === '/onboarding')
            setIsProfileSelect(pathname === '/profile-select')
            setCheckComplete(true)
            return
        }

        // Check for intentional navigation flag
        const intentionalNav = sessionStorage.getItem('fluent-intentional-nav')
        if (intentionalNav) {
            console.log('Intentional navigation detected, clearing flag')
            sessionStorage.removeItem('fluent-intentional-nav')
            setCheckComplete(true)
            return
        }

        // Check if user has a current profile
        const currentProfile = localStorage.getItem('fluent-current-profile')
        const onboardingComplete = localStorage.getItem('fluent-onboarding-complete')

        console.log('Profile check - current:', currentProfile, 'complete:', onboardingComplete)

        // If no current profile, go to profile select
        if (!currentProfile) {
            console.log('No profile, redirecting to profile-select')
            setIsProfileSelect(true)
            router.replace('/profile-select')
        }
        // If profile exists but onboarding not complete, go to onboarding
        else if (!onboardingComplete) {
            console.log('Profile exists but incomplete, redirecting to onboarding')
            setIsOnboarding(true)
            router.replace('/onboarding')
        } else {
            console.log('Profile complete, staying on current page')
            setIsOnboarding(false)
            setIsProfileSelect(false)
        }

        setCheckComplete(true)
    }, [pathname, router])

    // Don't render until we've checked profile status
    if (!checkComplete) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white animate-pulse" />
            </div>
        )
    }

    return (
        <FluentProvider>
            <div className="flex flex-col h-screen overflow-hidden">
                {/* Title Bar - shown on all pages */}
                <TitleBar />

                {/* Main content area with top padding for fixed title bar */}
                <div className="flex-1 overflow-hidden pt-10">
                    {/* If on onboarding or profile select page, don't show AppShell */}
                    {(isOnboarding || isProfileSelect) ? (
                        children
                    ) : (
                        <AppShell>{children}</AppShell>
                    )}
                </div>
            </div>
        </FluentProvider>
    )
}

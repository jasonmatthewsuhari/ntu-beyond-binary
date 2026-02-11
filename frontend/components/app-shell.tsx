'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useFluentContext } from '@/lib/fluent-context'
import { getEnabledInputModes } from '@/lib/profile-utils'
import { OutputPanel } from '@/components/output-panel'
import { SOSButton } from '@/components/sos-button'
import {
    Mic, Pencil, Hand, Keyboard, Accessibility, Eye, Move,
    Smile, Wind, ToggleLeft, LayoutGrid, Sparkles,
    Settings, Home, PanelLeftClose, PanelLeft, LogOut
} from 'lucide-react'

export const INPUT_MODES = [
    { id: 'voice', label: 'Voice', icon: Mic, href: '/input/voice', color: 'bg-blue-500' },
    { id: 'draw', label: 'Draw', icon: Pencil, href: '/input/draw', color: 'bg-orange-500' },
    { id: 'haptic', label: 'Haptic', icon: Hand, href: '/input/haptic', color: 'bg-purple-500' },
    { id: 'type', label: 'Type', icon: Keyboard, href: '/input/type', color: 'bg-green-500' },
    { id: 'sign', label: 'Sign', icon: Accessibility, href: '/input/sign', color: 'bg-pink-500' },
    { id: 'eye-gaze', label: 'Eye Gaze', icon: Eye, href: '/input/eye-gaze', color: 'bg-cyan-500' },
    { id: 'head-motion', label: 'Head', icon: Move, href: '/input/head-motion', color: 'bg-amber-500' },
    { id: 'facial', label: 'Facial', icon: Smile, href: '/input/facial', color: 'bg-rose-500' },
    { id: 'sip-puff', label: 'Sip/Puff', icon: Wind, href: '/input/sip-puff', color: 'bg-teal-500' },
    { id: 'switch', label: 'Switch', icon: ToggleLeft, href: '/input/switch', color: 'bg-indigo-500' },
    { id: 'board', label: 'Board', icon: LayoutGrid, href: '/input/communication-board', color: 'bg-yellow-600' },
    { id: 'custom', label: 'Custom', icon: Sparkles, href: '/input/custom', color: 'bg-violet-500' },
]

export function AppShell({ children }: { children: React.ReactNode }) {
    const { sidebarOpen, setSidebarOpen } = useFluentContext()
    const pathname = usePathname()
    const router = useRouter()
    const [enabledModes, setEnabledModes] = useState<string[]>([])

    // Load enabled modes on mount
    useEffect(() => {
        setEnabledModes(getEnabledInputModes())
    }, [])

    // Filter INPUT_MODES based on user's profile
    const filteredModes = INPUT_MODES.filter(mode => enabledModes.includes(mode.id))

    // Auto-collapse sidebar when window is small
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 600 && sidebarOpen) {
                setSidebarOpen(false)
            }
        }

        handleResize() // Check on mount
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [sidebarOpen, setSidebarOpen])

    const handleSignOut = () => {
        localStorage.removeItem('fluent-current-profile')
        router.push('/profile-select')
    }

    return (
        <div className="flex flex-1 overflow-hidden">
            {/* ── Sidebar ──────────────────────────────────── */}
            <aside
                className={`flex flex-col border-r-4 border-border bg-[hsl(var(--sidebar-bg))] transition-all duration-200 flex-shrink-0 ${sidebarOpen ? 'w-56' : 'w-16'
                    }`}
                role="navigation"
                aria-label="Main navigation"
            >
                {/* Toggle */}
                <div className="flex items-center justify-between p-2 sm:p-3 border-b-4 border-border">
                    {sidebarOpen && (
                        <Link href="/" className="font-black text-base sm:text-lg text-foreground tracking-tight">
                            Fluent
                        </Link>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1.5 sm:p-2 rounded-lg hover:bg-muted transition-colors"
                        aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                    >
                        {sidebarOpen ? <PanelLeftClose className="h-4 w-4 sm:h-5 sm:w-5" /> : <PanelLeft className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </button>
                </div>

                {/* Home */}
                <Link
                    href="/"
                    className={`flex items-center ${sidebarOpen ? 'gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5' : 'justify-center p-2.5'} mx-1.5 sm:mx-2 mt-1.5 sm:mt-2 ${sidebarOpen ? 'rounded-lg' : 'rounded-full aspect-square'} font-bold text-xs sm:text-sm transition-all ${pathname === '/'
                        ? 'bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                        : 'hover:bg-muted text-foreground'
                        }`}
                    aria-current={pathname === '/' ? 'page' : undefined}
                >
                    <Home className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    {sidebarOpen && <span>Dashboard</span>}
                </Link>

                {/* Mode links */}
                <div className="flex-1 overflow-y-auto px-1.5 sm:px-2 py-1.5 sm:py-2 space-y-0.5 custom-scrollbar" role="list" aria-label="Input modes">
                    {filteredModes.map((mode) => {
                        const Icon = mode.icon
                        const isActive = pathname.startsWith(mode.href)
                        return (
                            <Link
                                key={mode.id}
                                href={mode.href}
                                role="listitem"
                                className={`flex items-center ${sidebarOpen ? 'gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2' : 'justify-center p-2'} ${sidebarOpen ? 'rounded-lg' : 'rounded-full aspect-square'} font-semibold text-xs sm:text-sm transition-all ${isActive
                                    ? 'bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                                    : 'hover:bg-muted text-foreground'
                                    }`}
                                aria-current={isActive ? 'page' : undefined}
                                title={mode.label}
                            >
                                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                                {sidebarOpen && <span>{mode.label}</span>}
                            </Link>
                        )
                    })}
                </div>

                {/* Bottom: Settings, Sign Out, SOS */}
                <div className="border-t-4 border-border p-1.5 sm:p-2 space-y-0.5 sm:space-y-1">
                    <Link
                        href="/settings"
                        className={`flex items-center ${sidebarOpen ? 'gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2' : 'justify-center p-2'} ${sidebarOpen ? 'rounded-lg' : 'rounded-full aspect-square'} font-semibold text-xs sm:text-sm transition-all ${pathname === '/settings'
                            ? 'bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                            : 'hover:bg-muted text-foreground'
                            }`}
                    >
                        <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                        {sidebarOpen && <span>Settings</span>}
                    </Link>

                    <button
                        onClick={handleSignOut}
                        className={`w-full flex items-center ${sidebarOpen ? 'gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2' : 'justify-center p-2'} ${sidebarOpen ? 'rounded-lg' : 'rounded-full aspect-square'} font-semibold text-xs sm:text-sm transition-all hover:bg-muted text-foreground`}
                        aria-label="Sign out"
                    >
                        <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                        {sidebarOpen && <span>Sign Out</span>}
                    </button>

                    <SOSButton compact={!sidebarOpen} />
                </div>
            </aside>

            {/* ── Main Content + Output ────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <main className="flex-1 overflow-y-auto p-2 sm:p-6 custom-scrollbar">{children}</main>
                <OutputPanel />
            </div>
        </div>
    )
}

export { INPUT_MODES }

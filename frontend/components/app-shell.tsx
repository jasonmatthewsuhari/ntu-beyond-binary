'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useFluentContext } from '@/lib/fluent-context'
import { OutputPanel } from '@/components/output-panel'
import { SOSButton } from '@/components/sos-button'
import {
    Mic, Pencil, Hand, Keyboard, Accessibility, Eye, Move,
    Smile, Wind, ToggleLeft, LayoutGrid, Sparkles,
    Settings, Home, PanelLeftClose, PanelLeft,
} from 'lucide-react'

const INPUT_MODES = [
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

    return (
        <div className="flex h-screen overflow-hidden">
            {/* ── Sidebar ──────────────────────────────────── */}
            <aside
                className={`flex flex-col border-r-4 border-border bg-[hsl(var(--sidebar-bg))] transition-all duration-200 flex-shrink-0 ${sidebarOpen ? 'w-56' : 'w-16'
                    }`}
                role="navigation"
                aria-label="Main navigation"
            >
                {/* Toggle */}
                <div className="flex items-center justify-between p-3 border-b-4 border-border">
                    {sidebarOpen && (
                        <Link href="/" className="font-black text-lg text-foreground tracking-tight">
                            Fluent
                        </Link>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                    >
                        {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
                    </button>
                </div>

                {/* Home */}
                <Link
                    href="/"
                    className={`flex items-center gap-3 px-3 py-2.5 mx-2 mt-2 rounded-lg font-bold text-sm transition-all ${pathname === '/'
                            ? 'bg-primary text-primary-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                            : 'hover:bg-muted text-foreground'
                        }`}
                    aria-current={pathname === '/' ? 'page' : undefined}
                >
                    <Home className="h-5 w-5 flex-shrink-0" />
                    {sidebarOpen && <span>Dashboard</span>}
                </Link>

                {/* Mode links */}
                <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5" role="list" aria-label="Input modes">
                    {INPUT_MODES.map((mode) => {
                        const Icon = mode.icon
                        const isActive = pathname.startsWith(mode.href)
                        return (
                            <Link
                                key={mode.id}
                                href={mode.href}
                                role="listitem"
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${isActive
                                        ? 'bg-primary text-primary-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                                        : 'hover:bg-muted text-foreground'
                                    }`}
                                aria-current={isActive ? 'page' : undefined}
                                title={mode.label}
                            >
                                <Icon className="h-4 w-4 flex-shrink-0" />
                                {sidebarOpen && <span>{mode.label}</span>}
                            </Link>
                        )
                    })}
                </div>

                {/* Bottom: Settings + SOS */}
                <div className="border-t-4 border-border p-2 space-y-1">
                    <Link
                        href="/settings"
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${pathname === '/settings'
                                ? 'bg-primary text-primary-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                                : 'hover:bg-muted text-foreground'
                            }`}
                    >
                        <Settings className="h-4 w-4 flex-shrink-0" />
                        {sidebarOpen && <span>Settings</span>}
                    </Link>
                    <SOSButton compact={!sidebarOpen} />
                </div>
            </aside>

            {/* ── Main Content + Output ────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
                <OutputPanel />
            </div>
        </div>
    )
}

export { INPUT_MODES }

'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ModePageLayoutProps {
    title: string
    description: string
    icon: React.ReactNode
    color?: string
    children: React.ReactNode
    helpContent?: string
}

export function ModePageLayout({ title, description, icon, color, children, helpContent }: ModePageLayoutProps) {
    const [showHelp, setShowHelp] = React.useState(false)

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
                <Link href="/">
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all font-bold"
                        aria-label="Back to dashboard"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>

                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <div className={`p-2 rounded-xl border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${color || 'bg-primary'}`}>
                            {icon}
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black text-foreground">{title}</h1>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">{description}</p>
                </div>

                {helpContent && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowHelp(!showHelp)}
                        className="border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all font-bold"
                        aria-label="Show help"
                    >
                        <HelpCircle className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Help tooltip */}
            {showHelp && helpContent && (
                <div className="p-4 bg-card border-4 border-border rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <p className="text-sm font-medium">{helpContent}</p>
                </div>
            )}

            {/* Content */}
            {children}
        </div>
    )
}

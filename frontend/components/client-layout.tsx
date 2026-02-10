'use client'

import React from 'react'
import { FluentProvider } from '@/lib/fluent-context'
import { AppShell } from '@/components/app-shell'

export function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <FluentProvider>
            <AppShell>{children}</AppShell>
        </FluentProvider>
    )
}

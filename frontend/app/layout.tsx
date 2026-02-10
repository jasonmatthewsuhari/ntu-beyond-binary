import React from "react"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ToasterWrapper } from '@/components/toaster-wrapper'

import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Fluent - Multimodal Input to Text',
  description: 'Convert voice, drawings, and gestures into text with our accessible multimodal input tool',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <ToasterWrapper />
      </body>
    </html>
  )
}

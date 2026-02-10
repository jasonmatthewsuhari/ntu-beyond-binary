'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, ChevronRight, ChevronLeft, Mic, Pencil, Keyboard, Check } from 'lucide-react'

interface OnboardingFlowProps {
  onComplete: () => void
  onSkip: () => void
}

const steps = [
  {
    title: 'Welcome to Fluent',
    description: 'An accessible tool that converts multiple input types into text. This quick tour will show you how to use all features.',
    icon: Check,
  },
  {
    title: 'Voice Input',
    description: 'Click the microphone button to start voice recording. Speak clearly and click again to stop. Your speech will be converted to text.',
    icon: Mic,
  },
  {
    title: 'Draw Input',
    description: 'Use your mouse or touch screen to draw letters and shapes on the canvas. Click Recognize to convert your drawing to text.',
    icon: Pencil,
  },
  {
    title: 'Keyboard Input',
    description: 'Type directly using your keyboard in the text area. This is the traditional method and works with all assistive technologies.',
    icon: Keyboard,
  },
]

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  const skipButtonRef = useRef<HTMLButtonElement>(null)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onSkip()
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        handlePrevious()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStep])

  // Focus management
  useEffect(() => {
    nextButtonRef.current?.focus()
  }, [currentStep])

  const Icon = steps[currentStep].icon

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      aria-describedby="onboarding-description"
    >
      <Card className="relative w-full max-w-2xl border-4 border-border bg-card p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        {/* Skip button */}
        <button
          ref={skipButtonRef}
          onClick={handleSkip}
          className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full hover:bg-muted transition-colors border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
          aria-label="Skip onboarding"
        >
          <X className="h-6 w-6 text-foreground" />
        </button>

        {/* Progress indicators */}
        <div className="mb-8 flex justify-center gap-3" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={steps.length}>
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-3 w-12 rounded-full border-2 border-border transition-all ${
                index === currentStep 
                  ? 'bg-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                  : index < currentStep 
                  ? 'bg-foreground' 
                  : 'bg-muted'
              }`}
              aria-label={`Step ${index + 1} of ${steps.length}${index === currentStep ? ' (current)' : index < currentStep ? ' (completed)' : ''}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-primary border-4 border-border shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <Icon className="h-12 w-12 text-primary-foreground" aria-hidden="true" />
          </div>

          {/* Title */}
          <h2 
            id="onboarding-title"
            className="mb-4 text-3xl md:text-4xl font-black text-foreground text-balance leading-tight"
          >
            {steps[currentStep].title}
          </h2>

          {/* Description */}
          <p 
            id="onboarding-description"
            className="mb-8 text-lg md:text-xl font-semibold text-foreground/80 max-w-xl leading-relaxed text-balance"
          >
            {steps[currentStep].description}
          </p>

          {/* Navigation buttons */}
          <div className="flex gap-4 w-full max-w-md">
            {currentStep > 0 && (
              <Button
                onClick={handlePrevious}
                variant="outline"
                size="lg"
                className="flex-1 border-4 border-border bg-card text-foreground hover:bg-muted font-bold text-lg h-14 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                aria-label="Go to previous step"
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Back
              </Button>
            )}
            <Button
              ref={nextButtonRef}
              onClick={handleNext}
              size="lg"
              className="flex-1 bg-primary hover:bg-primary text-primary-foreground font-bold text-lg h-14 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              aria-label={currentStep < steps.length - 1 ? 'Go to next step' : 'Complete onboarding'}
            >
              {currentStep < steps.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="ml-2 h-5 w-5" />
                </>
              ) : (
                <>
                  Get Started
                  <Check className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>

          {/* Keyboard hints */}
          <div className="mt-8 text-sm font-medium text-muted-foreground">
            <p>Use arrow keys to navigate • Press Esc to skip</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

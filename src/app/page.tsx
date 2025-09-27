'use client'

import { useEffect } from 'react'
import { useWellness, usePersistedState } from '@/store/wellness-context'
import { ProfileSetup } from '@/components/profile-setup'
import { WellnessBoard } from '@/components/wellness-board'
import { TipDetails } from '@/components/tip-details'
import { FavoritesList } from '@/components/favorites-list'
import { Navbar } from '@/components/navbar'
import { LoadingScreen } from '@/components/loading-screen'
import { ErrorBoundary } from '@/components/error-boundary'

export default function HomePage() {
  const { state } = useWellness()
  
  // Load persisted state on mount
  usePersistedState()

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 'profile-setup':
        return <ProfileSetup />
      case 'tips-generation':
      case 'tips-display':
        return <WellnessBoard />
      case 'tip-details':
        return <TipDetails />
      case 'favorites':
        return <FavoritesList />
      default:
        return <ProfileSetup />
    }
  }

  if (state.isLoading && state.currentStep === 'tips-generation') {
    return <LoadingScreen />
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-wellness-50 via-white to-wellness-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {renderCurrentStep()}
        </main>
      </div>
    </ErrorBoundary>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { useWellness, usePersistedState } from '@/store/wellness-context'
import { ProfileSetup } from '@/components/profile-setup'
import { WellnessBoard } from '@/components/wellness-board'
import { TipDetails } from '@/components/tip-details'
import { FavoritesList } from '@/components/favorites-list'
import { Navbar } from '@/components/navbar'
import { Breadcrumb } from '@/components/breadcrumb'
import { FloatingActionButton } from '@/components/floating-action-button'
import { LoadingScreen } from '@/components/loading-screen'
import { ErrorBoundary } from '@/components/error-boundary'

export default function HomePage() {
  const { state } = useWellness()
  const [isHydrated, setIsHydrated] = useState(false)
  
  // Load persisted state on mount
  usePersistedState()

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wellness-50 via-white to-wellness-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-wellness-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-wellness-700">Loading...</p>
        </div>
      </div>
    )
  }

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
        <Breadcrumb />
        <main className="container mx-auto px-4 py-8">
          {renderCurrentStep()}
        </main>
        <FloatingActionButton />
      </div>
    </ErrorBoundary>
  )
}
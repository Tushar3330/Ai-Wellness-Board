'use client'

import { motion } from 'framer-motion'
import { useWellness } from '@/store/wellness-context'
import { ChevronRight, User, Heart, Star, FileText } from 'lucide-react'
import { AppStep } from '@/types/wellness'

const stepConfig = {
  'profile-setup': { label: 'Setup Profile', icon: User, color: 'text-blue-600' },
  'tips-generation': { label: 'Generating Tips', icon: Heart, color: 'text-wellness-600' },
  'tips-display': { label: 'Your Tips', icon: Heart, color: 'text-wellness-600' },
  'tip-details': { label: 'Tip Details', icon: FileText, color: 'text-purple-600' },
  'favorites': { label: 'Favorites', icon: Star, color: 'text-yellow-600' }
} as const

export function Breadcrumb() {
  const { state } = useWellness()
  
  const getStepPath = (currentStep: AppStep): AppStep[] => {
    const basePath: AppStep[] = []
    
    if (state.userProfile) {
      basePath.push('profile-setup')
    }
    
    if (state.currentTips.length > 0) {
      basePath.push('tips-display')
    }
    
    if (currentStep === 'tip-details' && state.selectedTip) {
      if (!basePath.includes('tips-display')) basePath.push('tips-display')
      basePath.push('tip-details')
    }
    
    if (currentStep === 'favorites') {
      if (!basePath.includes('tips-display')) basePath.push('tips-display')
      basePath.push('favorites')
    }
    
    // If current step is not in path yet, add it
    if (!basePath.includes(currentStep)) {
      basePath.push(currentStep)
    }
    
    return basePath
  }

  const stepPath = getStepPath(state.currentStep)
  
  if (stepPath.length <= 1) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-2"
    >
      <nav className="flex items-center gap-2 text-sm">
        {stepPath.map((step, index) => {
          const config = stepConfig[step]
          const isLast = index === stepPath.length - 1
          const isActive = step === state.currentStep
          
          return (
            <div key={step} className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: isLast ? 1 : 1.05 }}
                className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
                  isActive 
                    ? `${config.color} bg-opacity-10 bg-current font-medium` 
                    : 'text-gray-500 hover:text-gray-700'
                } ${isLast ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <config.icon className="w-3.5 h-3.5" />
                <span>{config.label}</span>
                
                {step === 'tip-details' && state.selectedTip && (
                  <span className="text-xs text-gray-400 max-w-[100px] truncate">
                    • {state.selectedTip.title}
                  </span>
                )}
              </motion.div>
              
              {!isLast && (
                <ChevronRight className="w-3 h-3 text-gray-400" />
              )}
            </div>
          )
        })}
      </nav>
    </motion.div>
  )
}
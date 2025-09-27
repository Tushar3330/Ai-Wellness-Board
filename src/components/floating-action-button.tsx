'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWellness } from '@/store/wellness-context'
import { Button } from '@/components/ui/button'
import { 
  Plus, 
  RefreshCw, 
  Star, 
  User,
  X,
  Sparkles
} from 'lucide-react'

export function FloatingActionButton() {
  const { state, actions } = useWellness()
  const [isOpen, setIsOpen] = useState(false)

  const quickActions = [
    {
      id: 'regenerate',
      label: 'New Tips',
      icon: RefreshCw,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => {
        actions.resetTips()
        setIsOpen(false)
      },
      show: state.userProfile && state.currentStep === 'tips-display' && state.currentTips.length > 0,
      disabled: state.isLoading
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: Star,
      color: 'bg-yellow-500 hover:bg-yellow-600',
      action: () => {
        actions.setCurrentStep('favorites')
        setIsOpen(false)
      },
      show: state.favoriteTips.length > 0,
      disabled: false
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      color: 'bg-wellness-500 hover:bg-wellness-600',
      action: () => {
        actions.setCurrentStep('profile-setup')
        setIsOpen(false)
      },
      show: state.userProfile !== null,
      disabled: false
    }
  ]

  const visibleActions = quickActions.filter(action => action.show && !action.disabled)

  if (visibleActions.length === 0 || state.currentStep === 'profile-setup') {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {visibleActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  onClick={action.action}
                  className={`${action.color} text-white shadow-lg min-w-[120px] gap-2`}
                  size="sm"
                >
                  <action.icon className="w-4 h-4" />
                  {action.label}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-wellness-gradient shadow-lg border-0"
          size="icon"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <motion.div
              animate={{ 
                rotate: state.isLoading ? 360 : 0 
              }}
              transition={{ 
                duration: 2, 
                repeat: state.isLoading ? Infinity : 0,
                ease: 'linear' 
              }}
            >
              {state.isLoading ? (
                <Sparkles className="w-6 h-6 text-white" />
              ) : (
                <Plus className="w-6 h-6 text-white" />
              )}
            </motion.div>
          )}
        </Button>
      </motion.div>
    </div>
  )
}
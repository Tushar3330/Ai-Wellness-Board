'use client'

import { motion } from 'framer-motion'
import { useWellness } from '@/store/wellness-context'
import { Button } from '@/components/ui/button'
import { Heart, Home, Star, User, Sparkles } from 'lucide-react'

export function Navbar() {
  const { state, actions } = useWellness()

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      step: 'tips-display' as const,
      show: state.userProfile !== null
    },
    {
      id: 'profile', 
      label: 'Profile',
      icon: User,
      step: 'profile-setup' as const,
      show: true
    },
    {
      id: 'favorites',
      label: `Favorites${state.favoriteTips.length > 0 ? ` (${state.favoriteTips.length})` : ''}`,
      icon: Star,
      step: 'favorites' as const,
      show: state.favoriteTips.length > 0
    }
  ]

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-wellness-100 shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => actions.setCurrentStep('tips-display')}
          >
            <div className="w-8 h-8 rounded-full bg-wellness-gradient flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">
              AI Wellness Board
            </span>
          </motion.div>

          {/* Navigation Items */}
          <div className="flex items-center gap-2">
            {navItems
              .filter(item => item.show)
              .map((item) => {
                const isActive = state.currentStep === item.step
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "wellness" : "ghost"}
                    size="sm"
                    onClick={() => actions.setCurrentStep(item.step)}
                    className="gap-2"
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                )
              })}

            {/* AI Status Indicator */}
            {state.isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-3 py-2 bg-wellness-50 rounded-full border border-wellness-200"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-wellness-600" />
                </motion.div>
                <span className="text-sm text-wellness-700 font-medium">
                  AI Working...
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
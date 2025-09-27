'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWellness } from '@/store/wellness-context'
import { aiService } from '@/services/ai-service'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuickActions } from '@/components/quick-actions'
import { ResetMenu } from '@/components/reset-menu'
import { WellnessTip } from '@/types/wellness'
import { 
  Heart, 
  RefreshCw, 
  Clock, 
  TrendingUp,
  Star,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { CATEGORY_COLORS, DIFFICULTY_COLORS } from '@/constants/wellness'

export function WellnessBoard() {
  const { state, actions } = useWellness()

  useEffect(() => {
    if (state.currentStep === 'tips-generation' && state.userProfile && state.currentTips.length === 0) {
      generateTips()
    }
  }, [state.currentStep, state.userProfile])

  // Force regeneration when profile goals change
  useEffect(() => {
    if (state.userProfile && state.currentStep === 'tips-display' && state.currentTips.length > 0) {
      const currentTipGoals = state.currentTips[0]?.aiGeneratedFor?.goals?.map(g => g.id).sort().join(',')
      const newProfileGoals = state.userProfile.goals.map(g => g.id).sort().join(',')
      
      if (currentTipGoals !== newProfileGoals) {
        actions.resetTips()
      }
    }
  }, [state.userProfile?.goals, state.currentTips, state.currentStep])

  const generateTips = async () => {
    if (!state.userProfile) return

    actions.setLoading(true)
    actions.setError(null)

    try {
      const result = await aiService.generateWellnessTips({
        profile: state.userProfile
      })

      if (result.success && result.data) {
        actions.setCurrentTips(result.data)
        actions.setCurrentStep('tips-display')
      } else {
        actions.setError(result.error || 'Failed to generate tips')
      }
    } catch (error) {
      actions.setError('Something went wrong. Please try again.')
    } finally {
      actions.setLoading(false)
    }
  }

  const regenerateTips = async () => {
    actions.setCurrentTips([])
    actions.setError(null)
    actions.setLoading(true)
    
    try {
      await generateTips()
    } catch (error) {
      actions.setError('Failed to generate new tips. Please try again.')
    }
  }

  const handleTipClick = async (tip: WellnessTip) => {
    actions.setLoading(true)
    
    try {
      actions.setSelectedTip(tip)
      await new Promise(resolve => setTimeout(resolve, 100))
      actions.setCurrentStep('tip-details')
    } catch (error) {
      actions.setError('Failed to load tip details')
    } finally {
      actions.setLoading(false)
    }
  }

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6 rounded-full bg-wellness-gradient flex items-center justify-center"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Creating Your Wellness Plan
          </h2>
          <p className="text-gray-600">
            Our AI is generating personalized recommendations just for you...
          </p>
        </motion.div>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-red-600">Oops! Something went wrong</CardTitle>
            <CardDescription>{state.error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={generateTips} variant="wellness">
              <RefreshCw className="mr-2 w-4 h-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-2 text-wellness-600 relative">
          <Heart className="w-6 h-6" />
          <span className="text-lg font-medium">Your Personalized Wellness Board</span>
          
          {/* Reset Menu */}
          <div className="absolute right-0 top-0">
            <ResetMenu />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900">
          Ready to Transform Your Health?
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Based on your profile, here are {state.currentTips.length} personalized recommendations 
          to help you achieve your wellness goals.
        </p>
        
        <div className="flex justify-center gap-4 pt-4">
          <Button
            onClick={regenerateTips}
            variant="outline"
            className="gap-2"
            disabled={state.isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${state.isLoading ? 'animate-spin' : ''}`} />
            {state.isLoading ? 'Generating...' : 'Regenerate Tips'}
          </Button>
          <Button
            onClick={() => actions.setCurrentStep('favorites')}
            variant="wellness"
            className="gap-2"
          >
            <Star className="w-4 h-4" />
            View Favorites ({state.favoriteTips.length})
          </Button>
          <Button
            onClick={() => actions.setCurrentStep('profile-setup')}
            variant="ghost"
            className="gap-2"
          >
            Edit Profile
          </Button>
        </div>
      </motion.div>

      {/* Tips Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentTips.length}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {state.currentTips.map((tip, index) => (
            <TipCard
              key={tip.id}
              tip={tip}
              index={index}
              onToggleFavorite={() => actions.toggleFavoriteTip(tip)}
              onClick={() => handleTipClick(tip)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Quick Actions */}
      <QuickActions />

      {/* Profile Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-wellness-50 border-wellness-200">
          <CardHeader>
            <CardTitle className="text-wellness-800">Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-wellness-700">Age:</span> {state.userProfile?.age}
              </div>
              <div>
                <span className="font-medium text-wellness-700">Gender:</span> {state.userProfile?.gender}
              </div>
              <div>
                <span className="font-medium text-wellness-700">Goals:</span> {state.userProfile?.goals.length} selected
              </div>
            </div>
            <div>
              <span className="font-medium text-wellness-700">Your Goals: </span>
              <span className="text-wellness-600">
                {state.userProfile?.goals.map(g => g.name).join(', ')}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

interface TipCardProps {
  tip: WellnessTip
  index: number
  onToggleFavorite: () => void
  onClick: () => void
}

function TipCard({ tip, index, onToggleFavorite, onClick }: TipCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="h-full cursor-pointer card-hover group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-wellness-50/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <CardHeader className="relative">
          <div className="flex items-start justify-between gap-2">
            <div className="text-3xl">{tip.icon}</div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite()
              }}
              className="shrink-0"
            >
              <Star
                className={`w-4 h-4 ${
                  tip.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                }`}
              />
            </Button>
          </div>
          
          <div>
            <CardTitle className="text-lg leading-tight group-hover:text-wellness-700 transition-colors">
              {tip.title}
            </CardTitle>
            <CardDescription className="mt-2 line-clamp-2">
              {tip.shortDescription}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-4">
          <div className="flex flex-wrap gap-2">
            <span 
              className={`px-2 py-1 rounded text-xs font-medium border ${
                CATEGORY_COLORS[tip.category]
              }`}
            >
              {tip.category.replace('-', ' ')}
            </span>
            <span 
              className={`px-2 py-1 rounded text-xs font-medium border ${
                DIFFICULTY_COLORS[tip.difficulty]
              }`}
            >
              {tip.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {tip.estimatedTime}
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {tip.benefits.length} benefits
            </div>
          </div>

          <Button 
            onClick={async (e) => {
              e.stopPropagation()
              await onClick()
            }}
            variant="outline" 
            size="sm" 
            className="w-full group-hover:bg-wellness-500 group-hover:text-white transition-colors"
          >
            Learn More
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
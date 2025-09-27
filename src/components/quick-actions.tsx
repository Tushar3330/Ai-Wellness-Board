'use client'

import { motion } from 'framer-motion'
import { useWellness } from '@/store/wellness-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  RefreshCw, 
  Star, 
  User, 
  Heart,
  ArrowRight,
  Sparkles,
  BarChart3
} from 'lucide-react'

export function QuickActions() {
  const { state, actions } = useWellness()

  const actionCards = [
    {
      id: 'regenerate',
      title: 'Get New Tips',
      description: 'Generate fresh wellness recommendations',
      icon: RefreshCw,
      color: 'border-blue-200 hover:border-blue-300 bg-blue-50',
      action: () => {
        actions.resetTips()
      },
      show: state.userProfile && state.currentStep === 'tips-display' && state.currentTips.length > 0,
      disabled: state.isLoading
    },
    {
      id: 'favorites',
      title: 'View Favorites',
      description: `${state.favoriteTips.length} saved tips`,
      icon: Star,
      color: 'border-yellow-200 hover:border-yellow-300 bg-yellow-50',
      action: () => actions.setCurrentStep('favorites'),
      show: state.favoriteTips.length > 0,
      disabled: false
    },
    {
      id: 'profile',
      title: 'Update Profile',
      description: 'Modify your wellness goals',
      icon: User,
      color: 'border-wellness-200 hover:border-wellness-300 bg-wellness-50',
      action: () => actions.setCurrentStep('profile-setup'),
      show: state.userProfile !== null,
      disabled: false
    },
    {
      id: 'stats',
      title: 'Your Progress',
      description: 'See your wellness journey',
      icon: BarChart3,
      color: 'border-purple-200 hover:border-purple-300 bg-purple-50',
      action: () => {
        // Future feature - stats page
        console.log('📊 Stats feature coming soon!')
      },
      show: state.favoriteTips.length > 0,
      disabled: true
    }
  ]

  const visibleActions = actionCards.filter(action => action.show)

  if (visibleActions.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full"
    >
      <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-wellness-600" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common actions to enhance your wellness journey
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {visibleActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: action.disabled ? 1 : 1.02 }}
                whileTap={{ scale: action.disabled ? 1 : 0.98 }}
              >
                <Card 
                  className={`cursor-pointer transition-all h-full ${action.color} ${
                    action.disabled ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                  onClick={action.disabled ? undefined : action.action}
                >
                  <CardContent className="p-4 text-center">
                    <div className="mb-3">
                      <div className="w-10 h-10 mx-auto rounded-full bg-white/80 flex items-center justify-center">
                        <action.icon 
                          className={`w-5 h-5 ${
                            action.id === 'regenerate' && state.isLoading ? 'animate-spin' : ''
                          }`} 
                        />
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-sm mb-1">
                      {action.title}
                    </h3>
                    
                    <p className="text-xs text-gray-600 mb-3">
                      {action.description}
                    </p>
                    
                    {!action.disabled && (
                      <div className="flex justify-center">
                        <ArrowRight className="w-3 h-3 text-gray-500" />
                      </div>
                    )}
                    
                    {action.disabled && action.id === 'stats' && (
                      <div className="text-xs text-gray-500 italic">
                        Coming Soon
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* Wellness Tip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 p-4 bg-gradient-to-r from-wellness-50 to-blue-50 rounded-lg border border-wellness-100"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-wellness-500 flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-wellness-800 mb-1">
                  💡 Wellness Tip
                </h4>
                <p className="text-sm text-wellness-700">
                  {state.favoriteTips.length > 0 
                    ? "Great job saving wellness tips! Remember to practice them consistently for best results."
                    : "Start by exploring the wellness tips and save the ones that resonate with you!"
                  }
                </p>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
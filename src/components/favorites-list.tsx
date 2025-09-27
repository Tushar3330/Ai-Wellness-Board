'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useWellness } from '@/store/wellness-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, Trash2, ArrowLeft, Heart, Clock, TrendingUp } from 'lucide-react'
import { WellnessTip } from '@/types/wellness'
import { CATEGORY_COLORS, DIFFICULTY_COLORS } from '@/constants/wellness'

export function FavoritesList() {
  const { state, actions } = useWellness()

  const handleRemoveFavorite = (tip: WellnessTip) => {
    actions.toggleFavoriteTip(tip)
  }

  const goBack = () => {
    actions.setCurrentStep(state.userProfile ? 'tips-display' : 'profile-setup')
  }

  const handleTipClick = (tip: WellnessTip) => {
    actions.setSelectedTip(tip)
    actions.setCurrentStep('tip-details')
  }

  if (state.favoriteTips.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <Star className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Favorites Yet
          </h2>
          <p className="text-gray-600 mb-6">
            Start exploring wellness tips and save your favorites here for easy access!
          </p>
          <Button onClick={goBack} variant="wellness" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Explore Tips
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-2 text-wellness-600 mb-2">
            <Star className="w-6 h-6 fill-current" />
            <span className="text-lg font-medium">Your Favorites</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Saved Wellness Tips
          </h1>
          <p className="text-xl text-gray-600 mt-2">
            {state.favoriteTips.length} tip{state.favoriteTips.length !== 1 ? 's' : ''} saved for later
          </p>
        </div>
        <Button onClick={goBack} variant="outline" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Board
        </Button>
      </motion.div>

      {/* Favorites Grid */}
      <AnimatePresence mode="popLayout">
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {state.favoriteTips.map((tip, index) => (
            <motion.div
              key={tip.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Card 
                className="h-full group relative overflow-hidden card-hover cursor-pointer"
                onClick={() => handleTipClick(tip)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-wellness-50/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <CardHeader className="relative">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-3xl">{tip.icon}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveFavorite(tip)
                      }}
                      className="shrink-0 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div>
                    <CardTitle className="text-lg leading-tight group-hover:text-wellness-700 transition-colors">
                      {tip.title}
                    </CardTitle>
                    <CardDescription className="mt-2 line-clamp-3">
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

                  {tip.benefits.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-700">Key Benefits:</h4>
                      <ul className="space-y-1">
                        {tip.benefits.slice(0, 3).map((benefit, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <Heart className="w-3 h-3 text-wellness-500 mt-0.5 shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {tip.fullDescription && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {tip.fullDescription}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-wellness-50 border-wellness-200">
          <CardHeader>
            <CardTitle className="text-wellness-800 flex items-center gap-2">
              <Star className="w-5 h-5 fill-current" />
              Your Wellness Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-wellness-700">
                  {state.favoriteTips.length}
                </div>
                <div className="text-sm text-wellness-600">Saved Tips</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-wellness-700">
                  {new Set(state.favoriteTips.map(t => t.category)).size}
                </div>
                <div className="text-sm text-wellness-600">Categories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-wellness-700">
                  {state.favoriteTips.filter(t => t.difficulty === 'easy').length}
                </div>
                <div className="text-sm text-wellness-600">Easy Tips</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-wellness-700">
                  {state.favoriteTips.reduce((acc, tip) => acc + tip.benefits.length, 0)}
                </div>
                <div className="text-sm text-wellness-600">Total Benefits</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
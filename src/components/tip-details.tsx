'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWellness } from '@/store/wellness-context'
import { aiService } from '@/services/ai-service'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WellnessTip } from '@/types/wellness'
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  Lightbulb,
  Target,
  Heart
} from 'lucide-react'
import { CATEGORY_COLORS, DIFFICULTY_COLORS } from '@/constants/wellness'

export function TipDetails() {
  const { state, actions } = useWellness()
  const [selectedTip, setSelectedTip] = useState<WellnessTip | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  useEffect(() => {
    // In a real app, you'd get the tip ID from the URL or state
    // For now, we'll use the first current tip as an example
    if (state.currentTips.length > 0 && !selectedTip) {
      loadTipDetails(state.currentTips[0])
    }
  }, [state.currentTips, selectedTip])

  const loadTipDetails = async (tip: WellnessTip) => {
    if (!state.userProfile) return

    setSelectedTip(tip)

    // If we already have full description, don't reload
    if (tip.fullDescription && tip.steps) return

    setIsLoadingDetails(true)

    try {
      const result = await aiService.generateTipDetails(tip, state.userProfile)
      
      if (result.success && result.data) {
        actions.updateTip(result.data)
        setSelectedTip(result.data)
      }
    } catch (error) {
      console.error('Error loading tip details:', error)
    } finally {
      setIsLoadingDetails(false)
    }
  }

  const toggleStepCompletion = (stepIndex: number) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev)
      if (newSet.has(stepIndex)) {
        newSet.delete(stepIndex)
      } else {
        newSet.add(stepIndex)
      }
      return newSet
    })
  }

  const goBack = () => {
    actions.setCurrentStep('tips-display')
  }

  if (!selectedTip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🤔</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No tip selected</h2>
          <Button onClick={goBack} variant="wellness">
            Back to Board
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Button onClick={goBack} variant="outline" size="icon">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-wellness-600 mb-1">
            <div className="text-2xl">{selectedTip.icon}</div>
            <span className="text-sm font-medium uppercase tracking-wide">
              {selectedTip.category.replace('-', ' ')}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {selectedTip.title}
          </h1>
        </div>
        <Button
          variant={selectedTip.isFavorite ? "wellness" : "outline"}
          onClick={() => actions.toggleFavoriteTip(selectedTip)}
          className="gap-2"
        >
          <Star className={`w-4 h-4 ${selectedTip.isFavorite ? 'fill-current' : ''}`} />
          {selectedTip.isFavorite ? 'Saved' : 'Save'}
        </Button>
      </motion.div>

      {/* Tip Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span 
                className={`px-3 py-1 rounded-full text-sm font-medium border ${
                  CATEGORY_COLORS[selectedTip.category]
                }`}
              >
                {selectedTip.category.replace('-', ' ')}
              </span>
              <span 
                className={`px-3 py-1 rounded-full text-sm font-medium border ${
                  DIFFICULTY_COLORS[selectedTip.difficulty]
                }`}
              >
                {selectedTip.difficulty} difficulty
              </span>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                {selectedTip.estimatedTime}
              </div>
            </div>
            
            <CardDescription className="text-lg leading-relaxed">
              {selectedTip.shortDescription}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Benefits */}
            <div className="mb-8">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                <TrendingUp className="w-5 h-5 text-wellness-600" />
                Key Benefits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedTip.benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-wellness-50 rounded-lg"
                  >
                    <Heart className="w-5 h-5 text-wellness-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Full Description */}
            {selectedTip.fullDescription && (
              <div className="mb-8">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                  <Lightbulb className="w-5 h-5 text-wellness-600" />
                  Why This Works
                </h3>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedTip.fullDescription}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Step-by-Step Guide */}
      <AnimatePresence>
        {selectedTip.steps && selectedTip.steps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-wellness-600" />
                  Step-by-Step Implementation
                </CardTitle>
                <CardDescription>
                  Follow these steps to implement this wellness tip in your daily routine
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {selectedTip.steps.map((step, index) => {
                    const isCompleted = completedSteps.has(index)
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className={`flex gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          isCompleted
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 hover:border-wellness-300 hover:bg-wellness-25'
                        }`}
                        onClick={() => toggleStepCompletion(index)}
                      >
                        <div className="shrink-0 mt-1">
                          <motion.div
                            animate={{ scale: isCompleted ? 1.1 : 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <CheckCircle 
                              className={`w-6 h-6 ${
                                isCompleted ? 'text-green-600 fill-current' : 'text-gray-400'
                              }`}
                            />
                          </motion.div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-sm text-wellness-600">
                              Step {index + 1}
                            </span>
                            {isCompleted && (
                              <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                              >
                                Completed ✓
                              </motion.span>
                            )}
                          </div>
                          <p className={`text-gray-700 ${isCompleted ? 'line-through opacity-75' : ''}`}>
                            {step}
                          </p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Progress */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-wellness-600">
                      {completedSteps.size} of {selectedTip.steps.length} steps
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(completedSteps.size / selectedTip.steps.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className="bg-wellness-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State for Details */}
      {isLoadingDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-wellness-50 rounded-full">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-wellness-500 border-t-transparent rounded-full"
            />
            <span className="text-sm text-wellness-700">Loading detailed instructions...</span>
          </div>
        </motion.div>
      )}

      {/* Related Tips */}
      {state.currentTips.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>More Tips For You</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {state.currentTips
                  .filter(tip => tip.id !== selectedTip.id)
                  .slice(0, 3)
                  .map((tip) => (
                    <motion.button
                      key={tip.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => loadTipDetails(tip)}
                      className="flex-shrink-0 w-64 p-4 border rounded-lg text-left hover:border-wellness-300 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{tip.icon}</div>
                        <div>
                          <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                            {tip.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {tip.shortDescription}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
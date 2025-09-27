'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useWellness } from '@/store/wellness-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ResetMenu } from '@/components/reset-menu'
import { WELLNESS_GOALS, GENDER_OPTIONS } from '@/constants/wellness'
import { UserProfile, WellnessGoal } from '@/types/wellness'
import { Sparkles, ArrowRight, Check } from 'lucide-react'

export function ProfileSetup() {
  const { state, actions } = useWellness()
  const [age, setAge] = useState<string>(state.userProfile?.age.toString() || '')
  const [gender, setGender] = useState<string>(state.userProfile?.gender || '')
  const [selectedGoals, setSelectedGoals] = useState<WellnessGoal[]>(state.userProfile?.goals || [])
  const [currentStep, setCurrentStep] = useState<'age' | 'gender' | 'goals'>('age')
  const [, setIsEditMode] = useState<boolean>(!state.userProfile)

  const handleGoalToggle = (goal: WellnessGoal) => {
    setSelectedGoals(prev => {
      const exists = prev.find(g => g.id === goal.id)
      if (exists) {
        return prev.filter(g => g.id !== goal.id)
      } else {
        return [...prev, goal]
      }
    })
  }

  const handleComplete = () => {
    if (!age || !gender || selectedGoals.length === 0) return

    const profile: UserProfile = {
      age: parseInt(age),
      gender: gender as UserProfile['gender'],
      goals: selectedGoals,
      createdAt: state.userProfile?.createdAt || new Date(),
      updatedAt: new Date()
    }

    actions.setUserProfile(profile)
    
    // If user already has tips, go back to board, otherwise generate new tips
    if (state.currentTips.length > 0) {
      actions.setCurrentStep('tips-display')
    } else {
      actions.setCurrentStep('tips-generation')
    }
    
    setIsEditMode(false)
  }

  const handleBackToBoard = () => {
    if (state.currentTips.length > 0) {
      actions.setCurrentStep('tips-display')
    } else if (state.userProfile) {
      actions.setCurrentStep('tips-generation')
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 'age':
        return age && parseInt(age) >= 13 && parseInt(age) <= 120
      case 'gender':
        return gender
      case 'goals':
        return selectedGoals.length > 0
      default:
        return false
    }
  }

  const nextStep = () => {
    if (currentStep === 'age') setCurrentStep('gender')
    else if (currentStep === 'gender') setCurrentStep('goals')
    else handleComplete()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8 relative">
            {state.userProfile && (
              <div className="absolute right-4 top-4">
                <ResetMenu />
              </div>
            )}
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto w-20 h-20 rounded-full bg-wellness-gradient flex items-center justify-center mb-6"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              {state.userProfile ? 'Update Your Profile' : 'Welcome to AI Wellness Board'}
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              {state.userProfile 
                ? 'Modify your information to get updated recommendations'
                : "Let's create your personalized wellness journey"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {currentStep === 'age' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">What's your age?</h3>
                  <p className="text-gray-600">This helps us provide age-appropriate recommendations</p>
                </div>
                
                <div className="max-w-xs mx-auto">
                  <Input
                    type="number"
                    placeholder="Enter your age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="13"
                    max="120"
                    className="text-center text-lg h-12"
                    autoFocus
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 'gender' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Select your gender</h3>
                  <p className="text-gray-600">This helps personalize your wellness recommendations</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {GENDER_OPTIONS.map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setGender(option.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        gender === option.value
                          ? 'border-wellness-500 bg-wellness-50 text-wellness-700'
                          : 'border-gray-200 hover:border-wellness-300 hover:bg-wellness-25'
                      }`}
                    >
                      <div className="text-2xl mb-2">{option.icon}</div>
                      <div className="font-medium">{option.label}</div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 'goals' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Choose your wellness goals</h3>
                  <p className="text-gray-600">Select up to 5 goals that matter most to you</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {WELLNESS_GOALS.map((goal, index) => {
                    const isSelected = selectedGoals.find(g => g.id === goal.id)
                    return (
                      <motion.button
                        key={goal.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleGoalToggle(goal)}
                        disabled={!isSelected && selectedGoals.length >= 5}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          isSelected
                            ? 'border-wellness-500 bg-wellness-50 text-wellness-700'
                            : selectedGoals.length >= 5
                            ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                            : 'border-gray-200 hover:border-wellness-300 hover:bg-wellness-25'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-xl">{goal.icon}</div>
                          <div className="flex-1">
                            <div className="font-medium flex items-center gap-2">
                              {goal.name}
                              {isSelected && <Check className="w-4 h-4" />}
                            </div>
                            <div className="text-sm text-gray-600">{goal.description}</div>
                          </div>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
                
                {selectedGoals.length > 0 && (
                  <div className="text-center text-sm text-gray-600">
                    {selectedGoals.length} of 5 goals selected
                  </div>
                )}
              </motion.div>
            )}

            <div className="flex justify-between pt-6 border-t">
              {currentStep !== 'age' ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (currentStep === 'gender') setCurrentStep('age')
                    else if (currentStep === 'goals') setCurrentStep('gender')
                  }}
                >
                  Back
                </Button>
              ) : state.userProfile && state.currentTips.length > 0 ? (
                <Button
                  variant="outline"
                  onClick={handleBackToBoard}
                >
                  Back to Board
                </Button>
              ) : (
                <div />
              )}

              <Button
                variant="wellness"
                onClick={nextStep}
                disabled={!canProceed()}
                className="min-w-[120px]"
              >
                {currentStep === 'goals' 
                  ? (state.userProfile && state.currentTips.length > 0 ? 'Update Profile' : 'Generate Tips')
                  : 'Next'}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
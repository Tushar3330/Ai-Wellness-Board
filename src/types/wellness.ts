export interface UserProfile {
  age: number
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say'
  goals: WellnessGoal[]
  createdAt: Date
  updatedAt: Date
}

export interface WellnessGoal {
  id: string
  name: string
  category: GoalCategory
  icon: string
  description: string
}

export type GoalCategory = 
  | 'fitness'
  | 'nutrition'
  | 'mental-health'
  | 'sleep'
  | 'stress-management'
  | 'preventive-care'

export interface WellnessTip {
  id: string
  title: string
  shortDescription: string
  fullDescription?: string
  category: GoalCategory
  icon: string
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: string
  steps?: string[]
  benefits: string[]
  tags: string[]
  isFavorite: boolean
  createdAt: Date
  aiGeneratedFor?: UserProfile
}

export interface AIPromptTemplate {
  id: string
  name: string
  category: GoalCategory
  template: string
  variables: string[]
}

export interface AppState {
  userProfile: UserProfile | null
  currentTips: WellnessTip[]
  favoriteTips: WellnessTip[]
  isLoading: boolean
  error: string | null
  currentStep: AppStep
}

export type AppStep = 
  | 'profile-setup'
  | 'tips-generation' 
  | 'tips-display'
  | 'tip-details'
  | 'favorites'

export interface GenerationRequest {
  profile: UserProfile
  regenerate?: boolean
  focusCategory?: GoalCategory
}

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: Date
}
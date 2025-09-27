import type { WellnessGoal } from '@/types/wellness'

export const WELLNESS_GOALS: WellnessGoal[] = [
  {
    id: 'weight-management',
    name: 'Weight Management',
    category: 'fitness',
    icon: '⚖️',
    description: 'Achieve and maintain a healthy weight through balanced lifestyle'
  },
  {
    id: 'muscle-building',
    name: 'Build Muscle',
    category: 'fitness',
    icon: '💪',
    description: 'Increase muscle mass and strength through targeted exercise'
  },
  {
    id: 'cardio-fitness',
    name: 'Improve Cardio',
    category: 'fitness',
    icon: '❤️',
    description: 'Enhance cardiovascular health and endurance'
  },
  {
    id: 'flexibility',
    name: 'Increase Flexibility',
    category: 'fitness',
    icon: '🤸',
    description: 'Improve range of motion and reduce stiffness'
  },
  {
    id: 'healthy-eating',
    name: 'Eat Healthier',
    category: 'nutrition',
    icon: '🥗',
    description: 'Develop nutritious eating habits and meal planning'
  },
  {
    id: 'meal-planning',
    name: 'Meal Planning',
    category: 'nutrition',
    icon: '📝',
    description: 'Organize meals for better nutrition and time management'
  },
  {
    id: 'hydration',
    name: 'Stay Hydrated',
    category: 'nutrition',
    icon: '💧',
    description: 'Maintain proper daily water intake'
  },
  {
    id: 'stress-reduction',
    name: 'Reduce Stress',
    category: 'stress-management',
    icon: '🧘',
    description: 'Learn techniques to manage and reduce daily stress'
  },
  {
    id: 'anxiety-management',
    name: 'Manage Anxiety',
    category: 'mental-health',
    icon: '🌱',
    description: 'Develop coping strategies for anxiety and worry'
  },
  {
    id: 'better-sleep',
    name: 'Better Sleep',
    category: 'sleep',
    icon: '😴',
    description: 'Improve sleep quality and establish healthy sleep patterns'
  },
  {
    id: 'energy-boost',
    name: 'Increase Energy',
    category: 'fitness',
    icon: '⚡',
    description: 'Boost daily energy levels naturally'
  },
  {
    id: 'mindfulness',
    name: 'Practice Mindfulness',
    category: 'mental-health',
    icon: '🧠',
    description: 'Develop present-moment awareness and mental clarity'
  },
  {
    id: 'work-life-balance',
    name: 'Work-Life Balance',
    category: 'stress-management',
    icon: '⚖️',
    description: 'Create healthy boundaries between work and personal life'
  },
  {
    id: 'immune-system',
    name: 'Boost Immunity',
    category: 'preventive-care',
    icon: '🛡️',
    description: 'Strengthen immune system through lifestyle choices'
  },
  {
    id: 'digestive-health',
    name: 'Digestive Health',
    category: 'nutrition',
    icon: '🌿',
    description: 'Improve gut health and digestion'
  }
]

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male', icon: '👨' },
  { value: 'female', label: 'Female', icon: '👩' },
  { value: 'other', label: 'Other', icon: '👤' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say', icon: '🤐' }
] as const

export const AGE_RANGES = [
  { min: 13, max: 17, label: 'Teenager (13-17)' },
  { min: 18, max: 24, label: 'Young Adult (18-24)' },
  { min: 25, max: 34, label: 'Adult (25-34)' },
  { min: 35, max: 49, label: 'Middle-aged (35-49)' },
  { min: 50, max: 64, label: 'Older Adult (50-64)' },
  { min: 65, max: 100, label: 'Senior (65+)' }
]

export const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  hard: 'bg-red-100 text-red-800 border-red-200'
}

export const CATEGORY_COLORS = {
  fitness: 'bg-blue-100 text-blue-800 border-blue-200',
  nutrition: 'bg-green-100 text-green-800 border-green-200',
  'mental-health': 'bg-purple-100 text-purple-800 border-purple-200',
  sleep: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'stress-management': 'bg-pink-100 text-pink-800 border-pink-200',
  'preventive-care': 'bg-teal-100 text-teal-800 border-teal-200'
}

export const APP_CONFIG = {
  name: 'AI Wellness Board',
  version: '1.0.0',
  description: 'Personalized wellness recommendations powered by AI',
  maxTips: 5,
  maxFavorites: 50,
  apiTimeout: 30000,
  retryAttempts: 3,
  localStorageKeys: {
    userProfile: 'wellness-user-profile',
    favorites: 'wellness-favorites',
    appState: 'wellness-app-state'
  }
}

export const ANIMATION_DELAYS = {
  stagger: 100,
  card: 200,
  button: 50,
  modal: 300
}

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}
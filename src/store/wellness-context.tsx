'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import type { AppState, AppStep, UserProfile, WellnessTip } from '@/types/wellness'
import { APP_CONFIG } from '@/constants/wellness'

// Initial state
const initialState: AppState = {
  userProfile: null,
  currentTips: [],
  favoriteTips: [],
  selectedTip: null,
  isLoading: false,
  error: null,
  currentStep: 'profile-setup'
}

// Action types
type WellnessAction =
  | { type: 'SET_USER_PROFILE'; payload: UserProfile | null }
  | { type: 'SET_CURRENT_TIPS'; payload: WellnessTip[] }
  | { type: 'ADD_FAVORITE_TIP'; payload: WellnessTip }
  | { type: 'REMOVE_FAVORITE_TIP'; payload: string }
  | { type: 'SET_SELECTED_TIP'; payload: WellnessTip | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_STEP'; payload: AppStep }
  | { type: 'UPDATE_TIP'; payload: WellnessTip }
  | { type: 'RESET_STATE' }
  | { type: 'LOAD_PERSISTED_STATE'; payload: Partial<AppState> }

// Reducer function
function wellnessReducer(state: AppState, action: WellnessAction): AppState {
  switch (action.type) {
    case 'SET_USER_PROFILE':
      return {
        ...state,
        userProfile: action.payload
      }
    
    case 'SET_CURRENT_TIPS':
      return {
        ...state,
        currentTips: action.payload
      }
    
    case 'ADD_FAVORITE_TIP':
      const newFavorite = { ...action.payload, isFavorite: true }
      const updatedCurrentTips = state.currentTips.map(tip =>
        tip.id === action.payload.id ? newFavorite : tip
      )
      return {
        ...state,
        currentTips: updatedCurrentTips,
        favoriteTips: [...state.favoriteTips, newFavorite]
      }
    
    case 'REMOVE_FAVORITE_TIP':
      const removedFromFavorites = state.favoriteTips.filter(tip => tip.id !== action.payload)
      const updatedCurrentTipsRemoved = state.currentTips.map(tip =>
        tip.id === action.payload ? { ...tip, isFavorite: false } : tip
      )
      return {
        ...state,
        currentTips: updatedCurrentTipsRemoved,
        favoriteTips: removedFromFavorites
      }
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    
    case 'SET_SELECTED_TIP':
      return {
        ...state,
        selectedTip: action.payload
      }
    
    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: action.payload
      }
    
    case 'UPDATE_TIP':
      const updatedTips = state.currentTips.map(tip =>
        tip.id === action.payload.id ? action.payload : tip
      )
      const updatedFavorites = state.favoriteTips.map(tip =>
        tip.id === action.payload.id ? action.payload : tip
      )
      return {
        ...state,
        currentTips: updatedTips,
        favoriteTips: updatedFavorites
      }
    
    case 'RESET_STATE':
      return initialState
    
    case 'LOAD_PERSISTED_STATE':
      return {
        ...state,
        ...action.payload
      }
    
    default:
      return state
  }
}

// Context interfaces
interface WellnessContextType {
  state: AppState
  dispatch: React.Dispatch<WellnessAction>
  actions: {
    setUserProfile: (profile: UserProfile | null) => void
    setCurrentTips: (tips: WellnessTip[]) => void
    toggleFavoriteTip: (tip: WellnessTip) => void
    setSelectedTip: (tip: WellnessTip | null) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    setCurrentStep: (step: AppStep) => void
    updateTip: (tip: WellnessTip) => void
    resetState: () => void
    resetProfile: () => void
    resetTips: () => void
    loadPersistedState: () => void
    persistState: () => void
  }
}

// Create context
const WellnessContext = createContext<WellnessContextType | undefined>(undefined)

// Provider component
interface WellnessProviderProps {
  children: ReactNode
}

export function WellnessProvider({ children }: WellnessProviderProps) {
  const [state, dispatch] = useReducer(wellnessReducer, initialState)

  // Local storage utilities
  const loadFromLocalStorage = (key: string) => {
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : null
      } catch (error) {
        console.error(`Error loading from localStorage (${key}):`, error)
        return null
      }
    }
    return null
  }

  const saveToLocalStorage = (key: string, data: any) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(data))
      } catch (error) {
        console.error(`Error saving to localStorage (${key}):`, error)
      }
    }
  }

  // Action creators
  const actions = {
    setUserProfile: (profile: UserProfile | null) => {
      dispatch({ type: 'SET_USER_PROFILE', payload: profile })
      if (profile) {
        saveToLocalStorage(APP_CONFIG.localStorageKeys.userProfile, profile)
      } else {
        localStorage.removeItem(APP_CONFIG.localStorageKeys.userProfile)
      }
    },

    setCurrentTips: (tips: WellnessTip[]) => {
      dispatch({ type: 'SET_CURRENT_TIPS', payload: tips })
    },

    toggleFavoriteTip: (tip: WellnessTip) => {
      if (tip.isFavorite) {
        dispatch({ type: 'REMOVE_FAVORITE_TIP', payload: tip.id })
      } else {
        dispatch({ type: 'ADD_FAVORITE_TIP', payload: tip })
      }
      // Persist favorites
      const updatedFavorites = tip.isFavorite 
        ? state.favoriteTips.filter(t => t.id !== tip.id)
        : [...state.favoriteTips, { ...tip, isFavorite: true }]
      saveToLocalStorage(APP_CONFIG.localStorageKeys.favorites, updatedFavorites)
    },

    setLoading: (loading: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: loading })
    },

    setError: (error: string | null) => {
      dispatch({ type: 'SET_ERROR', payload: error })
    },

    setSelectedTip: (tip: WellnessTip | null) => {
      dispatch({ type: 'SET_SELECTED_TIP', payload: tip })
    },

    setCurrentStep: (step: AppStep) => {
      dispatch({ type: 'SET_CURRENT_STEP', payload: step })
    },

    updateTip: (tip: WellnessTip) => {
      dispatch({ type: 'UPDATE_TIP', payload: tip })
      if (tip.isFavorite) {
        const updatedFavorites = state.favoriteTips.map(t => 
          t.id === tip.id ? tip : t
        )
        saveToLocalStorage(APP_CONFIG.localStorageKeys.favorites, updatedFavorites)
      }
    },

    resetState: () => {
      dispatch({ type: 'RESET_STATE' })
      
      // Clear ALL localStorage data related to wellness app
      Object.values(APP_CONFIG.localStorageKeys).forEach(key => {
        localStorage.removeItem(key)
      })
      
      // Clear any other potential cached data
      const allKeys = Object.keys(localStorage)
      allKeys.forEach(key => {
        if (key.includes('wellness') || key.includes('ai-wellness')) {
          localStorage.removeItem(key)
        }
      })
    },

    resetProfile: () => {
      dispatch({ type: 'SET_USER_PROFILE', payload: null })
      dispatch({ type: 'SET_CURRENT_TIPS', payload: [] })
      dispatch({ type: 'SET_SELECTED_TIP', payload: null })
      dispatch({ type: 'SET_CURRENT_STEP', payload: 'profile-setup' })
      dispatch({ type: 'SET_ERROR', payload: null })
      
      // Clear localStorage except favorites
      localStorage.removeItem(APP_CONFIG.localStorageKeys.userProfile)
      localStorage.removeItem(APP_CONFIG.localStorageKeys.appState)
    },

    resetTips: () => {
      dispatch({ type: 'SET_CURRENT_TIPS', payload: [] })
      dispatch({ type: 'SET_SELECTED_TIP', payload: null })
      dispatch({ type: 'SET_ERROR', payload: null })
      
      // Clear any cached tip data
      localStorage.removeItem(APP_CONFIG.localStorageKeys.appState)
      
      if (state.userProfile) {
        // Force fresh generation
        dispatch({ type: 'SET_CURRENT_STEP', payload: 'tips-generation' })
      }
    },

    loadPersistedState: () => {
      const userProfile = loadFromLocalStorage(APP_CONFIG.localStorageKeys.userProfile)
      const favoriteTips = loadFromLocalStorage(APP_CONFIG.localStorageKeys.favorites) || []
      
      const persistedState: Partial<AppState> = {}
      
      if (userProfile) {
        persistedState.userProfile = {
          ...userProfile,
          createdAt: new Date(userProfile.createdAt),
          updatedAt: new Date(userProfile.updatedAt)
        }
        persistedState.currentStep = 'tips-display'
      }
      
      if (favoriteTips.length > 0) {
        persistedState.favoriteTips = favoriteTips.map((tip: any) => ({
          ...tip,
          createdAt: new Date(tip.createdAt),
          isFavorite: true
        }))
      }
      
      if (Object.keys(persistedState).length > 0) {
        dispatch({ type: 'LOAD_PERSISTED_STATE', payload: persistedState })
      }
    },

    persistState: () => {
      const stateToSave = {
        userProfile: state.userProfile,
        favoriteTips: state.favoriteTips,
        currentStep: state.currentStep
      }
      saveToLocalStorage(APP_CONFIG.localStorageKeys.appState, stateToSave)
    }
  }

  const contextValue: WellnessContextType = {
    state,
    dispatch,
    actions
  }

  return (
    <WellnessContext.Provider value={contextValue}>
      {children}
    </WellnessContext.Provider>
  )
}

// Custom hook to use the wellness context
export function useWellness() {
  const context = useContext(WellnessContext)
  if (context === undefined) {
    throw new Error('useWellness must be used within a WellnessProvider')
  }
  return context
}

// Hook for loading persisted state on app initialization
export function usePersistedState() {
  const { actions } = useWellness()
  
  React.useEffect(() => {
    actions.loadPersistedState()
  }, [actions])
}
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, RefreshCw, Sparkles } from 'lucide-react'

interface StatusIndicatorProps {
  type: 'loading' | 'success' | 'error' | 'info'
  message: string
  isVisible: boolean
  onDismiss?: () => void
}

export function StatusIndicator({ type, message, isVisible, onDismiss }: StatusIndicatorProps) {
  const icons = {
    loading: RefreshCw,
    success: CheckCircle,
    error: AlertCircle,
    info: Sparkles
  }

  const colors = {
    loading: 'bg-blue-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-wellness-500'
  }

  const Icon = icons[type]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <motion.div
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            className={`${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md`}
          >
            <motion.div
              animate={{ 
                rotate: type === 'loading' ? 360 : 0 
              }}
              transition={{ 
                duration: type === 'loading' ? 2 : 0.3, 
                repeat: type === 'loading' ? Infinity : 0,
                ease: 'linear' 
              }}
            >
              <Icon className="w-5 h-5" />
            </motion.div>
            
            <div className="flex-1">
              <p className="text-sm font-medium">{message}</p>
            </div>
            
            {onDismiss && type !== 'loading' && (
              <button
                onClick={onDismiss}
                className="text-white/80 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook for managing status messages
export function useStatusIndicator() {
  const [status, setStatus] = useState<{
    type: 'loading' | 'success' | 'error' | 'info'
    message: string
    isVisible: boolean
  }>({
    type: 'info',
    message: '',
    isVisible: false
  })

  const showStatus = (type: 'loading' | 'success' | 'error' | 'info', message: string, duration?: number) => {
    setStatus({ type, message, isVisible: true })
    
    if (type !== 'loading' && duration !== 0) {
      setTimeout(() => {
        setStatus(prev => ({ ...prev, isVisible: false }))
      }, duration || 3000)
    }
  }

  const hideStatus = () => {
    setStatus(prev => ({ ...prev, isVisible: false }))
  }

  return {
    status,
    showStatus,
    hideStatus
  }
}
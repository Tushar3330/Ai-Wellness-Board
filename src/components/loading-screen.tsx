'use client'

import { motion } from 'framer-motion'
import { Sparkles, Heart, Brain, Moon } from 'lucide-react'

export function LoadingScreen() {
  const icons = [
    { Icon: Heart, color: 'text-red-500', delay: 0 },
    { Icon: Brain, color: 'text-purple-500', delay: 0.2 },
    { Icon: Sparkles, color: 'text-wellness-500', delay: 0.4 },
    { Icon: Moon, color: 'text-blue-500', delay: 0.6 }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-wellness-50 via-white to-wellness-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 max-w-md"
      >
        {/* Animated Icons */}
        <div className="flex justify-center gap-4 mb-8">
          {icons.map(({ Icon, color, delay }, index) => (
            <motion.div
              key={index}
              initial={{ y: 0 }}
              animate={{ y: [-10, 0, -10] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay,
                ease: "easeInOut"
              }}
              className={`w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center ${color}`}
            >
              <Icon className="w-6 h-6" />
            </motion.div>
          ))}
        </div>

        {/* Loading Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-6 rounded-full bg-wellness-gradient flex items-center justify-center"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Creating Your Wellness Plan
          </h2>
          <p className="text-gray-600 mb-4">
            Our AI is analyzing your profile and generating personalized recommendations just for you...
          </p>
          
          {/* Loading Steps */}
          <div className="space-y-2 text-sm text-gray-500">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center justify-center gap-2"
            >
              <div className="w-2 h-2 bg-wellness-500 rounded-full animate-pulse" />
              Analyzing your goals and preferences
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="flex items-center justify-center gap-2"
            >
              <div className="w-2 h-2 bg-wellness-500 rounded-full animate-pulse" />
              Consulting wellness experts and research
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
              className="flex items-center justify-center gap-2"
            >
              <div className="w-2 h-2 bg-wellness-500 rounded-full animate-pulse" />
              Crafting your personalized recommendations
            </motion.div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="h-1 bg-wellness-500 rounded-full mt-8 mx-auto max-w-xs"
        />
      </motion.div>
    </div>
  )
}
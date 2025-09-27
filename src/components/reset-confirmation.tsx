'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, X, RefreshCw, Trash2 } from 'lucide-react'

interface ResetConfirmationProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  type: 'profile' | 'tips' | 'all'
  title: string
  description: string
}

export function ResetConfirmation({ 
  isOpen, 
  onClose, 
  onConfirm, 
  type, 
  title, 
  description 
}: ResetConfirmationProps) {
  const getIcon = () => {
    switch (type) {
      case 'profile': return RefreshCw
      case 'tips': return RefreshCw  
      case 'all': return Trash2
      default: return AlertTriangle
    }
  }

  const getColor = () => {
    switch (type) {
      case 'profile': return 'text-blue-600'
      case 'tips': return 'text-wellness-600'
      case 'all': return 'text-red-600'
      default: return 'text-orange-600'
    }
  }

  const Icon = getIcon()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <Card className="shadow-2xl border-0">
              <CardHeader className="relative text-center pb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute right-2 top-2"
                >
                  <X className="w-4 h-4" />
                </Button>

                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center ${getColor()}`}>
                  <Icon className="w-8 h-8" />
                </div>

                <CardTitle className="text-xl">
                  {title}
                </CardTitle>
                <CardDescription className="text-base">
                  {description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {type === 'all' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-medium text-red-800 mb-1">
                          This action cannot be undone
                        </h4>
                        <p className="text-sm text-red-700">
                          All your profile data, wellness tips, and favorites will be permanently deleted.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {type === 'profile' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <RefreshCw className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-800 mb-1">
                          Profile Reset
                        </h4>
                        <p className="text-sm text-blue-700">
                          Your profile and generated tips will be cleared. Favorites will be kept.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {type === 'tips' && (
                  <div className="bg-wellness-50 border border-wellness-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <RefreshCw className="w-5 h-5 text-wellness-600 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-medium text-wellness-800 mb-1">
                          Get Fresh Tips
                        </h4>
                        <p className="text-sm text-wellness-700">
                          Current tips will be cleared and new ones will be generated based on your profile.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    variant={type === 'all' ? 'destructive' : 'wellness'}
                    onClick={onConfirm}
                    className="flex-1 gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {type === 'all' ? 'Delete All' : 'Reset'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWellness } from '@/store/wellness-context'
import { Button } from '@/components/ui/button'
import { ResetConfirmation } from '@/components/reset-confirmation'
import { 
  MoreVertical, 
  RefreshCw, 
  User, 
  Trash2,
  RotateCcw
} from 'lucide-react'

interface ResetMenuProps {
  variant?: 'button' | 'dropdown'
  size?: 'sm' | 'default'
  className?: string
}

export function ResetMenu({ variant = 'dropdown', size = 'default', className = '' }: ResetMenuProps) {
  const { state, actions } = useWellness()
  const [isOpen, setIsOpen] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    type: 'profile' | 'tips' | 'all'
    title: string
    description: string
    onConfirm: () => void
  }>({
    isOpen: false,
    type: 'profile',
    title: '',
    description: '',
    onConfirm: () => {}
  })

  const resetOptions = [
    {
      id: 'tips',
      label: 'Reset Tips Only',
      description: 'Clear current tips and generate new ones',
      icon: RefreshCw,
      color: 'text-wellness-600 hover:bg-wellness-50',
      show: state.currentTips.length > 0,
      action: () => {
        setConfirmDialog({
          isOpen: true,
          type: 'tips',
          title: 'Reset Tips?',
          description: 'This will clear your current tips and generate fresh recommendations based on your profile.',
          onConfirm: () => {
            actions.resetTips()
            setConfirmDialog(prev => ({ ...prev, isOpen: false }))
            setIsOpen(false)
          }
        })
      }
    },
    {
      id: 'profile',
      label: 'Reset Profile',
      description: 'Clear profile and tips, keep favorites',
      icon: User,
      color: 'text-blue-600 hover:bg-blue-50',
      show: state.userProfile !== null,
      action: () => {
        setConfirmDialog({
          isOpen: true,
          type: 'profile',
          title: 'Reset Profile?',
          description: 'This will clear your profile information and generated tips. Your favorites will be preserved.',
          onConfirm: () => {
            actions.resetProfile()
            setConfirmDialog(prev => ({ ...prev, isOpen: false }))
            setIsOpen(false)
          }
        })
      }
    },
    {
      id: 'all',
      label: 'Reset Everything',
      description: 'Clear all data including favorites',
      icon: Trash2,
      color: 'text-red-600 hover:bg-red-50',
      show: state.userProfile !== null || state.favoriteTips.length > 0,
      action: () => {
        setConfirmDialog({
          isOpen: true,
          type: 'all',
          title: 'Reset Everything?',
          description: 'This will permanently delete all your data including profile, tips, and favorites.',
          onConfirm: () => {
            actions.resetState()
            setConfirmDialog(prev => ({ ...prev, isOpen: false }))
            setIsOpen(false)
          }
        })
      }
    }
  ]

  const visibleOptions = resetOptions.filter(option => option.show)

  if (visibleOptions.length === 0) {
    return null
  }

  if (variant === 'button') {
    // Simple reset button for quick access
    return (
      <>
        <Button
          variant="outline"
          size={size}
          onClick={() => resetOptions[0]?.action()}
          className={`gap-2 ${className}`}
          disabled={state.isLoading}
        >
          <RotateCcw className="w-4 h-4" />
          Reset Tips
        </Button>
        
        <ResetConfirmation
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
          onConfirm={confirmDialog.onConfirm}
          type={confirmDialog.type}
          title={confirmDialog.title}
          description={confirmDialog.description}
        />
      </>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Dropdown Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <MoreVertical className="w-4 h-4" />
      </Button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
            >
              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                Reset Options
              </div>
              
              {visibleOptions.map((option, index) => (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={option.action}
                  className={`w-full px-3 py-3 text-left transition-colors ${option.color} flex items-start gap-3`}
                >
                  <option.icon className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium text-sm text-gray-900">
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      {option.description}
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <ResetConfirmation
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        type={confirmDialog.type}
        title={confirmDialog.title}
        description={confirmDialog.description}
      />
    </div>
  )
}
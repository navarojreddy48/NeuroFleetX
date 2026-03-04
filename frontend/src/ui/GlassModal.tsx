import { AnimatePresence, motion } from 'framer-motion'
import type { PropsWithChildren } from 'react'
import { useTheme } from '../hooks/useTheme'
import { cn } from './cn'

type GlassModalProps = PropsWithChildren<{
  open: boolean
  title: string
  onClose: () => void
  className?: string
}>

export const GlassModal = ({ open, title, onClose, className, children }: GlassModalProps) => {
  const { theme } = useTheme()

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            'fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur',
            theme === 'light' ? 'bg-slate-200/60' : 'bg-slate-950/60',
          )}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={cn(
              'w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl backdrop-blur-xl',
              theme === 'light'
                ? 'border-slate-300 bg-white/95'
                : 'border-white/15 bg-zinc-900/85',
              className ?? '',
            )}
          >
            <div className="flex-shrink-0 sticky top-0 z-10 p-6 pb-4 flex items-center justify-between border-b backdrop-blur-xl" style={{
              backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(24, 24, 27, 0.85)',
              borderColor: theme === 'light' ? 'rgb(226, 232, 240)' : 'rgba(255, 255, 255, 0.1)'
            }}>
              <h3 className={cn('text-lg font-semibold', theme === 'light' ? 'text-slate-900' : 'text-zinc-100')}>{title}</h3>
              <button
                onClick={onClose}
                className={cn(
                  'rounded-lg border px-3 py-1 text-sm transition',
                  theme === 'light'
                    ? 'border-slate-300 text-slate-700 hover:bg-slate-100'
                    : 'border-white/20 text-zinc-200 hover:bg-white/10',
                )}
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 pt-4">
              {children}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

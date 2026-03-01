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
              'w-full max-w-3xl rounded-2xl border p-6 shadow-2xl backdrop-blur-xl',
              theme === 'light'
                ? 'border-slate-300 bg-white/95'
                : 'border-white/15 bg-zinc-900/85',
              className ?? '',
            )}
          >
            <div className="mb-5 flex items-center justify-between">
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
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

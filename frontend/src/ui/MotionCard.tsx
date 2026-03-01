import { motion } from 'framer-motion'
import type { PropsWithChildren } from 'react'
import { useTheme } from '../hooks/useTheme'
import { cn } from './cn'

type MotionCardProps = PropsWithChildren<{
  className?: string
  hover?: boolean
}>

export const MotionCard = ({ children, className, hover = true }: MotionCardProps) => {
  const { theme } = useTheme()

  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn(
        'rounded-2xl border p-6 backdrop-blur-sm transition duration-300 ease-in-out hover:scale-[1.02]',
        theme === 'light'
          ? 'border-slate-200 bg-gradient-to-br from-white to-emerald-50/60 shadow-lg'
          : 'border-white/10 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 shadow-xl',
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

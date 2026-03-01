import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from './cn'

type RippleButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'emerald' | 'slate' | 'danger'
}

const variantStyles: Record<NonNullable<RippleButtonProps['variant']>, string> = {
  emerald: 'bg-emerald-500 text-white hover:bg-emerald-400',
  slate: 'bg-zinc-800/90 text-zinc-100 hover:bg-zinc-700',
  danger: 'bg-red-500 text-white hover:bg-red-400',
}

export const RippleButton = ({
  children,
  className,
  onClick,
  variant = 'emerald',
  ...props
}: RippleButtonProps) => {
  const [rippleKey, setRippleKey] = useState(0)

  return (
    <button
      onClick={(event) => {
        setRippleKey((current) => current + 1)
        onClick?.(event)
      }}
      className={cn(
        'relative overflow-hidden rounded-xl px-4 py-2 text-sm font-semibold shadow-lg transition duration-300 ease-in-out',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      <AnimatePresence>
        <motion.span
          key={rippleKey}
          initial={{ scale: 0, opacity: 0.35 }}
          animate={{ scale: 2.2, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="pointer-events-none absolute inset-0 m-auto h-24 w-24 rounded-full bg-white/40"
        />
      </AnimatePresence>
      <span className="relative z-10">{children}</span>
    </button>
  )
}

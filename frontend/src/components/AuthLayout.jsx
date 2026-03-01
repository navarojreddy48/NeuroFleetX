import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Route, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'

const highlights = [
  { icon: Truck, text: 'Real-time tracking' },
  { icon: Route, text: 'Route optimization' },
  { icon: CheckCircle2, text: 'Predictive analytics' },
]

function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-emerald-50 to-teal-50">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.16)_1px,transparent_1px)] bg-[size:40px_40px] opacity-35" />
      <div className="pointer-events-none absolute -left-20 top-32 h-64 w-64 rounded-full bg-emerald-300/40 blur-3xl" />
      <div className="pointer-events-none absolute right-12 top-1/3 h-72 w-72 rounded-full bg-indigo-300/25 blur-3xl" />

      <header className="relative z-20 border-b border-white/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-xl font-bold tracking-tight text-slate-900">
            NeuroFleetX
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-12"
      >
        <motion.section
          initial={{ opacity: 0, x: -22 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="relative hidden overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-xl backdrop-blur md:block lg:p-10"
        >
          <div className="pointer-events-none absolute -right-10 top-8 h-40 w-40 rounded-full bg-emerald-300/30 blur-3xl" />
          <div className="pointer-events-none absolute bottom-4 left-4 h-28 w-28 rounded-full bg-indigo-300/25 blur-2xl" />

          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700">
            Welcome to NeuroFleetX
          </span>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 lg:text-5xl">
            Smarter fleet operations start here
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-600">
            AI-powered fleet &amp; traffic intelligence platform designed for high-performance urban mobility teams.
          </p>

          <div className="mt-8 space-y-4">
            {highlights.map((item, index) => {
              const Icon = item.icon

              return (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                >
                  <span className="inline-flex rounded-lg bg-emerald-100 p-2 text-emerald-700">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="text-sm font-medium text-slate-700">{item.text}</p>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute right-8 top-22 h-14 w-14 rounded-2xl border border-white/70 bg-white/60 shadow-lg"
          />
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute bottom-12 right-24 h-10 w-10 rounded-xl border border-white/70 bg-emerald-100/70 shadow"
          />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 22 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.08 }}
          className="relative flex items-center justify-center"
        >
          <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />
          {children}
        </motion.section>
      </motion.div>
    </div>
  )
}

export default AuthLayout

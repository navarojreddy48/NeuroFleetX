import { BarChart3, GitCompare, History, Map, Route } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../ui/cn'
import { MotionCard } from '../../ui/MotionCard'
import { PageTransition } from '../../ui/PageTransition'
import { RippleButton } from '../../ui/RippleButton'

const modules = [
  { icon: Map, label: 'Visualize' },
  { icon: GitCompare, label: 'Compare' },
  { icon: History, label: 'History' },
]

export const RouteOptimizationPage = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()

  return (
    <PageTransition>
      <div className="space-y-6">
        <MotionCard className="border-2 border-teal-300 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 shadow-2xl" hover={false}>
          <div className="flex items-center gap-3">
            <Route className="h-10 w-10 text-gray-900" />
            <div>
              <h1 className="text-3xl font-black text-gray-900">Route Optimization</h1>
              <p className="mt-1 text-sm font-bold text-gray-900">AI-powered route planning and optimization</p>
            </div>
          </div>
        </MotionCard>
        
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Main Content - Map Placeholder */}
          <MotionCard className="xl:col-span-2" hover={false}>
            <h2 className="mb-4 text-xl font-black text-gray-900">National Fleet Route View</h2>
            <div className="flex h-[620px] w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
              <div className="text-center">
                <Map className="mx-auto mb-4 h-16 w-16 text-emerald-600" />
                <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                  National Fleet Route View
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Interactive map loading...
                </p>
              </div>
            </div>
          </MotionCard>

          {/* Sidebar */}
          <div className="space-y-6">
          <MotionCard>
            <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
            <RippleButton onClick={() => navigate('/traffic-analytics')} className="w-full">
              Traffic Analytics
            </RippleButton>
          </MotionCard>

          <MotionCard
            className={cn(
              'border-amber-400/30 bg-gradient-to-br',
              theme === 'light' ? 'from-amber-50 to-white' : 'from-amber-500/10 to-zinc-900/40',
            )}
          >
            <div className="flex items-start gap-3">
              <BarChart3 className={cn('mt-1 h-5 w-5', theme === 'light' ? 'text-amber-600' : 'text-amber-300')} />
              <div>
                <h3 className={cn('font-semibold', theme === 'light' ? 'text-amber-700' : 'text-amber-200')}>
                  Traffic Alert
                </h3>
                <p className={cn('mt-1 text-sm', theme === 'light' ? 'text-slate-600' : 'text-zinc-300')}>
                  High traffic expected on Mumbai-Pune express lane in the next 45 minutes.
                </p>
              </div>
            </div>
          </MotionCard>

          <MotionCard>
            <h2 className="mb-4 text-lg font-semibold">Module Navigation</h2>
            <div className="space-y-2">
              {modules.map((module) => {
                const Icon = module.icon

                return (
                  <button
                    key={module.label}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition',
                      theme === 'light'
                        ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                        : 'border-white/10 bg-zinc-900/70 text-zinc-200 hover:bg-zinc-800',
                    )}
                  >
                    <Icon className="h-4 w-4 text-emerald-300" />
                    {module.label}
                  </button>
                )
              })}
            </div>
          </MotionCard>
        </div>
      </div>
      </div>
    </PageTransition>
  )
}

import { BarChart3, GitCompare, History, Map } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { FleetMap } from '../../components/FleetMap'
import { routeOptimizationMapCenter } from '../../data/mockData'
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
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <MotionCard className="xl:col-span-2" hover={false}>
          <h1 className="mb-4 text-2xl font-semibold">Route Optimization</h1>
          <FleetMap
            center={routeOptimizationMapCenter}
            zoom={5}
            markerLabel="National Fleet Route View"
            className="h-[620px] w-full overflow-hidden rounded-2xl"
          />
        </MotionCard>

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
                <h3 className={cn('font-semibold', theme === 'light' ? 'text-amber-700' : 'text-amber-200')}>Traffic Alert</h3>
                <p className={cn('mt-1 text-sm', theme === 'light' ? 'text-slate-600' : 'text-zinc-300')}>High traffic expected on Mumbai-Pune express lane in the next 45 minutes.</p>
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
    </PageTransition>
  )
}

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FleetMap } from '../../components/FleetMap'
import { congestionAlerts, peakHourPredictions, routeOptimizationMapCenter, trafficZones } from '../../data/mockData'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../ui/cn'
import { MotionCard } from '../../ui/MotionCard'
import { PageTransition } from '../../ui/PageTransition'
import { RippleButton } from '../../ui/RippleButton'

const stats = [
  { label: 'High Traffic Zones', value: '09' },
  { label: 'Medium Traffic', value: '14' },
  { label: 'Clear Routes', value: '27' },
  { label: 'Active Alerts', value: '06' },
]

export const TrafficAnalyticsPage = () => {
  const { theme } = useTheme()

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">Traffic & Congestion Analytics</h1>
          <select
            className={cn(
              'rounded-xl border px-3 py-2 text-sm outline-none',
              theme === 'light'
                ? 'border-slate-200 bg-white text-slate-700'
                : 'border-white/10 bg-zinc-900/80 text-zinc-200',
            )}
          >
            <option>Live Now</option>
            <option>Last 1 Hour</option>
            <option>Today</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <MotionCard key={stat.label} className="bg-gradient-to-br from-emerald-500/10 to-indigo-500/10">
              <p className={cn('text-sm', theme === 'light' ? 'text-slate-500' : 'text-zinc-400')}>{stat.label}</p>
              <p className={cn('mt-2 text-3xl font-semibold', theme === 'light' ? 'text-slate-900' : 'text-zinc-100')}>{stat.value}</p>
            </MotionCard>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <MotionCard className="xl:col-span-2" hover={false}>
            <h2 className="mb-4 text-lg font-semibold">Traffic Density Heatmap</h2>
            <FleetMap
              center={routeOptimizationMapCenter}
              zoom={5}
              markerLabel="Traffic Observation Node"
              circles={trafficZones}
              className="h-[560px] w-full overflow-hidden rounded-2xl"
            />
          </MotionCard>

          <div className="space-y-6">
            <MotionCard>
              <h3 className="mb-4 text-lg font-semibold">Congestion Alerts</h3>
              <div className="space-y-3">
                {congestionAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={cn(
                      'rounded-xl border p-3 text-sm',
                      theme === 'light'
                        ? 'border-slate-200 bg-white text-slate-700'
                        : 'border-white/10 bg-zinc-900/70 text-zinc-300',
                    )}
                  >
                    <p className={cn('font-semibold', theme === 'light' ? 'text-slate-900' : 'text-zinc-100')}>{alert.level}</p>
                    <p className="mt-1">{alert.area}</p>
                  </div>
                ))}
              </div>
            </MotionCard>

            <MotionCard>
              <h3 className="mb-4 text-lg font-semibold">Peak Hour Predictions</h3>
              <div className="space-y-4">
                {peakHourPredictions.map((slot) => (
                  <div key={slot.time}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className={cn(theme === 'light' ? 'text-slate-700' : 'text-zinc-300')}>{slot.time}</span>
                      <span className={cn(theme === 'light' ? 'text-slate-500' : 'text-zinc-400')}>{slot.value}%</span>
                    </div>
                    <div className={cn('h-2 rounded-full', theme === 'light' ? 'bg-slate-200' : 'bg-zinc-800')}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${slot.value}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-red-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </MotionCard>
          </div>
        </div>

        <Link to="/dashboard" className="inline-block">
          <RippleButton className="inline-flex items-center gap-2" variant="slate">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </RippleButton>
        </Link>
      </div>
    </PageTransition>
  )
}

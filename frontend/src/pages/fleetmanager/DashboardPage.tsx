import {
  Activity,
  Car,
  CircleDollarSign,
  Route,
  TrendingUp,
  Truck,
} from 'lucide-react'
import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { vehicleUsageData, weeklyTrips } from '../../data/mockData'
import { MotionCard } from '../../ui/MotionCard'
import { PageTransition } from '../../ui/PageTransition'
import { RippleButton } from '../../ui/RippleButton'

const FleetDashboardCharts = lazy(() => import('../../components/charts/FleetDashboardCharts'))

const kpis = [
  {
    title: 'Active Vehicles',
    value: '214',
    subtitle: '+8% from last week',
    icon: Truck,
    gradient: 'from-emerald-500/20 to-teal-500/10',
  },
  {
    title: 'Total Fleet Size',
    value: '286',
    subtitle: 'Across 22 cities',
    icon: Car,
    gradient: 'from-indigo-500/20 to-emerald-500/10',
  },
  {
    title: 'Active Trips',
    value: '498',
    subtitle: 'Live route execution',
    icon: Route,
    gradient: 'from-teal-500/20 to-zinc-500/10',
  },
  {
    title: 'Weekly Revenue',
    value: '$184.2K',
    subtitle: '+5.1% vs previous week',
    icon: CircleDollarSign,
    gradient: 'from-emerald-400/20 to-indigo-500/10',
  },
  {
    title: 'Active Drivers',
    value: '173',
    subtitle: '93% availability',
    icon: Activity,
    gradient: 'from-zinc-500/20 to-emerald-500/10',
  },
  {
    title: 'Completed Trips',
    value: '1,952',
    subtitle: 'This month',
    icon: TrendingUp,
    gradient: 'from-emerald-500/20 to-teal-500/10',
  },
]

const pieColors = ['#10b981', '#14b8a6', '#6366f1', '#f59e0b']

export const DashboardPage = () => {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon

            return (
              <MotionCard key={kpi.title} className={`bg-gradient-to-br ${kpi.gradient}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-zinc-300">{kpi.title}</p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100">{kpi.value}</p>
                    <p className="mt-2 text-xs text-zinc-400">{kpi.subtitle}</p>
                  </div>
                  <div className="rounded-xl border border-white/15 bg-white/10 p-2">
                    <Icon className="h-5 w-5 text-emerald-300" />
                  </div>
                </div>
              </MotionCard>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <MotionCard className="space-y-4 xl:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Route Optimization Analytics</h2>
              <Link to="/route-optimization">
                <RippleButton>View Dashboard</RippleButton>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Link to="/traffic-analytics" className="group rounded-2xl border border-white/10 bg-zinc-900/70 p-5 transition hover:border-emerald-400/40">
                <p className="text-base font-semibold text-zinc-100">Traffic Analytics</p>
                <p className="mt-1 text-sm text-zinc-400">Monitor traffic density and congestion hotspots</p>
              </Link>
              <div className="group rounded-2xl border border-white/10 bg-zinc-900/70 p-5 transition hover:border-indigo-400/40">
                <p className="text-base font-semibold text-zinc-100">Reports</p>
                <p className="mt-1 text-sm text-zinc-400">Download route health and utilization summaries</p>
              </div>
            </div>
          </MotionCard>

          <MotionCard className="space-y-4">
            <h2 className="text-xl font-semibold">Predictive Maintenance</h2>
            <p className="text-sm text-zinc-300">
              AI model predicts component wear with 96% confidence across active long-haul units.
            </p>
            <RippleButton className="w-full">View Dashboard</RippleButton>
          </MotionCard>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Suspense
            fallback={
              <>
                <MotionCard className="xl:col-span-2" hover={false}>
                  <div className="h-[320px] animate-pulse rounded-2xl bg-zinc-900/40" />
                </MotionCard>
                <MotionCard hover={false}>
                  <div className="h-[320px] animate-pulse rounded-2xl bg-zinc-900/40" />
                </MotionCard>
              </>
            }
          >
            <FleetDashboardCharts
              weeklyTrips={weeklyTrips}
              vehicleUsageData={vehicleUsageData}
              pieColors={pieColors}
            />
          </Suspense>
        </div>
      </div>
    </PageTransition>
  )
}

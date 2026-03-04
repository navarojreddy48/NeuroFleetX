import {
  Award,
  Car,
  Clock,
  CircleDollarSign,
  Route,
  Sparkles,
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
    gradient: 'bg-gradient-to-br from-blue-100 via-blue-50 to-white',
    iconBg: 'bg-blue-500',
    border: 'border-blue-300',
  },
  {
    title: 'Total Fleet Size',
    value: '286',
    subtitle: 'Across 22 cities',
    icon: Car,
    gradient: 'bg-gradient-to-br from-emerald-100 via-emerald-50 to-white',
    iconBg: 'bg-emerald-500',
    border: 'border-emerald-300',
  },
  {
    title: 'Active Trips',
    value: '498',
    subtitle: 'Live route execution',
    icon: Route,
    gradient: 'bg-gradient-to-br from-purple-100 via-purple-50 to-white',
    iconBg: 'bg-purple-500',
    border: 'border-purple-300',
  },
  {
    title: 'Weekly Revenue',
    value: '$184.2K',
    subtitle: '+5.1% vs previous week',
    icon: CircleDollarSign,
    gradient: 'bg-gradient-to-br from-orange-100 via-orange-50 to-white',
    iconBg: 'bg-orange-500',
    border: 'border-orange-300',
  },
  {
    title: 'Active Drivers',
    value: '173',
    subtitle: '93% availability',
    icon: TrendingUp,
    gradient: 'bg-gradient-to-br from-teal-100 via-teal-50 to-white',
    iconBg: 'bg-teal-500',
    border: 'border-teal-300',
  },
  {
    title: 'Completed Trips',
    value: '1,952',
    subtitle: 'This month',
    icon: TrendingUp,
    gradient: 'bg-gradient-to-br from-yellow-100 via-yellow-50 to-white',
    iconBg: 'bg-yellow-500',
    border: 'border-yellow-300',
  },
]

const pieColors = ['#10b981', '#14b8a6', '#6366f1', '#f59e0b']

export const DashboardPage = () => {
  return (
    <PageTransition>
      <div className="space-y-6">
        <MotionCard className="relative overflow-hidden border-2 border-emerald-300 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 shadow-2xl" hover={false}>
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Award className="h-10 w-10 text-gray-900" />
                <h1 className="text-4xl font-black text-gray-900">Fleet Manager Dashboard</h1>
              </div>
              <p className="mt-2 text-lg font-bold text-gray-900">Track fleet health, route efficiency, and operational performance</p>
            </div>
            <Sparkles className="h-16 w-16 animate-pulse text-gray-900" />
          </div>
        </MotionCard>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon

            return (
              <MotionCard key={kpi.title} className={`${kpi.gradient} border-2 ${kpi.border} shadow-xl`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-600">{kpi.title}</p>
                    <p className="mt-2 text-3xl font-black text-gray-900">{kpi.value}</p>
                    <p className="mt-1 text-xs font-bold text-gray-500">{kpi.subtitle}</p>
                  </div>
                  <div className={`${kpi.iconBg} rounded-2xl p-3 shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </MotionCard>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <MotionCard className="space-y-4 border-2 border-blue-300 bg-gradient-to-br from-blue-100 via-blue-50 to-white shadow-xl xl:col-span-2" hover={false}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900">Route Optimization Analytics</h2>
              <Link to="/route-optimization">
                <RippleButton className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2 font-black text-white shadow-lg hover:from-blue-700 hover:to-blue-800">
                  View Dashboard
                </RippleButton>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Link to="/traffic-analytics" className="group rounded-2xl border-2 border-blue-200 bg-white p-5 transition hover:shadow-lg">
                <p className="text-base font-black text-gray-900">Traffic Analytics</p>
                <p className="mt-1 text-sm font-semibold text-gray-600">Monitor traffic density and congestion hotspots</p>
              </Link>
              <div className="group rounded-2xl border-2 border-purple-200 bg-white p-5 transition hover:shadow-lg">
                <p className="text-base font-black text-gray-900">Reports</p>
                <p className="mt-1 text-sm font-semibold text-gray-600">Download route health and utilization summaries</p>
              </div>
            </div>
          </MotionCard>

          <MotionCard className="space-y-4 border-2 border-emerald-300 bg-gradient-to-br from-emerald-100 via-emerald-50 to-white shadow-xl" hover={false}>
            <h2 className="text-xl font-black text-gray-900">Predictive Maintenance</h2>
            <p className="text-sm font-semibold text-gray-700">
              AI model predicts component wear with 96% confidence across active long-haul units.
            </p>
            <RippleButton className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 py-3 font-black text-white shadow-lg hover:from-emerald-700 hover:to-emerald-800">
              View Dashboard
            </RippleButton>
          </MotionCard>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <MotionCard className="xl:col-span-2" hover={false}>
                <div className="h-[320px] animate-pulse rounded-2xl bg-zinc-900/40" />
              </MotionCard>
              <MotionCard hover={false}>
                <div className="h-[320px] animate-pulse rounded-2xl bg-zinc-900/40" />
              </MotionCard>
            </div>
          }
        >
          <FleetDashboardCharts
            weeklyTrips={weeklyTrips}
            vehicleUsageData={vehicleUsageData}
            pieColors={pieColors}
          />
        </Suspense>

        <MotionCard className="border-2 border-gray-300 bg-gradient-to-br from-gray-50 to-white shadow-xl" hover={false}>
          <div className="flex items-center gap-3 border-b-2 border-gray-200 pb-4">
            <Clock className="h-6 w-6 text-gray-600" />
            <h2 className="text-xl font-black text-gray-900">Recent Fleet Activity</h2>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { time: '12 mins ago', activity: 'Route R-12 optimized for lower congestion', metric: '-18% ETA', color: 'bg-emerald-500' },
              { time: '35 mins ago', activity: 'Vehicle V-204 assigned to high-priority trip', metric: '+1 Dispatch', color: 'bg-blue-500' },
              { time: '1 hr ago', activity: 'Maintenance risk alert generated for Unit T-88', metric: 'Medium', color: 'bg-orange-500' },
            ].map((item) => (
              <div key={item.activity} className="flex items-center justify-between rounded-xl bg-gradient-to-r from-gray-50 to-white p-4 shadow-md">
                <div>
                  <p className="font-bold text-gray-900">{item.activity}</p>
                  <p className="text-xs font-bold text-gray-500">{item.time}</p>
                </div>
                <span className={`${item.color} rounded-full px-4 py-2 text-sm font-black text-white`}>
                  {item.metric}
                </span>
              </div>
            ))}
          </div>
        </MotionCard>
      </div>
    </PageTransition>
  )
}

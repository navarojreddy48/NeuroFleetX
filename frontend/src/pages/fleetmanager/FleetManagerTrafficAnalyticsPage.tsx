import { motion } from 'framer-motion'
import { ArrowLeft, Award, BarChart3, TrendingUp, Activity, MapPin, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SimpleFleetMap } from '../../components/SimpleFleetMap'
import { congestionAlerts, peakHourPredictions, routeOptimizationMapCenter, trafficZones } from '../../data/mockData'
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
  return (
    <PageTransition>
      <div className="space-y-6">
        <MotionCard className="relative overflow-hidden border-2 border-purple-300 bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 shadow-2xl" hover={false}>
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="h-10 w-10 text-gray-900" />
              <div>
                <h1 className="text-3xl font-black text-gray-900">Traffic & Congestion Analytics</h1>
                <p className="mt-1 text-sm font-bold text-gray-900">Real-time traffic monitoring and predictive insights</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="h-9 w-9 animate-pulse text-gray-900" />
              <select
                className="rounded-xl border-2 border-gray-900 bg-white px-4 py-2 text-sm font-bold text-gray-900 shadow-md outline-none"
              >
                <option>Live Now</option>
                <option>Last 1 Hour</option>
                <option>Today</option>
              </select>
            </div>
          </div>
        </MotionCard>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const colors = ['from-red-50 to-red-100', 'from-orange-50 to-orange-100', 'from-green-50 to-green-100', 'from-blue-50 to-blue-100']
            const iconColors = ['text-red-600', 'text-orange-600', 'text-green-600', 'text-blue-600']
            const icons = [Activity, TrendingUp, MapPin, BarChart3]
            const Icon = icons[index]
            
            return (
              <MotionCard key={stat.label} className={`bg-gradient-to-br ${colors[index]} border-2 shadow-xl ${index === 0 ? 'border-red-300' : index === 1 ? 'border-orange-300' : index === 2 ? 'border-green-300' : 'border-blue-300'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-600">{stat.label}</p>
                    <p className="mt-2 text-3xl font-black text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`rounded-2xl bg-white p-3 shadow-lg ${iconColors[index]}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                </div>
              </MotionCard>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <MotionCard className="xl:col-span-2 border-2 border-purple-300 bg-gradient-to-br from-purple-50 via-violet-50 to-white shadow-2xl" hover={false}>
            <h2 className="mb-4 text-xl font-black text-gray-900">Traffic Density Heatmap</h2>
            <SimpleFleetMap
              center={routeOptimizationMapCenter}
              zoom={5}
              markerLabel="Traffic Observation Node"
              circles={trafficZones}
              className="h-[560px] w-full overflow-hidden rounded-2xl"
            />
          </MotionCard>

          <div className="space-y-6">
            <MotionCard className="border-2 border-red-300 bg-gradient-to-br from-red-100 via-red-50 to-white shadow-xl" hover={false}>
              <h3 className="mb-4 text-lg font-black text-gray-900">Congestion Alerts</h3>
              <div className="space-y-3">
                {congestionAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="rounded-xl border-2 border-red-200 bg-white p-3 text-sm shadow-sm"
                  >
                    <p className="font-black text-gray-900">{alert.level}</p>
                    <p className="mt-1 font-semibold text-gray-700">{alert.area}</p>
                  </div>
                ))}
              </div>
            </MotionCard>

            <MotionCard className="border-2 border-amber-300 bg-gradient-to-br from-amber-100 via-amber-50 to-white shadow-xl" hover={false}>
              <h3 className="mb-4 text-lg font-black text-gray-900">Peak Hour Predictions</h3>
              <div className="space-y-4">
                {peakHourPredictions.map((slot) => (
                  <div key={slot.time}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-bold text-gray-700">{slot.time}</span>
                      <span className="font-bold text-gray-500">{slot.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
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
          <RippleButton className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-700 to-slate-800 px-5 py-3 font-black text-white shadow-lg" variant="slate">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </RippleButton>
        </Link>
      </div>
    </PageTransition>
  )
}

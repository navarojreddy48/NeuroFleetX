import { Award, BarChart3, GitCompare, History, Map, MapPinned, Sparkles, TrafficCone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SimpleFleetMap } from '../../components/SimpleFleetMap'
import { routeOptimizationMapCenter } from '../../data/mockData'
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

  return (
    <PageTransition>
      <div className="space-y-6">
        <MotionCard className="relative overflow-hidden border-2 border-teal-300 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 shadow-2xl" hover={false}>
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Award className="h-10 w-10 text-gray-900" />
                <h1 className="text-4xl font-black text-gray-900">Route Optimization</h1>
              </div>
              <p className="mt-2 text-lg font-bold text-gray-900">Plan efficient routes, reduce congestion, and improve fleet utilization</p>
            </div>
            <Sparkles className="h-16 w-16 animate-pulse text-gray-900" />
          </div>
        </MotionCard>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <MotionCard className="border-2 border-teal-300 bg-gradient-to-br from-teal-50 via-cyan-50 to-white shadow-2xl xl:col-span-2" hover={false}>
            <div className="mb-4 flex items-center gap-3">
              <MapPinned className="h-7 w-7 text-teal-600" />
              <h2 className="text-2xl font-black text-gray-900">National Fleet Route View</h2>
            </div>
          <SimpleFleetMap
            center={routeOptimizationMapCenter}
            zoom={5}
            markerLabel="National Fleet Route View"
            className="h-[620px] w-full"
          />
          </MotionCard>

          <div className="space-y-6">
            <MotionCard className="border-2 border-blue-300 bg-gradient-to-br from-blue-100 via-blue-50 to-white shadow-xl" hover={false}>
              <h2 className="mb-4 text-lg font-black text-gray-900">Quick Actions</h2>
              <div className="space-y-3">
                <RippleButton
                  onClick={() => navigate('/traffic-analytics')}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 py-3 font-black text-white shadow-lg hover:from-blue-700 hover:to-blue-800"
                >
                  Traffic Analytics
                </RippleButton>
                <RippleButton
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 py-3 font-black text-white shadow-lg hover:from-emerald-700 hover:to-emerald-800"
                >
                  Fleet Dashboard
                </RippleButton>
              </div>
            </MotionCard>

            <MotionCard className="border-2 border-amber-300 bg-gradient-to-br from-amber-100 via-amber-50 to-white shadow-xl" hover={false}>
              <div className="flex items-start gap-3">
                <BarChart3 className="mt-1 h-5 w-5 text-amber-600" />
                <div>
                  <h3 className="font-black text-amber-700">Traffic Alert</h3>
                  <p className="mt-1 text-sm font-semibold text-gray-700">High traffic expected on Mumbai-Pune express lane in the next 45 minutes.</p>
                </div>
              </div>
            </MotionCard>

            <MotionCard className="border-2 border-purple-300 bg-gradient-to-br from-purple-100 via-purple-50 to-white shadow-xl" hover={false}>
              <h2 className="mb-4 text-lg font-black text-gray-900">Module Navigation</h2>
              <div className="space-y-2">
                {modules.map((module) => {
                  const Icon = module.icon

                  return (
                    <button
                      key={module.label}
                      className="flex w-full items-center gap-3 rounded-xl border-2 border-purple-200 bg-white px-4 py-3 text-left text-sm font-bold text-gray-700 shadow-sm transition hover:bg-purple-50"
                    >
                      <Icon className="h-4 w-4 text-purple-600" />
                      {module.label}
                    </button>
                  )
                })}
              </div>
            </MotionCard>

            <MotionCard className="border-2 border-orange-300 bg-gradient-to-br from-orange-100 via-orange-50 to-white shadow-xl" hover={false}>
              <div className="flex items-start gap-3">
                <TrafficCone className="mt-1 h-6 w-6 text-orange-600" />
                <div>
                  <h3 className="font-black text-gray-900">Optimization Tip</h3>
                  <p className="mt-1 text-sm font-semibold text-gray-700">
                    Re-route long-haul vehicles every 30 minutes during peak traffic to reduce idle time and fuel cost.
                  </p>
                </div>
              </div>
            </MotionCard>
            </div>
        </div>
      </div>
    </PageTransition>
  )
}

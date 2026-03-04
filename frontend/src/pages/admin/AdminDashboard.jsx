import { ArrowUpRight, Award, BrainCircuit, ChartNoAxesCombined, Route, Sparkles, TrafficCone, TrendingUp, Users, DollarSign, Car, AlertTriangle, Navigation } from 'lucide-react'
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Link } from 'react-router-dom'
import { MotionCard } from '../../ui/MotionCard'
import { PageTransition } from '../../ui/PageTransition'
import { RippleButton } from '../../ui/RippleButton'

const overviewCards = [
  { title: 'Total Vehicles', value: '286', change: '+4.1%', icon: Car, gradient: 'from-emerald-500/20 to-teal-500/10' },
  { title: 'Active Drivers', value: '173', change: '+2.4%', icon: Users, gradient: 'from-indigo-500/20 to-emerald-500/10' },
  { title: "Today's Bookings", value: '842', change: '+6.7%', icon: Navigation, gradient: 'from-teal-500/20 to-zinc-500/10' },
  { title: 'Total Revenue', value: '$184.2K', change: '+5.1%', icon: DollarSign, gradient: 'from-emerald-400/20 to-indigo-500/10' },
  { title: 'Maintenance Alerts', value: '17', change: '-1.2%', icon: AlertTriangle, gradient: 'from-zinc-500/20 to-emerald-500/10' },
  { title: 'Vehicles On Road', value: '214', change: '+3.8%', icon: TrendingUp, gradient: 'from-emerald-500/20 to-teal-500/10' },
]

const featureCards = [
  {
    title: 'Fleet Analytics',
    description: 'Monitor utilization and vehicle performance metrics.',
    to: '/admin/fleet-analytics',
    icon: ChartNoAxesCombined,
    className: 'bg-emerald-50',
  },
  {
    title: 'Traffic Analytics',
    description: 'Track congestion hotspots and movement patterns.',
    to: '/admin/traffic-analytics',
    icon: TrafficCone,
    className: 'bg-sky-50',
  },
  {
    title: 'Route Reports',
    description: 'Review route health and route execution summaries.',
    to: '/admin/route-reports',
    icon: Route,
    className: 'bg-violet-50',
  },
  {
    title: 'AI Settings',
    description: 'Adjust thresholds and intelligence configuration.',
    to: '/admin/ai-settings',
    icon: BrainCircuit,
    className: 'bg-amber-50',
  },
]

const trendData = [
  { day: 'Mon', revenue: 22000, trips: 108 },
  { day: 'Tue', revenue: 26000, trips: 124 },
  { day: 'Wed', revenue: 23500, trips: 118 },
  { day: 'Thu', revenue: 27500, trips: 132 },
  { day: 'Fri', revenue: 30200, trips: 146 },
  { day: 'Sat', revenue: 28900, trips: 139 },
  { day: 'Sun', revenue: 31800, trips: 154 },
]

const fleetStatusData = [
  { name: 'On Road', value: 214 },
  { name: 'Idle', value: 46 },
  { name: 'Maintenance', value: 26 },
]

const fleetStatusColors = ['#10b981', '#0ea5e9', '#f59e0b']

const quickActions = [
  { label: 'Add Vehicle', to: '/admin/fleet-analytics' },
  { label: 'Create Report', to: '/admin/route-reports' },
  { label: 'Review Traffic', to: '/admin/traffic-analytics' },
  { label: 'Manage Users', to: '/admin/users' },
  { label: 'AI Configuration', to: '/admin/ai-settings' },
]

function AdminDashboard() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <MotionCard className="relative overflow-hidden border-2 border-emerald-300 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 shadow-2xl" hover={false}>
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="h-10 w-10 text-gray-900" />
              <div>
                <h1 className="text-4xl font-black text-gray-900">Admin Dashboard</h1>
                <p className="mt-1 text-sm font-bold text-gray-900">Overview of platform health, users, and operations.</p>
              </div>
            </div>
            <Sparkles className="h-14 w-14 animate-pulse text-gray-900" />
          </div>
        </MotionCard>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {overviewCards.map((card) => {
            const Icon = card.icon
            return (
              <MotionCard key={card.title} className={`bg-gradient-to-br ${card.gradient} border-2 border-emerald-300 shadow-xl`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-600">{card.title}</p>
                    <p className="mt-2 text-3xl font-black tracking-tight text-gray-900">{card.value}</p>
                    <p className="mt-2 text-xs font-bold text-emerald-600">{card.change}</p>
                  </div>
                  <div className="rounded-xl bg-white p-3 shadow-lg">
                    <Icon className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </MotionCard>
            )
          })}
        </div>

        <MotionCard className="border-2 border-blue-300 bg-gradient-to-br from-blue-100 via-blue-50 to-white shadow-xl" hover={false}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-black text-gray-900">Fleet Analytics &amp; Reporting</h2>
            <Link to="/admin/fleet-analytics">
              <RippleButton className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-600 to-blue-700 font-black text-white shadow-lg">
                View Analytics
                <ArrowUpRight className="h-4 w-4" />
              </RippleButton>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((feature) => {
              const Icon = feature.icon

              return (
                <Link key={feature.title} to={feature.to}>
                  <MotionCard className={`${feature.className} border-2 border-white shadow-md`}>
                    <div className="mb-2 inline-flex rounded-lg bg-white p-2 text-slate-700 shadow">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-black text-slate-900">{feature.title}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-600">{feature.description}</p>
                  </MotionCard>
                </Link>
              )
            })}
          </div>
        </MotionCard>

        <div className="grid gap-6 xl:grid-cols-3">
          <MotionCard className="xl:col-span-2 border-2 border-purple-300 bg-gradient-to-br from-purple-100 via-purple-50 to-white shadow-xl" hover={false}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-black text-gray-900">Revenue &amp; Trip Trends</h3>
              <select className="rounded-lg border border-purple-200 bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-700 outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Quarter</option>
              </select>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <XAxis dataKey="day" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </MotionCard>

          <MotionCard className="border-2 border-amber-300 bg-gradient-to-br from-amber-100 via-amber-50 to-white shadow-xl" hover={false}>
            <h3 className="mb-4 text-lg font-black text-gray-900">Fleet Status</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fleetStatusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={104}
                    paddingAngle={4}
                  >
                    {fleetStatusData.map((entry, index) => (
                      <Cell key={entry.name} fill={fleetStatusColors[index % fleetStatusColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </MotionCard>
        </div>

        <MotionCard className="border-2 border-teal-300 bg-gradient-to-br from-teal-100 via-teal-50 to-white shadow-xl" hover={false}>
          <h3 className="mb-3 text-lg font-black text-gray-900">Quick Actions</h3>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {quickActions.map((action) => (
              <Link key={action.label} to={action.to}>
                <RippleButton className="w-full bg-gradient-to-r from-teal-600 to-teal-700 font-black text-white shadow-lg">
                  {action.label}
                </RippleButton>
              </Link>
            ))}
          </div>
        </MotionCard>
      </div>
    </PageTransition>
  )
}

export default AdminDashboard

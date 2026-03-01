import { ArrowUpRight, BrainCircuit, ChartNoAxesCombined, Route, TrafficCone } from 'lucide-react'
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Link } from 'react-router-dom'

const overviewCards = [
  { title: 'Total Vehicles', value: '286', change: '+4.1%' },
  { title: 'Active Drivers', value: '173', change: '+2.4%' },
  { title: "Today's Bookings", value: '842', change: '+6.7%' },
  { title: 'Total Revenue', value: '$184.2K', change: '+5.1%' },
  { title: 'Maintenance Alerts', value: '17', change: '-1.2%' },
  { title: 'Vehicles On Road', value: '214', change: '+3.8%' },
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
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Overview of platform health, users, and operations.</p>
      </section>

      <section className="grid grid-cols-3 gap-4 lg:grid-cols-6">
        {overviewCards.map((card) => (
          <article
            key={card.title}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:scale-105"
          >
            <p className="text-xs font-medium text-slate-500">{card.title}</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{card.value}</p>
            <p className="mt-2 text-xs font-semibold text-emerald-600">{card.change}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Fleet Analytics &amp; Reporting</h2>
          <Link
            to="/admin/fleet-analytics"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            View Analytics
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {featureCards.map((feature) => {
            const Icon = feature.icon

            return (
              <Link
                key={feature.title}
                to={feature.to}
                className={`rounded-xl border border-slate-200 p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${feature.className}`}
              >
                <div className="mb-2 inline-flex rounded-lg bg-white p-2 text-slate-700">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-slate-900">{feature.title}</p>
                <p className="mt-1 text-xs text-slate-600">{feature.description}</p>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Revenue &amp; Trip Trends</h3>
            <select className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 outline-none">
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
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Fleet Status</h3>
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
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-lg font-semibold text-slate-900">Quick Actions</h3>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.to}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AdminDashboard

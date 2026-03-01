import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const summaryByFilter = {
  week: {
    routesOptimized: 42,
    timeSaved: 1240,
    fuelSaved: 860,
    costSaved: 189000,
  },
  month: {
    routesOptimized: 168,
    timeSaved: 5120,
    fuelSaved: 3440,
    costSaved: 756000,
  },
  year: {
    routesOptimized: 1975,
    timeSaved: 61400,
    fuelSaved: 40820,
    costSaved: 8920000,
  },
}

const weeklyPerformance = [
  { day: 'Mon', fuelSaved: 110, timeSaved: 155 },
  { day: 'Tue', fuelSaved: 126, timeSaved: 172 },
  { day: 'Wed', fuelSaved: 118, timeSaved: 166 },
  { day: 'Thu', fuelSaved: 132, timeSaved: 181 },
  { day: 'Fri', fuelSaved: 142, timeSaved: 194 },
  { day: 'Sat', fuelSaved: 120, timeSaved: 168 },
  { day: 'Sun', fuelSaved: 112, timeSaved: 160 },
]

const optimizationDistribution = [
  { name: 'Fastest', value: 46 },
  { name: 'Energy Efficient', value: 34 },
  { name: 'Low Traffic', value: 20 },
]

const optimizationColors = ['#10b981', '#0ea5e9', '#f59e0b']

const recentRoutes = [
  {
    date: '2026-03-01',
    route: 'Koramangala → Whitefield',
    distance: '26 km',
    time: '52 min',
    fuelSaved: '9 L',
    costSaved: '₹1,950',
    type: 'Fastest',
  },
  {
    date: '2026-02-28',
    route: 'HSR Layout → Airport',
    distance: '38 km',
    time: '71 min',
    fuelSaved: '13 L',
    costSaved: '₹2,760',
    type: 'Low Traffic',
  },
  {
    date: '2026-02-28',
    route: 'Electronic City → MG Road',
    distance: '22 km',
    time: '46 min',
    fuelSaved: '8 L',
    costSaved: '₹1,620',
    type: 'Energy Efficient',
  },
  {
    date: '2026-02-27',
    route: 'Yelahanka → Hebbal',
    distance: '15 km',
    time: '29 min',
    fuelSaved: '5 L',
    costSaved: '₹980',
    type: 'Fastest',
  },
  {
    date: '2026-02-26',
    route: 'Banashankari → Marathahalli',
    distance: '31 km',
    time: '63 min',
    fuelSaved: '10 L',
    costSaved: '₹2,120',
    type: 'Energy Efficient',
  },
]

const badgeClassByType = {
  Fastest: 'bg-emerald-50 text-emerald-700',
  'Energy Efficient': 'bg-sky-50 text-sky-700',
  'Low Traffic': 'bg-amber-50 text-amber-700',
}

function RouteReports() {
  const [filter, setFilter] = useState('week')

  const summary = useMemo(() => summaryByFilter[filter], [filter])

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">History &amp; Reports</h1>
          <p className="mt-1 text-sm text-slate-600">Historical route performance and optimization outcomes</p>
        </div>
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
        >
          <option value="week">This Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Routes Optimized</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.routesOptimized}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Time Saved (min)</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.timeSaved}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Fuel Saved (L)</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.fuelSaved}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Cost Saved (₹)</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.costSaved.toLocaleString('en-IN')}</p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Weekly Performance Chart</h2>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="fuelSaved" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                <Bar dataKey="timeSaved" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Optimization Type Distribution</h2>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={optimizationDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={64}
                  outerRadius={106}
                >
                  {optimizationDistribution.map((entry, index) => (
                    <Cell key={entry.name} fill={optimizationColors[index % optimizationColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent Routes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Route</th>
                <th className="px-3 py-2">Distance</th>
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Fuel Saved</th>
                <th className="px-3 py-2">Cost Saved</th>
                <th className="px-3 py-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {recentRoutes.map((row) => (
                <tr key={`${row.date}-${row.route}`} className="border-b border-slate-100 transition hover:bg-slate-50">
                  <td className="px-3 py-3 text-slate-700">{row.date}</td>
                  <td className="px-3 py-3 font-medium text-slate-900">{row.route}</td>
                  <td className="px-3 py-3 text-slate-700">{row.distance}</td>
                  <td className="px-3 py-3 text-slate-700">{row.time}</td>
                  <td className="px-3 py-3 text-slate-700">{row.fuelSaved}</td>
                  <td className="px-3 py-3 text-slate-700">{row.costSaved}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClassByType[row.type]}`}>
                      {row.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default RouteReports
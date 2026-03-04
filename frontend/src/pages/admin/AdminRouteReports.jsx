import { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Award, Sparkles } from 'lucide-react'
import { tripApi } from '../../services/apiService'

const optimizationColors = ['#10b981', '#0ea5e9', '#f59e0b']

const badgeClassByType = {
  Fastest: 'bg-emerald-100 text-emerald-700',
  'Energy Efficient': 'bg-sky-100 text-sky-700',
  'Low Traffic': 'bg-amber-100 text-amber-700',
}

function RouteReports() {
  const [filter, setFilter] = useState('week')
  const [trips, setTrips] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const loadTrips = async () => {
      setError('')
      try {
        const tripRows = await tripApi.getAll()
        setTrips(Array.isArray(tripRows) ? tripRows : [])
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load route reports from database')
      }
    }

    loadTrips()
  }, [])

  const filteredTrips = useMemo(() => {
    const now = new Date()
    return trips.filter((trip) => {
      const createdAt = trip.createdAt ? new Date(trip.createdAt) : now
      const diffDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)

      if (filter === 'week') {
        return diffDays <= 7
      }
      if (filter === 'month') {
        return diffDays <= 30
      }
      return diffDays <= 365
    })
  }, [filter, trips])

  const summary = useMemo(() => {
    const routesOptimized = filteredTrips.length
    const timeSaved = Math.round(filteredTrips.reduce((sum, trip) => sum + Number(trip.durationMinutes || 0) * 0.18, 0))
    const fuelSaved = Math.round(filteredTrips.reduce((sum, trip) => sum + Number(trip.distanceKm || 0) * 0.35, 0))
    const costSaved = Math.round(filteredTrips.reduce((sum, trip) => sum + Number(trip.fare || 0) * 0.14, 0))

    return { routesOptimized, timeSaved, fuelSaved, costSaved }
  }, [filteredTrips])

  const weeklyPerformance = useMemo(() => {
    const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const dayMap = new Map(dayOrder.map((day) => [day, { day, fuelSaved: 0, timeSaved: 0 }]))

    filteredTrips.forEach((trip) => {
      const createdAt = trip.createdAt ? new Date(trip.createdAt) : new Date()
      const day = dayOrder[(createdAt.getDay() + 6) % 7]
      const row = dayMap.get(day)
      if (row) {
        row.fuelSaved += Number(trip.distanceKm || 0) * 0.35
        row.timeSaved += Number(trip.durationMinutes || 0) * 0.18
      }
    })

    return dayOrder.map((day) => {
      const row = dayMap.get(day)
      return {
        day,
        fuelSaved: Math.round(row?.fuelSaved || 0),
        timeSaved: Math.round(row?.timeSaved || 0),
      }
    })
  }, [filteredTrips])

  const optimizationDistribution = useMemo(() => {
    const distribution = {
      Fastest: 0,
      'Energy Efficient': 0,
      'Low Traffic': 0,
    }

    filteredTrips.forEach((trip) => {
      const distance = Number(trip.distanceKm || 0)
      const duration = Number(trip.durationMinutes || 0)
      if (duration > 60) {
        distribution['Low Traffic'] += 1
      } else if (distance > 20) {
        distribution['Energy Efficient'] += 1
      } else {
        distribution.Fastest += 1
      }
    })

    return [
      { name: 'Fastest', value: distribution.Fastest },
      { name: 'Energy Efficient', value: distribution['Energy Efficient'] },
      { name: 'Low Traffic', value: distribution['Low Traffic'] },
    ]
  }, [filteredTrips])

  const recentRoutes = useMemo(() => {
    return [...filteredTrips]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 8)
      .map((trip) => {
        const distance = Number(trip.distanceKm || 0)
        const duration = Number(trip.durationMinutes || 0)
        const type = duration > 60 ? 'Low Traffic' : distance > 20 ? 'Energy Efficient' : 'Fastest'

        return {
          date: trip.createdAt ? new Date(trip.createdAt).toISOString().slice(0, 10) : 'N/A',
          route: `${trip.pickupLocation || 'Origin'} → ${trip.dropoffLocation || 'Destination'}`,
          distance: `${distance.toFixed(1)} km`,
          time: `${duration} min`,
          fuelSaved: `${Math.round(distance * 0.35)} L`,
          costSaved: `₹${Math.round(Number(trip.fare || 0) * 0.14).toLocaleString('en-IN')}`,
          type,
        }
      })
  }, [filteredTrips])

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border-2 border-emerald-300 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 p-6 shadow-2xl">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Award className="h-9 w-9 text-gray-900" />
            <div>
              <h1 className="text-3xl font-black text-gray-900">History &amp; Reports</h1>
              <p className="mt-1 text-sm font-bold text-gray-900">Historical route performance and optimization outcomes</p>
            </div>
          </div>
          <Sparkles className="h-11 w-11 animate-pulse text-gray-900" />
        </div>
        <div className="relative mt-4">
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none"
          >
            <option value="week">This Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-100 via-emerald-50 to-white p-4 shadow-lg">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Routes Optimized</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{summary.routesOptimized}</p>
        </article>
        <article className="rounded-xl border-2 border-sky-300 bg-gradient-to-br from-sky-100 via-sky-50 to-white p-4 shadow-lg">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Time Saved (min)</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{summary.timeSaved}</p>
        </article>
        <article className="rounded-xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-100 via-indigo-50 to-white p-4 shadow-lg">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Fuel Saved (L)</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{summary.fuelSaved}</p>
        </article>
        <article className="rounded-xl border-2 border-amber-300 bg-gradient-to-br from-amber-100 via-amber-50 to-white p-4 shadow-lg">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Cost Saved (₹)</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{summary.costSaved.toLocaleString('en-IN')}</p>
        </article>
      </section>

      {error && (
        <section className="rounded-xl border-2 border-red-300 bg-red-50 p-4 text-sm font-bold text-red-700">
          {error}
        </section>
      )}

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border-2 border-purple-300 bg-gradient-to-br from-purple-100 via-purple-50 to-white p-5 shadow-xl xl:col-span-2">
          <h2 className="mb-4 text-lg font-black text-slate-900">Weekly Performance Chart</h2>
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

        <article className="rounded-2xl border-2 border-rose-300 bg-gradient-to-br from-rose-100 via-rose-50 to-white p-5 shadow-xl">
          <h2 className="mb-4 text-lg font-black text-slate-900">Optimization Type Distribution</h2>
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

      <section className="rounded-2xl border-2 border-teal-300 bg-gradient-to-br from-teal-100 via-teal-50 to-white p-5 shadow-xl">
        <h2 className="mb-4 text-lg font-black text-slate-900">Recent Routes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-teal-200 text-xs uppercase tracking-wide text-slate-600">
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
                <tr key={`${row.date}-${row.route}`} className="border-b border-teal-100 transition hover:bg-white/80">
                  <td className="px-3 py-3 font-medium text-slate-700">{row.date}</td>
                  <td className="px-3 py-3 font-bold text-slate-900">{row.route}</td>
                  <td className="px-3 py-3 font-medium text-slate-700">{row.distance}</td>
                  <td className="px-3 py-3 font-medium text-slate-700">{row.time}</td>
                  <td className="px-3 py-3 font-medium text-slate-700">{row.fuelSaved}</td>
                  <td className="px-3 py-3 font-medium text-slate-700">{row.costSaved}</td>
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
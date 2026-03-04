import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Award, Sparkles } from 'lucide-react'
import HeatmapLayer from '../../components/maps/HeatmapLayer'
import { trafficApi, tripApi } from '../../services/apiService'

const aiRecommendations = [
  'Suggested reroute: Shift downtown traffic via East Bypass from 08:30 to 10:00.',
  'Optimal travel time: Inter-city dispatch between 11:00 and 14:00 for 18% lower delays.',
  'Risk zones: Elevated congestion probability in City Core and Junction-7 during evening peak.',
]

function TrafficAnalytics() {
  const [trips, setTrips] = useState([])
  const [heatmapRows, setHeatmapRows] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setError('')
      try {
        const [tripData, trafficData] = await Promise.all([tripApi.getAll(), trafficApi.getHeatmap()])
        setTrips(Array.isArray(tripData) ? tripData : [])
        setHeatmapRows(Array.isArray(trafficData) ? trafficData : [])
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load traffic analytics from database')
      }
    }

    load()
  }, [])

  const heatPoints = useMemo(
    () =>
      heatmapRows.map((zone) => [
        Number(zone.latitude),
        Number(zone.longitude),
        Math.max(0.1, Math.min(1, Number(zone.congestionLevel || 0) / 100)),
      ]),
    [heatmapRows],
  )

  const hourlyDensity = useMemo(() => {
    const buckets = Array.from({ length: 9 }, (_, index) => ({
      hour: String(6 + index * 2).padStart(2, '0'),
      density: 0,
    }))

    trips.forEach((trip) => {
      const created = trip.createdAt ? new Date(trip.createdAt) : new Date()
      const index = Math.min(8, Math.max(0, Math.floor((created.getHours() - 6) / 2)))
      if (buckets[index]) {
        buckets[index].density += 1
      }
    })

    return buckets.map((bucket) => ({ ...bucket, density: bucket.density * 8 + 18 }))
  }, [trips])

  const trafficKpis = useMemo(() => {
    const peakHour = hourlyDensity.reduce((best, row) => (row.density > best.density ? row : best), {
      hour: '00',
      density: 0,
    })

    const congestionIndex = heatmapRows.length
      ? Math.round(
          heatmapRows.reduce((sum, row) => sum + Number(row.congestionLevel || 0), 0) / heatmapRows.length,
        )
      : 0

    const avgDelay = trips.length
      ? Math.round(trips.reduce((sum, trip) => sum + Number(trip.durationMinutes || 0), 0) / trips.length / 6)
      : 0

    const highZones = heatmapRows.filter((row) => Number(row.congestionLevel || 0) >= 70).length

    return [
      { title: 'Peak Hours', value: `${peakHour.hour}:00 - ${String(Number(peakHour.hour) + 2).padStart(2, '0')}:00` },
      { title: 'Congestion Index', value: `${congestionIndex} / 100` },
      { title: 'Avg Delay Time', value: `${avgDelay} mins` },
      { title: 'High Traffic Zones', value: String(highZones) },
    ]
  }, [heatmapRows, hourlyDensity, trips])

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border-2 border-rose-300 bg-gradient-to-r from-rose-500 via-orange-500 to-rose-600 p-6 shadow-2xl">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="h-9 w-9 text-gray-900" />
            <div>
              <h1 className="text-3xl font-black text-gray-900">Traffic Analytics</h1>
              <p className="mt-1 text-sm font-bold text-gray-900">System-wide traffic insights</p>
            </div>
          </div>
          <Sparkles className="h-11 w-11 animate-pulse text-gray-900" />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {trafficKpis.map((kpi) => (
          <article
            key={kpi.title}
            className="rounded-xl border-2 border-rose-300 bg-gradient-to-br from-rose-100 via-rose-50 to-white p-4 shadow-lg transition duration-200 hover:scale-105"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-gray-600">{kpi.title}</p>
            <p className="mt-2 text-2xl font-black text-slate-900">{kpi.value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border-2 border-sky-300 bg-gradient-to-br from-sky-100 via-sky-50 to-white p-5 shadow-xl">
        <h2 className="text-lg font-black text-slate-900">Traffic Heatmap</h2>
        {error && <p className="mt-2 text-sm font-bold text-red-700">{error}</p>}
        <div className="mt-4 overflow-hidden rounded-2xl border border-sky-200 bg-white">
          <MapContainer center={[23.2599, 77.4126]} zoom={12} className="h-[500px] w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <HeatmapLayer points={heatPoints} />
          </MapContainer>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <div className="inline-flex items-center gap-2 font-semibold text-slate-700">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            Smooth
          </div>
          <div className="inline-flex items-center gap-2 font-semibold text-slate-700">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            Moderate
          </div>
          <div className="inline-flex items-center gap-2 font-semibold text-slate-700">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            Congested
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-100 via-indigo-50 to-white p-5 shadow-xl xl:col-span-2">
          <h2 className="mb-4 text-lg font-black text-slate-900">Hourly Traffic Bar Chart</h2>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyDensity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hour" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="density" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-100 via-emerald-50 to-white p-5 shadow-xl">
          <h2 className="text-lg font-black text-slate-900">AI Recommendations</h2>
          <ul className="mt-4 space-y-3">
            {aiRecommendations.map((recommendation) => (
              <li
                key={recommendation}
                className="rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700"
              >
                {recommendation}
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  )
}

export default TrafficAnalytics
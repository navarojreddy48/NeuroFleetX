import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Award, Sparkles } from 'lucide-react'
import HeatmapLayer from '../../components/maps/HeatmapLayer'
import { trafficApi, tripApi, vehicleApi } from '../../services/apiService'

function FleetAnalytics() {
  const [range, setRange] = useState('7')
  const [vehicles, setVehicles] = useState([])
  const [trips, setTrips] = useState([])
  const [heatPoints, setHeatPoints] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setError('')
      try {
        const [vehicleData, tripData, heatmapData] = await Promise.all([
          vehicleApi.getAll(),
          tripApi.getAll(),
          trafficApi.getHeatmap(),
        ])

        setVehicles(Array.isArray(vehicleData) ? vehicleData : [])
        setTrips(Array.isArray(tripData) ? tripData : [])

        const mappedHeat = (Array.isArray(heatmapData) ? heatmapData : []).map((point) => [
          Number(point.latitude),
          Number(point.longitude),
          Math.max(0.1, Math.min(1, Number(point.congestionLevel || 0) / 100)),
        ])
        setHeatPoints(mappedHeat)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load fleet analytics from database')
      }
    }

    load()
  }, [])

  const fleetKpis = useMemo(() => {
    const totalFleet = vehicles.length
    const activeVehicles = vehicles.filter((vehicle) => String(vehicle.status) === 'ACTIVE').length
    const inactiveVehicles = Math.max(0, totalFleet - activeVehicles)
    const evVehicles = vehicles.filter((vehicle) => String(vehicle.vehicleType).toUpperCase() === 'EV').length
    const evUtilization = totalFleet ? Math.round((evVehicles / totalFleet) * 100) : 0

    const avgHealth = vehicles.length
      ? Math.round(
          vehicles.reduce((sum, vehicle) => sum + Number(vehicle.batteryHealth || 0), 0) /
            vehicles.length,
        )
      : 0

    return [
      { title: 'Total Fleet', value: String(totalFleet) },
      { title: 'Active Vehicles', value: String(activeVehicles) },
      { title: 'Inactive Vehicles', value: String(inactiveVehicles) },
      { title: 'EV Utilization %', value: `${evUtilization}%` },
      { title: 'Avg Vehicle Health %', value: `${avgHealth}%` },
    ]
  }, [vehicles])

  const trendData = useMemo(() => {
    if (range === '30') {
      const weekBuckets = [0, 0, 0, 0]
      trips.forEach((trip) => {
        const createdAt = trip.createdAt ? new Date(trip.createdAt) : new Date()
        const day = createdAt.getDate()
        const weekIndex = Math.min(3, Math.floor((day - 1) / 7))
        weekBuckets[weekIndex] += 1
      })

      return weekBuckets.map((value, index) => ({ day: `W${index + 1}`, utilization: value * 8 + 40 }))
    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const counts = new Map(dayNames.map((day) => [day, 0]))
    trips.forEach((trip) => {
      const createdAt = trip.createdAt ? new Date(trip.createdAt) : new Date()
      const key = dayNames[createdAt.getDay()]
      counts.set(key, (counts.get(key) || 0) + 1)
    })

    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
      day,
      utilization: (counts.get(day) || 0) * 10 + 30,
    }))
  }, [range, trips])

  const healthMetrics = useMemo(() => {
    const vehiclesCount = Math.max(1, vehicles.length)
    const engineHealth = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          100 - vehicles.reduce((sum, vehicle) => sum + Number(vehicle.engineTemperature || 0), 0) / vehiclesCount / 1.5,
        ),
      ),
    )
    const tireHealth = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          100 - vehicles.reduce((sum, vehicle) => sum + Number(vehicle.tireWear || 0), 0) / vehiclesCount,
        ),
      ),
    )
    const batteryHealth = Math.max(
      0,
      Math.min(
        100,
        Math.round(vehicles.reduce((sum, vehicle) => sum + Number(vehicle.batteryHealth || 0), 0) / vehiclesCount),
      ),
    )

    return [
      { label: 'Engine Health', value: engineHealth },
      { label: 'Tire Wear', value: tireHealth },
      { label: 'Battery Health', value: batteryHealth },
    ]
  }, [vehicles])

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border-2 border-blue-300 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 p-6 shadow-2xl">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="h-9 w-9 text-gray-900" />
            <div>
              <h1 className="text-3xl font-black text-gray-900">Fleet Analytics</h1>
              <p className="mt-1 text-sm font-bold text-gray-900">Real-time fleet performance insights</p>
            </div>
          </div>
          <Sparkles className="h-11 w-11 animate-pulse text-gray-900" />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {fleetKpis.map((card) => (
          <article
            key={card.title}
            className="rounded-xl border-2 border-blue-300 bg-gradient-to-br from-blue-100 via-blue-50 to-white p-4 shadow-lg transition duration-200 hover:scale-105"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-gray-600">{card.title}</p>
            <p className="mt-2 text-2xl font-black text-gray-900">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-100 via-emerald-50 to-white p-5 shadow-xl">
        <h2 className="text-lg font-black text-gray-900">Fleet Heatmap</h2>
        {error && <p className="mt-2 text-sm font-bold text-red-700">{error}</p>}
        <div className="mt-4 overflow-hidden rounded-2xl border border-emerald-200 bg-white">
          <MapContainer
            center={[23.2599, 77.4126]}
            zoom={13}
            scrollWheelZoom
            className="h-[500px] w-full rounded-xl"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <HeatmapLayer points={heatPoints} />
          </MapContainer>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <div className="inline-flex items-center gap-2 font-semibold text-slate-700">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            Low
          </div>
          <div className="inline-flex items-center gap-2 font-semibold text-slate-700">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            Medium
          </div>
          <div className="inline-flex items-center gap-2 font-semibold text-slate-700">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            High
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border-2 border-purple-300 bg-gradient-to-br from-purple-100 via-purple-50 to-white p-5 shadow-xl xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-black text-gray-900">Utilization Trends</h2>
            <select
              value={range}
              onChange={(event) => setRange(event.target.value)}
              className="rounded-lg border border-purple-200 bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-700 outline-none"
            >
              <option value="7">7 days</option>
              <option value="30">30 days</option>
            </select>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line type="monotone" dataKey="utilization" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-100 via-amber-50 to-white p-5 shadow-xl">
          <h2 className="text-lg font-black text-gray-900">Vehicle Health Overview</h2>
          <div className="mt-4 space-y-4">
            {healthMetrics.map((metric) => (
              <div key={metric.label}>
                <div className="mb-1 flex items-center justify-between text-sm text-slate-700">
                  <span className="font-semibold">{metric.label}</span>
                  <span className="font-black">{metric.value}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-white">
                  <div
                    className="h-2.5 rounded-full bg-emerald-500"
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}

export default FleetAnalytics

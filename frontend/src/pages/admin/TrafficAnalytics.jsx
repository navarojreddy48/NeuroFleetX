import { MapContainer, TileLayer } from 'react-leaflet'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import HeatmapLayer from '../../components/maps/HeatmapLayer'

const trafficKpis = [
  { title: 'Peak Hours', value: '08:00 - 10:00' },
  { title: 'Congestion Index', value: '74 / 100' },
  { title: 'Avg Delay Time', value: '18 mins' },
  { title: 'High Traffic Zones', value: '12' },
]

const hourlyDensity = [
  { hour: '06', density: 28 },
  { hour: '08', density: 64 },
  { hour: '10', density: 71 },
  { hour: '12', density: 52 },
  { hour: '14', density: 58 },
  { hour: '16', density: 67 },
  { hour: '18', density: 76 },
  { hour: '20', density: 49 },
  { hour: '22', density: 31 },
]

const trafficZones = [
  { id: 1, name: 'City Core', level: 'Congested', center: [23.28, 77.45], intensity: 1.0 },
  { id: 2, name: 'Central Junction', level: 'Moderate', center: [23.26, 77.43], intensity: 0.7 },
  { id: 3, name: 'Outer Ring', level: 'Smooth', center: [23.25, 77.4], intensity: 0.4 },
  { id: 4, name: 'Transit Hub', level: 'Moderate', center: [23.262, 77.42], intensity: 0.6 },
  { id: 5, name: 'BRT Corridor', level: 'Congested', center: [23.27, 77.43], intensity: 0.9 },
]

const heatPoints = trafficZones.map((zone) => [...zone.center, zone.intensity])

const aiRecommendations = [
  'Suggested reroute: Shift downtown traffic via East Bypass from 08:30 to 10:00.',
  'Optimal travel time: Inter-city dispatch between 11:00 and 14:00 for 18% lower delays.',
  'Risk zones: Elevated congestion probability in City Core and Junction-7 during evening peak.',
]

function TrafficAnalytics() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-semibold text-slate-900">Traffic Analytics</h1>
        <p className="mt-1 text-sm text-slate-600">System-wide traffic insights</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {trafficKpis.map((kpi) => (
          <article
            key={kpi.title}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:scale-105"
          >
            <p className="text-xs font-medium text-slate-500">{kpi.title}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{kpi.value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Traffic Heatmap</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
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
          <div className="inline-flex items-center gap-2 text-slate-700">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            Smooth
          </div>
          <div className="inline-flex items-center gap-2 text-slate-700">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            Moderate
          </div>
          <div className="inline-flex items-center gap-2 text-slate-700">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            Congested
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Hourly Traffic Bar Chart</h2>
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

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">AI Recommendations</h2>
          <ul className="mt-4 space-y-3">
            {aiRecommendations.map((recommendation) => (
              <li
                key={recommendation}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700"
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
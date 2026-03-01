import { useMemo, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import HeatmapLayer from '../../components/maps/HeatmapLayer'

const kpiCards = [
  { title: 'Total Fleet', value: '286' },
  { title: 'Active Vehicles', value: '214' },
  { title: 'Inactive Vehicles', value: '72' },
  { title: 'EV Utilization %', value: '68%' },
  { title: 'Avg Vehicle Health %', value: '89%' },
]

const sevenDayTrend = [
  { day: 'Mon', utilization: 62 },
  { day: 'Tue', utilization: 66 },
  { day: 'Wed', utilization: 64 },
  { day: 'Thu', utilization: 70 },
  { day: 'Fri', utilization: 73 },
  { day: 'Sat', utilization: 71 },
  { day: 'Sun', utilization: 75 },
]

const thirtyDayTrend = [
  { day: 'W1', utilization: 59 },
  { day: 'W2', utilization: 64 },
  { day: 'W3', utilization: 69 },
  { day: 'W4', utilization: 72 },
]

const healthMetrics = [
  { label: 'Engine Health', value: 92 },
  { label: 'Tire Wear', value: 78 },
  { label: 'Battery Health', value: 88 },
]

const heatPoints = [
  [23.2599, 77.4126, 0.8],
  [23.2650, 77.4200, 1.0],
  [23.2700, 77.4300, 0.9],
  [23.2500, 77.4000, 0.7],
  [23.2400, 77.3900, 0.6],
]

function FleetAnalytics() {
  const [range, setRange] = useState('7')

  const trendData = useMemo(() => (range === '30' ? thirtyDayTrend : sevenDayTrend), [range])

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-semibold text-slate-900">Fleet Analytics</h1>
        <p className="mt-1 text-sm text-slate-600">Real-time fleet performance insights</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpiCards.map((card) => (
          <article
            key={card.title}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:scale-105"
          >
            <p className="text-xs font-medium text-slate-500">{card.title}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Fleet Heatmap</h2>
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
            Low
          </div>
          <div className="inline-flex items-center gap-2 text-slate-700">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            Medium
          </div>
          <div className="inline-flex items-center gap-2 text-slate-700">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            High
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Utilization Trends</h2>
            <select
              value={range}
              onChange={(event) => setRange(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 outline-none"
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

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Vehicle Health Overview</h2>
          <div className="mt-4 space-y-4">
            {healthMetrics.map((metric) => (
              <div key={metric.label}>
                <div className="mb-1 flex items-center justify-between text-sm text-slate-700">
                  <span>{metric.label}</span>
                  <span className="font-semibold">{metric.value}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-200">
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

import { useNavigate } from 'react-router-dom'
import DriverStatCard from '../../components/driver/DriverStatCard'
import { driverDashboardStats, performanceSummary } from '../../data/driverMockData'

function DriverDashboard() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold text-slate-900">Driver Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Monitor your trips, earnings, and performance</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {driverDashboardStats.map((item) => (
          <DriverStatCard key={item.key} label={item.label} value={item.value} tone={item.tone} />
        ))}
      </section>

      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-emerald-900">Performance Summary</h2>
        <p className="mt-2 text-sm leading-relaxed text-emerald-800">{performanceSummary}</p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Live Tracking</h2>
        <p className="mt-1 text-sm text-slate-600">Track your trips in real-time</p>
        <button
          type="button"
          onClick={() => navigate('/driver/live-tracking')}
          className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Open Live Tracking
        </button>
      </section>
    </div>
  )
}

export default DriverDashboard

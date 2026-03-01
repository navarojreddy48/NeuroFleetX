import { useMemo } from 'react'
import { useCustomer } from '../../context/CustomerContext'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../ui/cn'

const parseDistance = (value) => {
  const parsed = Number.parseFloat(String(value || '').replace(/[^\d.]/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

function MyTrips() {
  const { bookings } = useCustomer()
  const { theme } = useTheme()

  const historicalTrips = useMemo(() => bookings.filter((booking) => booking.status !== 'Upcoming'), [bookings])

  const totals = useMemo(() => {
    const totalDistance = historicalTrips.reduce((sum, booking) => sum + parseDistance(booking.route.distance), 0)
    const totalSpent = historicalTrips
      .filter((booking) => booking.status === 'Completed')
      .reduce((sum, booking) => sum + (booking.pricing?.totalPrice || 0), 0)
    const carbonSaved = historicalTrips
      .filter((booking) => booking.vehicle.type === 'EV' && booking.status === 'Completed')
      .reduce((sum, booking) => sum + parseDistance(booking.route.distance) * 0.14, 0)

    return {
      totalDistance: Math.round(totalDistance),
      totalSpent,
      carbonSaved: carbonSaved.toFixed(1),
    }
  }, [historicalTrips])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">My Trips</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className={cn('rounded-2xl border p-4', theme === 'light' ? 'border-emerald-200 bg-white' : 'border-white/10 bg-zinc-900/65')}>
          <p className="text-sm text-slate-500">Total Distance Traveled</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600">{totals.totalDistance} km</p>
        </div>
        <div className={cn('rounded-2xl border p-4', theme === 'light' ? 'border-emerald-200 bg-white' : 'border-white/10 bg-zinc-900/65')}>
          <p className="text-sm text-slate-500">Total Money Spent</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600">₹{totals.totalSpent}</p>
        </div>
        <div className={cn('rounded-2xl border p-4', theme === 'light' ? 'border-emerald-200 bg-white' : 'border-white/10 bg-zinc-900/65')}>
          <p className="text-sm text-slate-500">Carbon Saved (EV)</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600">{totals.carbonSaved} kg</p>
        </div>
      </div>

      <div className="relative space-y-4 pl-6 before:absolute before:left-2 before:top-0 before:h-full before:w-[2px] before:bg-emerald-200">
        {historicalTrips.map((trip) => (
          <div
            key={trip.id}
            className={cn('relative rounded-2xl border p-4', theme === 'light' ? 'border-emerald-200 bg-white' : 'border-white/10 bg-zinc-900/65')}
          >
            <span className="absolute -left-[1.56rem] top-6 h-3 w-3 rounded-full bg-emerald-500" />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{trip.route.source} → {trip.route.destination}</p>
              <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', trip.status === 'Completed' ? 'bg-indigo-500/15 text-indigo-600' : 'bg-red-500/15 text-red-600')}>
                {trip.status}
              </span>
            </div>
            <p className={cn('mt-1 text-sm', theme === 'light' ? 'text-slate-500' : 'text-zinc-400')}>
              {trip.date} • {trip.time} • {trip.route.distance} • {trip.vehicle.name}
            </p>
          </div>
        ))}
      </div>

      {historicalTrips.length === 0 && (
        <div className="rounded-xl border border-emerald-200 bg-white p-4 text-sm text-slate-500">No trip history available yet.</div>
      )}
    </div>
  )
}

export default MyTrips

import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useCustomer } from '../../context/CustomerContext'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../ui/cn'

const filters = ['All', 'Upcoming', 'Completed', 'Cancelled']

const statusClasses = {
  Upcoming: 'bg-emerald-500/15 text-emerald-600 border-emerald-400/40',
  Completed: 'bg-indigo-500/15 text-indigo-600 border-indigo-400/40',
  Cancelled: 'bg-red-500/15 text-red-600 border-red-400/40',
}

function MyBookings() {
  const { bookings, cancelBooking } = useCustomer()
  const { theme } = useTheme()
  const [activeFilter, setActiveFilter] = useState('All')
  const [openBookingId, setOpenBookingId] = useState('')

  const filteredBookings = useMemo(() => {
    if (activeFilter === 'All') {
      return bookings
    }
    return bookings.filter((booking) => booking.status === activeFilter)
  }, [activeFilter, bookings])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">My Bookings</h1>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={cn(
                'rounded-xl border px-3 py-1.5 text-sm font-semibold transition',
                activeFilter === filter
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : theme === 'light'
                    ? 'border-emerald-200 bg-white text-emerald-700'
                    : 'border-emerald-300/40 bg-emerald-500/10 text-emerald-200',
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filteredBookings.map((booking) => (
          <motion.div
            key={booking.id}
            whileHover={{ y: -3 }}
            className={cn(
              'rounded-2xl border p-5 shadow-md transition',
              theme === 'light' ? 'border-emerald-200 bg-white' : 'border-white/10 bg-zinc-900/65',
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold">{booking.route.source} → {booking.route.destination}</p>
                <p className={cn('text-sm', theme === 'light' ? 'text-slate-500' : 'text-zinc-400')}>
                  {booking.date} • {booking.time} • {booking.vehicle.name}
                </p>
              </div>
              <span className={cn('rounded-full border px-3 py-1 text-xs font-semibold', statusClasses[booking.status] || statusClasses.Upcoming)}>
                {booking.status}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setOpenBookingId((current) => (current === booking.id ? '' : booking.id))}
                className="rounded-lg border border-emerald-300/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600"
              >
                View Details
              </button>

              <button
                type="button"
                disabled={booking.status !== 'Upcoming'}
                onClick={() => cancelBooking(booking.id)}
                className="rounded-lg border border-red-300/40 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel Booking
              </button>
            </div>

            {openBookingId === booking.id && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-sm">
                <p><span className="text-slate-500">Booking ID:</span> {booking.id}</p>
                <p><span className="text-slate-500">Vehicle:</span> {booking.vehicle.name}</p>
                <p><span className="text-slate-500">Estimated fare:</span> ₹{booking.pricing.totalPrice}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="rounded-xl border border-emerald-200 bg-white p-4 text-sm text-slate-500">No bookings found for this filter.</div>
      )}
    </div>
  )
}

export default MyBookings

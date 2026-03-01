import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCustomer } from '../../context/CustomerContext'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../ui/cn'

const tabs = ['Overview', 'Book Cab']

function CustomerDashboard() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { user, bookings } = useCustomer()
  const [activeTab, setActiveTab] = useState('Overview')

  const stats = useMemo(() => {
    const activeBookings = bookings.filter((booking) => booking.status === 'Upcoming').length
    const totalTrips = bookings.filter((booking) => booking.status === 'Completed').length
    const totalSpent = bookings.reduce((sum, booking) => sum + (booking.pricing?.totalPrice || 0), 0)
    const amountSaved = Math.round(totalSpent * 0.12)
    const upcomingTrips = bookings.filter((booking) => booking.status === 'Upcoming').length

    const routeFrequency = {}
    bookings.forEach((booking) => {
      const key = `${booking.route.source} → ${booking.route.destination}`
      routeFrequency[key] = (routeFrequency[key] || 0) + 1
    })

    const favouriteRoute = Object.entries(routeFrequency).sort((first, second) => second[1] - first[1])[0]?.[0] || 'Not enough trips yet'

    return [
      { label: 'Active Bookings', value: activeBookings },
      { label: 'Total Trips', value: totalTrips },
      { label: 'Total Spent', value: `₹${totalSpent}` },
      { label: 'Amount Saved', value: `₹${amountSaved}` },
      { label: 'Upcoming Trips', value: upcomingTrips },
      { label: 'Favourite Route', value: favouriteRoute },
    ]
  }, [bookings])

  const upcoming = bookings.filter((booking) => booking.status === 'Upcoming').slice(0, 3)

  return (
    <div className="space-y-6">
      <section
        className={cn(
          'rounded-2xl border p-6 shadow-md',
          theme === 'light' ? 'border-emerald-200 bg-emerald-50/50' : 'border-white/10 bg-slate-900/55',
        )}
      >
        <h1 className="text-2xl font-semibold">Hello, {user.name}</h1>
        <p className={cn('mt-1 text-sm', theme === 'light' ? 'text-slate-600' : 'text-zinc-300')}>
          Plan smart routes, book faster, and track your trips in one place.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <motion.article
            key={stat.label}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'rounded-2xl border p-5 shadow-sm',
              theme === 'light' ? 'border-emerald-200 bg-white' : 'border-white/10 bg-zinc-900/65',
            )}
          >
            <p className={cn('text-sm', theme === 'light' ? 'text-slate-500' : 'text-zinc-400')}>{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-600">{stat.value}</p>
          </motion.article>
        ))}
      </section>

      <section className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              'rounded-xl border px-4 py-2 text-sm font-semibold transition',
              activeTab === tab
                ? 'border-emerald-500 bg-emerald-500 text-white'
                : theme === 'light'
                  ? 'border-emerald-200 bg-white text-emerald-700'
                  : 'border-emerald-300/40 bg-emerald-500/10 text-emerald-200',
            )}
          >
            {tab}
          </button>
        ))}
      </section>

      {activeTab === 'Overview' ? (
        <section
          className={cn(
            'rounded-2xl border p-5 shadow-md',
            theme === 'light' ? 'border-emerald-200 bg-white' : 'border-white/10 bg-zinc-900/65',
          )}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Upcoming Trips</h2>
            <button
              type="button"
              onClick={() => navigate('/customer/plan')}
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white"
            >
              Plan & Book
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {upcoming.map((trip) => (
              <motion.div
                key={trip.id}
                whileHover={{ y: -2 }}
                className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4"
              >
                <p className="font-semibold text-slate-800">{trip.route.source} → {trip.route.destination}</p>
                <p className="mt-1 text-sm text-slate-500">{trip.date} • {trip.time}</p>
                <p className="mt-1 text-sm text-slate-600">Vehicle: {trip.vehicle.type}</p>
                <p className="mt-1 text-sm text-slate-600">Price: ₹{trip.pricing.totalPrice}</p>
                <span className="mt-2 inline-flex rounded-full border border-emerald-400/50 bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  {trip.status}
                </span>
              </motion.div>
            ))}
          </div>

          {upcoming.length === 0 && (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-sm text-slate-500">
              No upcoming trips. Plan your next booking now.
            </p>
          )}
        </section>
      ) : (
        <section className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-md">
          <h2 className="text-xl font-semibold">Book Cab</h2>
          <p className="mt-2 text-sm text-slate-600">
            Quickly configure route, choose vehicle, and confirm your trip in one flow.
          </p>
          <button
            type="button"
            onClick={() => navigate('/customer/plan')}
            className="mt-4 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Start Planning
          </button>
        </section>
      )}
    </div>
  )
}

export default CustomerDashboard

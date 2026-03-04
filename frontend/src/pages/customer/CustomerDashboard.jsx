import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, DollarSign, Sparkles, TrendingUp, Route } from 'lucide-react'
import { useCustomer } from '../../context/CustomerContext'
import { MotionCard } from '../../ui/MotionCard'
import { PageTransition } from '../../ui/PageTransition'
import { RippleButton } from '../../ui/RippleButton'
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
      { label: 'Active Bookings', value: activeBookings, icon: Calendar, color: 'from-blue-500/10 to-blue-600/5', iconColor: 'text-blue-600', subtext: 'Today' },
      { label: 'Total Trips', value: totalTrips, icon: MapPin, color: 'from-emerald-500/10 to-emerald-600/5', iconColor: 'text-emerald-600', subtext: 'Completed' },
      { label: 'Total Spent', value: `₹${totalSpent}`, icon: DollarSign, color: 'from-purple-500/10 to-purple-600/5', iconColor: 'text-purple-600', subtext: 'All time' },
      { label: 'Amount Saved', value: `₹${amountSaved}`, icon: Sparkles, color: 'from-orange-500/10 to-orange-600/5', iconColor: 'text-orange-600', subtext: '~12% savings' },
      { label: 'Upcoming Trips', value: upcomingTrips, icon: TrendingUp, color: 'from-teal-500/10 to-teal-600/5', iconColor: 'text-teal-600', subtext: 'Scheduled' },
      { label: 'Favourite Route', value: favouriteRoute, icon: Route, color: 'from-yellow-500/10 to-yellow-600/5', iconColor: 'text-yellow-600', subtext: 'Most traveled' },
    ]
  }, [bookings])

  const upcoming = bookings.filter((booking) => booking.status === 'Upcoming').slice(0, 3)

  return (
    <PageTransition>
      <div className="space-y-6">
        <MotionCard
          hover={false}
          className="border-2 border-emerald-300 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="h-10 w-10 text-gray-900" />
            <div>
              <h1 className="text-3xl font-black text-gray-900">Customer Dashboard</h1>
              <p className="mt-1 text-sm font-bold text-gray-900">
                Monitor your trips, bookings, and savings in real-time
              </p>
            </div>
          </div>
        </MotionCard>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <MotionCard key={stat.label} className={`bg-gradient-to-br ${stat.color}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700">{stat.label}</p>
                    <p className="mt-2 text-3xl font-black text-gray-900">{stat.value}</p>
                    <p className="mt-1 text-xs font-medium text-gray-600">{stat.subtext}</p>
                  </div>
                  <div className={`rounded-2xl bg-white/50 p-3 ${stat.iconColor}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                </div>
              </MotionCard>
            )
          })}
        </div>

        <MotionCard hover={false} className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 p-3">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">Welcome back, {user.name}!</p>
              <p className="text-sm font-semibold text-gray-700">Plan smart routes, book faster, and track your trips seamlessly.</p>
            </div>
          </div>
        </MotionCard>

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <RippleButton
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                activeTab === tab
                  ? 'bg-emerald-600 text-white font-bold shadow-md'
                  : theme === 'light'
                    ? 'bg-emerald-500 text-white font-bold shadow-sm hover:bg-emerald-400'
                    : 'border border-emerald-300/40 bg-emerald-500/10 text-emerald-200',
              )}
            >
              {tab}
            </RippleButton>
          ))}
        </div>

        {activeTab === 'Overview' ? (
          <MotionCard hover={false} className="border-2 border-emerald-200 bg-white">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-emerald-600" />
                <h2 className="text-xl font-black text-gray-900">Upcoming Trips</h2>
              </div>
              <RippleButton 
                onClick={() => navigate('/customer/plan')}
                className="border-2 border-emerald-600 bg-emerald-600 px-6 py-2.5 font-bold text-white shadow-lg hover:bg-emerald-700"
              >
                Plan & Book
              </RippleButton>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {upcoming.map((trip) => (
                <MotionCard
                  key={trip.id}
                  className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-lg font-black text-gray-900">{trip.route.source} → {trip.route.destination}</p>
                      <div className="mt-3 space-y-1">
                        <p className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                          <Calendar className="h-4 w-4 text-emerald-600" />
                          {trip.date} • {trip.time}
                        </p>
                        <p className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          Vehicle: {trip.vehicle.type}
                        </p>
                        <p className="flex items-center gap-2 text-sm font-bold text-gray-900">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          ₹{trip.pricing.totalPrice}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full border-2 border-emerald-600 bg-emerald-500 px-4 py-1.5 text-xs font-bold text-white shadow-sm">
                      {trip.status}
                    </span>
                  </div>
                </MotionCard>
              ))}
            </div>

            {upcoming.length === 0 && (
              <MotionCard className="border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-orange-500 p-3">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-base font-bold text-gray-800">
                    No upcoming trips. Plan your next booking now!
                  </p>
                </div>
              </MotionCard>
            )}
          </MotionCard>
        ) : (
          <MotionCard hover={false} className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 p-3">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Book Cab</h2>
            </div>
            <p className="mb-4 text-base font-semibold text-gray-700">
              Quickly configure route, choose vehicle, and confirm your trip in one flow.
            </p>
            <RippleButton
              onClick={() => navigate('/customer/plan')}
              className="border-2 border-emerald-600 bg-emerald-600 px-8 py-3 font-bold text-white shadow-lg hover:bg-emerald-700"
            >
              Start Planning
            </RippleButton>
          </MotionCard>
        )}
      </div>
    </PageTransition>
  )
}

export default CustomerDashboard
import { motion } from 'framer-motion'
import { Calendar, Eye, XCircle, MapPin, Car, DollarSign } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useCustomer } from '../../context/CustomerContext'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../ui/cn'
import { MotionCard } from '../../ui/MotionCard'
import { RippleButton } from '../../ui/RippleButton'

const filters = ['All', 'Upcoming', 'Completed', 'Cancelled']

const statusClasses = {
  Upcoming: 'bg-emerald-500 text-white border-emerald-600',
  Completed: 'bg-indigo-500 text-white border-indigo-600',
  Cancelled: 'bg-red-500 text-white border-red-600',
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
      <MotionCard className="border-2 border-emerald-300 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 shadow-2xl" hover={false}>
        <div className="flex items-center gap-3">
          <Calendar className="h-10 w-10 text-gray-900" />
          <div>
            <h1 className="text-3xl font-black text-gray-900">My Bookings</h1>
            <p className="mt-1 text-sm font-bold text-gray-900">Manage all your trip bookings in one place</p>
          </div>
        </div>
      </MotionCard>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-black text-gray-900">Filter Bookings</h2>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <RippleButton
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                'border-2 px-4 py-2 text-sm font-bold shadow-md transition',
                activeFilter === filter
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-emerald-400 bg-emerald-200 text-emerald-800 hover:bg-emerald-300',
              )}
            >
              {filter}
            </RippleButton>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filteredBookings.map((booking) => (
          <MotionCard
            key={booking.id}
            className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-white/60 p-3 text-blue-600">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-lg font-black text-gray-900">{booking.route.source} → {booking.route.destination}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Calendar className="h-4 w-4 text-emerald-600" />
                      <span>{booking.date} • {booking.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Car className="h-4 w-4 text-purple-600" />
                      <span>{booking.vehicle.name}</span>
                    </div>
                  </div>
                </div>
              </div>
              <span className={cn('rounded-full border-2 px-3 py-1.5 text-xs font-bold shadow-sm', statusClasses[booking.status] || statusClasses.Upcoming)}>
                {booking.status}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <RippleButton
                onClick={() => setOpenBookingId((current) => (current === booking.id ? '' : booking.id))}
                className="border-2 border-blue-400 bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-600"
              >
                <Eye className="mr-1 inline h-4 w-4" />
                View Details
              </RippleButton>

              <RippleButton
                disabled={booking.status !== 'Upcoming'}
                onClick={() => cancelBooking(booking.id)}
                className="border-2 border-red-400 bg-red-500 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <XCircle className="mr-1 inline h-4 w-4" />
                Cancel Booking
              </RippleButton>
            </div>

            {openBookingId === booking.id && (
              <div className="mt-4 rounded-xl border-2 border-emerald-500 bg-gradient-to-br from-white to-emerald-50 p-4 shadow-lg">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
                    <div className="rounded-full bg-blue-500 p-2">
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600">Booking ID</p>
                      <p className="text-sm font-black text-gray-900">{booking.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
                    <div className="rounded-full bg-purple-500 p-2">
                      <Car className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600">Vehicle</p>
                      <p className="text-sm font-black text-gray-900">{booking.vehicle.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
                    <div className="rounded-full bg-green-500 p-2">
                      <DollarSign className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600">Estimated Fare</p>
                      <p className="text-lg font-black text-green-600">₹{booking.pricing.totalPrice}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </MotionCard>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <MotionCard className="bg-gradient-to-br from-orange-50 to-amber-50" hover={false}>
          <p className="text-center text-base font-semibold text-gray-700">No bookings found for this filter. Try selecting a different filter!</p>
        </MotionCard>
      )}
    </div>
  )
}

export default MyBookings

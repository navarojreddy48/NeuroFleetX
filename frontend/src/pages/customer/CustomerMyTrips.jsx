import { useEffect, useMemo, useState } from 'react'
import { Route, TrendingUp, DollarSign, Leaf } from 'lucide-react'
import { useCustomer } from '../../context/CustomerContext'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../ui/cn'
import { MotionCard } from '../../ui/MotionCard'
import { tripApi } from '../../services/apiService'

const parseDistance = (value) => {
  const parsed = Number.parseFloat(String(value || '').replace(/[^\d.]/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

function MyTrips() {
  const { bookings } = useCustomer()
  const { theme } = useTheme()
  const [dbTrips, setDbTrips] = useState([])

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const rows = await tripApi.getAll()
        setDbTrips(Array.isArray(rows) ? rows : [])
      } catch {
        setDbTrips([])
      }
    }

    loadTrips()
  }, [])

  const historicalTrips = useMemo(() => {
    if (dbTrips.length > 0) {
      return dbTrips.map((trip) => ({
        id: trip.id,
        route: {
          source: trip.pickupLocation || 'Origin',
          destination: trip.dropoffLocation || 'Destination',
          distance: `${Number(trip.distanceKm || 0).toFixed(1)} km`,
        },
        status: String(trip.tripStatus || 'Completed').toLowerCase() === 'completed' ? 'Completed' : 'Cancelled',
        date: trip.createdAt ? new Date(trip.createdAt).toLocaleDateString() : '-',
        time: trip.createdAt ? new Date(trip.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
        vehicle: {
          name: trip.vehicleName || 'Assigned Vehicle',
          type: trip.vehicleType || 'EV',
        },
        pricing: {
          totalPrice: Number(trip.fare || 0),
        },
      }))
    }

    return bookings.filter((booking) => booking.status !== 'Upcoming')
  }, [bookings, dbTrips])

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
      <MotionCard className="border-2 border-emerald-300 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 shadow-2xl" hover={false}>
        <div className="flex items-center gap-3">
          <Route className="h-10 w-10 text-gray-900" />
          <div>
            <h1 className="text-3xl font-black text-gray-900">My Trips</h1>
            <p className="mt-1 text-sm font-bold text-gray-900">Your complete travel history and statistics</p>
          </div>
        </div>
      </MotionCard>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MotionCard className="bg-gradient-to-br from-blue-500/10 to-blue-600/5">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-gray-700">Total Distance Traveled</p>
              <p className="mt-1 text-2xl font-black text-blue-600">{totals.totalDistance} km</p>
            </div>
          </div>
        </MotionCard>
        <MotionCard className="bg-gradient-to-br from-purple-500/10 to-purple-600/5">
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm font-semibold text-gray-700">Total Money Spent</p>
              <p className="mt-1 text-2xl font-black text-purple-600">₹{totals.totalSpent}</p>
            </div>
          </div>
        </MotionCard>
        <MotionCard className="bg-gradient-to-br from-green-500/10 to-green-600/5">
          <div className="flex items-center gap-3">
            <Leaf className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm font-semibold text-gray-700">Carbon Saved (EV)</p>
              <p className="mt-1 text-2xl font-black text-green-600">{totals.carbonSaved} kg</p>
            </div>
          </div>
        </MotionCard>
      </div>

      <div className="relative space-y-4 pl-6 before:absolute before:left-2 before:top-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-emerald-400 before:to-teal-400">
        {historicalTrips.map((trip) => (
          <MotionCard
            key={trip.id}
            className="relative shadow-md"
          >
            <span className="absolute -left-[1.56rem] top-6 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 shadow-lg" />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-lg font-bold text-gray-900">{trip.route.source} → {trip.route.destination}</p>
              <span className={cn('rounded-full border px-3 py-1.5 text-xs font-bold shadow-sm', trip.status === 'Completed' ? 'border-indigo-400 bg-indigo-500 text-white' : 'border-red-400 bg-red-500 text-white')}>
                {trip.status}
              </span>
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-700">
              {trip.date} • {trip.time} • {trip.route.distance} • {trip.vehicle.name}
            </p>
          </MotionCard>
        ))}
      </div>

      {historicalTrips.length === 0 && (
        <MotionCard className="bg-gradient-to-br from-emerald-50 to-teal-50">
          <p className="text-center text-base font-semibold text-gray-700">No trip history available yet. Start booking to see your travel history!</p>
        </MotionCard>
      )}
    </div>
  )
}

export default MyTrips

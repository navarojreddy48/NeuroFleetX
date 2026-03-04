import { useEffect, useMemo, useState } from 'react'
import { CarFront, Calendar, IndianRupee, MapPin, Filter, Search, Download } from 'lucide-react'
import { MotionCard } from '../../ui/MotionCard'
import { PageTransition } from '../../ui/PageTransition'
import { RippleButton } from '../../ui/RippleButton'
import { tripApi } from '../../services/apiService'

function Trips() {
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadTrips = async () => {
      setLoading(true)
      setError('')

      try {
        const data = await tripApi.getAll()
        const mapped = (Array.isArray(data) ? data : []).map((trip) => {
          const createdAt = trip.createdAt ? new Date(trip.createdAt) : new Date()
          const fareValue = Number(trip.fareAmount ?? Math.max(150, (Number(trip.distance) || 0) * 35))

          return {
            id: `TRP-${trip.id}`,
            date: createdAt.toISOString().slice(0, 10),
            time: createdAt.toTimeString().slice(0, 5),
            customer: 'Assigned Customer',
            pickup: trip.startLocation || 'N/A',
            dropoff: trip.endLocation || 'N/A',
            distance: `${Number(trip.distance || 0).toFixed(1)} km`,
            fare: `₹${fareValue.toLocaleString()}`,
            status: String(trip.tripStatus || 'COMPLETED').replace('_', ' '),
            rating: 5,
          }
        })

        setTrips(mapped)
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load trips')
      }

      setLoading(false)
    }

    loadTrips()
  }, [])

  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = 
      trip.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.dropoff.toLowerCase().includes(searchQuery.toLowerCase())

    if (filter === 'all') return matchesSearch
    if (filter === 'today') return trip.date === today && matchesSearch
    if (filter === 'week') {
      const now = new Date()
      const tripDate = new Date(trip.date)
      const diffDays = Math.floor((now.getTime() - tripDate.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays <= 7 && matchesSearch
    }
    if (filter === 'month') {
      const now = new Date()
      const tripDate = new Date(trip.date)
      return now.getMonth() === tripDate.getMonth() && now.getFullYear() === tripDate.getFullYear() && matchesSearch
    }
    return matchesSearch
  })

  const totalTrips = filteredTrips.length
  const totalEarnings = filteredTrips.reduce((sum, trip) => sum + parseFloat(trip.fare.replace('₹', '').replace(',', '')), 0)
  const avgRating = totalTrips ? (filteredTrips.reduce((sum, trip) => sum + trip.rating, 0) / totalTrips).toFixed(1) : '0.0'

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <MotionCard className="border-2 border-emerald-300 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 shadow-2xl" hover={false}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CarFront className="h-10 w-10 text-gray-900" />
              <div>
                <h1 className="text-3xl font-black text-gray-900">Trip History</h1>
                <p className="mt-1 text-sm font-bold text-gray-900">View and manage all your completed trips</p>
              </div>
            </div>
            <RippleButton className="bg-white/20 px-6 py-3 font-black text-white backdrop-blur-sm hover:bg-white/30">
              <Download className="mr-2 inline h-5 w-5" />
              Export Report
            </RippleButton>
          </div>
        </MotionCard>

        {/* Summary Stats */}
        <div className="grid gap-5 sm:grid-cols-3">
          <MotionCard className="border-2 border-blue-300 bg-gradient-to-br from-blue-100 to-white shadow-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-500 p-3">
                <CarFront className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-gray-600">Total Trips</p>
                <p className="text-3xl font-black text-gray-900">{totalTrips}</p>
              </div>
            </div>
          </MotionCard>

          <MotionCard className="border-2 border-emerald-300 bg-gradient-to-br from-emerald-100 to-white shadow-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500 p-3">
                <IndianRupee className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-gray-600">Total Earnings</p>
                <p className="text-3xl font-black text-gray-900">₹{totalEarnings.toLocaleString()}</p>
              </div>
            </div>
          </MotionCard>

          <MotionCard className="border-2 border-yellow-300 bg-gradient-to-br from-yellow-100 to-white shadow-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-yellow-500 p-3">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-gray-600">Avg Rating</p>
                <p className="text-3xl font-black text-gray-900">{avgRating}</p>
              </div>
            </div>
          </MotionCard>
        </div>

        {/* Filters and Search */}
        <MotionCard className="border-2 border-gray-300 bg-white shadow-xl" hover={false}>
          <div className="flex flex-wrap items-center gap-4">
            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <p className="text-sm font-bold text-gray-700">Filter:</p>
              {['all', 'today', 'week', 'month'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-lg px-4 py-2 text-sm font-bold shadow-md transition-all ${
                    filter === f
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="ml-auto flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-gray-50 px-4 py-2">
              <Search className="h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search trips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-transparent font-bold text-gray-900 placeholder-gray-500 outline-none"
              />
            </div>
          </div>
        </MotionCard>

        {/* Trips Table */}
        <MotionCard className="border-2 border-gray-300 bg-white shadow-xl" hover={false}>
          <div className="overflow-x-auto">
            {loading && <p className="px-4 py-4 text-sm font-bold text-blue-700">Loading trips from database...</p>}
            {error && <p className="px-4 py-4 text-sm font-bold text-red-700">{error}</p>}
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-black uppercase text-gray-700">Trip ID</th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase text-gray-700">Date & Time</th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase text-gray-700">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase text-gray-700">Route</th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase text-gray-700">Distance</th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase text-gray-700">Fare</th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase text-gray-700">Rating</th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrips.map((trip) => (
                  <tr key={trip.id} className="border-b border-gray-100 transition-colors hover:bg-emerald-50">
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                        {trip.id}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        {trip.date} {trip.time}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-gray-900">{trip.customer}</td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs font-bold text-green-600">
                          <MapPin className="h-3 w-3" />
                          {trip.pickup}
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-red-600">
                          <MapPin className="h-3 w-3" />
                          {trip.dropoff}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-gray-900">{trip.distance}</td>
                    <td className="px-4 py-4 text-lg font-black text-emerald-600">{trip.fare}</td>
                    <td className="px-4 py-4">
                      <span className="text-lg font-black text-yellow-500">
                        {'⭐'.repeat(trip.rating)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-black text-white shadow-md">
                        {trip.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTrips.length === 0 && (
            <div className="py-12 text-center">
              <CarFront className="mx-auto h-16 w-16 text-gray-400" />
              <p className="mt-4 text-lg font-bold text-gray-600">No trips found</p>
              <p className="text-sm font-bold text-gray-500">Try adjusting your filters or search query</p>
            </div>
          )}
        </MotionCard>
      </div>
    </PageTransition>
  )
}

export default Trips

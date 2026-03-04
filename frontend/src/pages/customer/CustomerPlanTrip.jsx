import { motion } from 'framer-motion'
import { MapPin, Navigation, Calendar, Clock, Car, Route } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import BookingSummary from '../../components/customer/BookingSummary'
import DateTimeSelector from '../../components/customer/DateTimeSelector'
import RouteSelector from '../../components/customer/RouteSelector'
import TripForm from '../../components/customer/TripForm'
import VehicleSelector from '../../components/customer/VehicleSelector'
import { useCustomer } from '../../context/CustomerContext'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../ui/cn'
import { MotionCard } from '../../ui/MotionCard'

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const routeOptions = [
  {
    id: 'fastest',
    label: 'Fastest',
    description: 'Quickest ETA with live traffic balancing',
    distance: '145 km',
    duration: '2h 52m',
    basePrice: 680,
  },
  {
    id: 'fuel-efficient',
    label: 'Fuel Efficient',
    description: 'Optimized for better mileage and lower tolls',
    distance: '152 km',
    duration: '3h 16m',
    basePrice: 610,
  },
  {
    id: 'traffic-avoidance',
    label: 'Traffic Avoidance',
    description: 'Bypasses congestion hotspots in peak zones',
    distance: '164 km',
    duration: '3h 25m',
    basePrice: 640,
  },
]

const vehicles = [
  { id: 'veh-1', name: 'Urban EV Prime', type: 'EV', subtitle: 'Zero-emission premium ride', price: 820 },
  { id: 'veh-2', name: 'Eco EV Compact', type: 'EV', subtitle: 'Affordable city EV option', price: 640 },
  { id: 'veh-3', name: 'City Petrol Comfort', type: 'Petrol', subtitle: 'Balanced comfort for highway trips', price: 580 },
  { id: 'veh-4', name: 'Petrol XL Family', type: 'Petrol', subtitle: 'Spacious cabin for long-distance travel', price: 760 },
]

const timeSlots = ['06:30', '08:30', '12:30', '16:00', '18:30', '20:30']

const locationCoordinates = {
  bengaluru: [12.9716, 77.5946],
  mysuru: [12.2958, 76.6394],
  chennai: [13.0827, 80.2707],
  hyderabad: [17.385, 78.4867],
  pune: [18.5204, 73.8567],
  mumbai: [19.076, 72.8777],
  delhi: [28.6139, 77.209],
}

const toCoordinate = (place) => {
  if (!place) {
    return null
  }

  const key = place.trim().toLowerCase()
  return locationCoordinates[key] || null
}

function PlanTrip() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const {
    selectedTrip,
    selectedRoute,
    selectedVehicle,
    selectedDate,
    selectedTime,
    setPlannerState,
    setSelectedRoute,
    setSelectedVehicle,
    setSelectedDate,
    setSelectedTime,
  } = useCustomer()

  const trip = selectedTrip || { source: '', stops: [], destination: '' }

  const handleTripChange = (field, value, stopIndex) => {
    if (field === 'stop') {
      const nextStops = [...(trip.stops || [])]
      nextStops[stopIndex] = value
      setPlannerState({
        trip: { ...trip, stops: nextStops },
        routeOption: selectedRoute,
        vehicleOption: selectedVehicle,
        date: selectedDate,
        time: selectedTime,
      })
      return
    }

    setPlannerState({
      trip: { ...trip, [field]: value },
      routeOption: selectedRoute,
      vehicleOption: selectedVehicle,
      date: selectedDate,
      time: selectedTime,
    })
  }

  const handleAddStop = () => {
    const nextStops = [...(trip.stops || []), '']
    setPlannerState({
      trip: { ...trip, stops: nextStops },
      routeOption: selectedRoute,
      vehicleOption: selectedVehicle,
      date: selectedDate,
      time: selectedTime,
    })
  }

  const sourceCoordinate = toCoordinate(trip.source)
  const stopCoordinates = (trip.stops || []).map((stop) => toCoordinate(stop)).filter(Boolean)
  const destinationCoordinate = toCoordinate(trip.destination)
  const polylinePath = [sourceCoordinate, ...stopCoordinates, destinationCoordinate].filter(Boolean)

  const canContinue = Boolean(
    trip.source &&
      trip.destination &&
      selectedRoute &&
      selectedVehicle &&
      selectedDate &&
      selectedTime,
  )

  const handleContinue = () => {
    if (!canContinue) {
      return
    }

    navigate('/customer/booking/confirmation')
  }

  return (
    <div className="space-y-6">
      <MotionCard className="border-2 border-emerald-300 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 shadow-2xl" hover={false}>
        <div className="flex items-center gap-3">
          <Navigation className="h-10 w-10 text-gray-900" />
          <div>
            <h1 className="text-3xl font-black text-gray-900">Plan Your Trip</h1>
            <p className="mt-1 text-sm font-bold text-gray-900">Choose your route, vehicle, and travel time</p>
          </div>
        </div>
      </MotionCard>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-6"
        >
          <MotionCard className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-2xl bg-white/60 p-3 text-blue-600">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Trip Details</h2>
                <p className="text-xs font-semibold text-gray-600">Enter your source and destination</p>
              </div>
            </div>
            <TripForm trip={trip} onChange={handleTripChange} onAddStop={handleAddStop} onShowRoute={() => {}} />
          </MotionCard>

          <MotionCard className="bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-2xl bg-white/60 p-3 text-purple-600">
                <Route className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Route Options</h2>
                <p className="text-xs font-semibold text-gray-600">Choose your preferred route</p>
              </div>
            </div>
            <RouteSelector routes={routeOptions} selectedRoute={selectedRoute} onSelect={setSelectedRoute} />
          </MotionCard>

          <MotionCard className="bg-gradient-to-br from-green-50 to-green-100 shadow-lg">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-2xl bg-white/60 p-3 text-green-600">
                <Car className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Vehicle Selection</h2>
                <p className="text-xs font-semibold text-gray-600">Pick your vehicle type</p>
              </div>
            </div>
            <VehicleSelector vehicles={vehicles} selectedVehicle={selectedVehicle} onSelect={setSelectedVehicle} />
          </MotionCard>

          <MotionCard className="bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-2xl bg-white/60 p-3 text-orange-600">
                <Calendar className="h-5 w-5" />
                <Clock className="h-5 w-5 ml-1" />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Schedule Trip</h2>
                <p className="text-xs font-semibold text-gray-600">Select date and time</p>
              </div>
            </div>
            <DateTimeSelector
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDateChange={setSelectedDate}
              onTimeChange={setSelectedTime}
              timeSlots={timeSlots}
            />
          </MotionCard>

          <MotionCard className="bg-gradient-to-br from-teal-50 to-teal-100 shadow-lg" hover={false}>
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-2xl bg-white/60 p-3 text-teal-600">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Route Map</h2>
                <p className="text-xs font-semibold text-gray-600">Visualize your journey</p>
              </div>
            </div>
            <div className="h-[420px] overflow-hidden rounded-2xl border-2 border-teal-300 shadow-lg">
              <MapContainer center={sourceCoordinate || [20.5937, 78.9629]} zoom={sourceCoordinate ? 7 : 5} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {sourceCoordinate && (
                  <Marker position={sourceCoordinate}>
                    <Popup>Source: {trip.source}</Popup>
                  </Marker>
                )}

                {stopCoordinates.map((position, index) => (
                  <Marker key={`marker-stop-${index}`} position={position}>
                    <Popup>Stop {index + 1}</Popup>
                  </Marker>
                ))}

                {destinationCoordinate && (
                  <Marker position={destinationCoordinate}>
                    <Popup>Destination: {trip.destination}</Popup>
                  </Marker>
                )}

                {polylinePath.length >= 2 && <Polyline positions={polylinePath} color="#10b981" />}
              </MapContainer>
            </div>
          </MotionCard>
        </motion.div>

        <BookingSummary
          trip={trip}
          selectedRoute={selectedRoute}
          selectedVehicle={selectedVehicle}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          continueDisabled={!canContinue}
          onContinue={handleContinue}
        />
      </div>
    </div>
  )
}

export default PlanTrip

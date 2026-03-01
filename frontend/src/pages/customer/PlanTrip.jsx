import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import BookingSummary from '../../components/customer/BookingSummary'
import {
  LeafletSuspense,
  LazyMapContainer as MapContainer,
  LazyMarker as Marker,
  LazyPolyline as Polyline,
  LazyPopup as Popup,
  LazyTileLayer as TileLayer,
} from '../../components/leaflet/LazyReactLeaflet'
import DateTimeSelector from '../../components/customer/DateTimeSelector'
import RouteSelector from '../../components/customer/RouteSelector'
import TripForm from '../../components/customer/TripForm'
import VehicleSelector from '../../components/customer/VehicleSelector'
import { useCustomer } from '../../context/CustomerContext'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../ui/cn'

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
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={cn(
          'space-y-6 rounded-2xl border p-6 shadow-lg',
          theme === 'light' ? 'border-emerald-100 bg-emerald-50/45' : 'border-white/10 bg-slate-950/40',
        )}
      >
        <TripForm trip={trip} onChange={handleTripChange} onAddStop={handleAddStop} onShowRoute={() => {}} />

        <RouteSelector routes={routeOptions} selectedRoute={selectedRoute} onSelect={setSelectedRoute} />

        <VehicleSelector vehicles={vehicles} selectedVehicle={selectedVehicle} onSelect={setSelectedVehicle} />

        <DateTimeSelector
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onDateChange={setSelectedDate}
          onTimeChange={setSelectedTime}
          timeSlots={timeSlots}
        />

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Route Map</h2>
          <div className="h-[420px] overflow-hidden rounded-2xl border border-emerald-200">
            <LeafletSuspense>
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
            </LeafletSuspense>
          </div>
        </section>
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
  )
}

export default PlanTrip

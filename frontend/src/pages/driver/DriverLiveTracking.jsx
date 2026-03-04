import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPinned, Navigation, Phone, Clock, IndianRupee, CheckCircle } from 'lucide-react'
import { MotionCard } from '../../ui/MotionCard'
import { PageTransition } from '../../ui/PageTransition'
import { RippleButton } from '../../ui/RippleButton'

// Configure Leaflet default icon
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function LiveTracking() {
  const [currentTrip] = useState({
    id: 'TRP-2024-1054',
    customer: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    pickup: { lat: 12.9716, lng: 77.5946, address: 'MG Road, Bengaluru' },
    dropoff: { lat: 12.9352, lng: 77.6245, address: 'Electronic City, Bengaluru' },
    currentLocation: { lat: 12.9534, lng: 77.6095 },
    fare: '₹580',
    distance: '14.2 km',
    eta: '22 mins',
    status: 'In Progress'
  })

  const route = [
    [currentTrip.pickup.lat, currentTrip.pickup.lng],
    [currentTrip.currentLocation.lat, currentTrip.currentLocation.lng],
    [currentTrip.dropoff.lat, currentTrip.dropoff.lng]
  ]

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <MotionCard className="border-2 border-emerald-300 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 shadow-2xl" hover={false}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPinned className="h-10 w-10 text-gray-900" />
              <div>
                <h1 className="text-3xl font-black text-gray-900">Live Tracking</h1>
                <p className="mt-1 text-sm font-bold text-gray-900">Track your current trip in real-time</p>
              </div>
            </div>
            <div className="rounded-full bg-white/20 px-6 py-3 backdrop-blur-sm">
              <p className="text-xs font-bold text-white">Trip Status</p>
              <p className="text-xl font-black text-yellow-300">{currentTrip.status}</p>
            </div>
          </div>
        </MotionCard>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Trip Details Sidebar */}
          <div className="space-y-4 lg:col-span-1">
            {/* Customer Info */}
            <MotionCard className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-white shadow-xl">
              <div className="flex items-start gap-3 border-b-2 border-blue-200 pb-3">
                <div className="rounded-xl bg-blue-500 p-3">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase text-gray-600">Customer</p>
                  <p className="mt-1 text-lg font-black text-gray-900">{currentTrip.customer}</p>
                  <p className="text-sm font-bold text-gray-600">{currentTrip.phone}</p>
                </div>
              </div>
              <RippleButton className="mt-3 w-full bg-gradient-to-r from-blue-600 to-blue-700 py-3 font-black text-white shadow-lg hover:from-blue-700 hover:to-blue-800">
                📞 Call Customer
              </RippleButton>
            </MotionCard>

            {/* Trip Info */}
            <MotionCard className="border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-white shadow-xl">
              <p className="text-xs font-bold uppercase text-gray-600">Trip Details</p>
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">Trip ID</span>
                  <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-black text-white">{currentTrip.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">Distance</span>
                  <span className="text-sm font-black text-gray-900">{currentTrip.distance}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">Fare</span>
                  <span className="text-lg font-black text-emerald-600">{currentTrip.fare}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">ETA</span>
                  <span className="flex items-center gap-1 text-sm font-black text-orange-600">
                    <Clock className="h-4 w-4" />
                    {currentTrip.eta}
                  </span>
                </div>
              </div>
            </MotionCard>

            {/* Route Info */}
            <MotionCard className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-white shadow-xl">
              <p className="text-xs font-bold uppercase text-gray-600">Route</p>
              <div className="mt-3 space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-green-500 p-2">
                      <Navigation className="h-4 w-4 text-white" />
                    </div>
                    <div className="h-full w-0.5 bg-gradient-to-b from-green-500 to-red-500 py-2" />
                    <div className="rounded-full bg-red-500 p-2">
                      <MapPinned className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-xs font-bold text-green-600">PICKUP</p>
                      <p className="text-sm font-bold text-gray-900">{currentTrip.pickup.address}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-red-600">DROP-OFF</p>
                      <p className="text-sm font-bold text-gray-900">{currentTrip.dropoff.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </MotionCard>

            {/* Complete Trip Button */}
            <RippleButton className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 py-4 font-black text-white shadow-2xl hover:from-emerald-700 hover:to-teal-800">
              <CheckCircle className="mr-2 inline h-5 w-5" />
              Complete Trip
            </RippleButton>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <MotionCard className="h-[700px] overflow-hidden border-2 border-gray-300 p-0 shadow-2xl" hover={false}>
              <MapContainer
                center={[currentTrip.currentLocation.lat, currentTrip.currentLocation.lng]}
                zoom={13}
                className="h-full w-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {/* Pickup Marker */}
                <Marker position={[currentTrip.pickup.lat, currentTrip.pickup.lng]}>
                  <Popup>
                    <div className="text-center">
                      <p className="font-black text-green-600">🚩 PICKUP</p>
                      <p className="text-xs font-bold text-gray-700">{currentTrip.pickup.address}</p>
                    </div>
                  </Popup>
                </Marker>

                {/* Current Location Marker */}
                <Marker position={[currentTrip.currentLocation.lat, currentTrip.currentLocation.lng]}>
                  <Popup>
                    <div className="text-center">
                      <p className="font-black text-blue-600">🚗 YOUR LOCATION</p>
                      <p className="text-xs font-bold text-gray-700">Current Position</p>
                    </div>
                  </Popup>
                </Marker>

                {/* Dropoff Marker */}
                <Marker position={[currentTrip.dropoff.lat, currentTrip.dropoff.lng]}>
                  <Popup>
                    <div className="text-center">
                      <p className="font-black text-red-600">📍 DROP-OFF</p>
                      <p className="text-xs font-bold text-gray-700">{currentTrip.dropoff.address}</p>
                    </div>
                  </Popup>
                </Marker>

                {/* Route Polyline */}
                <Polyline
                  positions={route}
                  color="#10b981"
                  weight={4}
                  opacity={0.8}
                />
              </MapContainer>
            </MotionCard>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default LiveTracking

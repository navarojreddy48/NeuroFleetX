import { LogOut, User, MapPin, Edit, Mail, Building, Car, DollarSign, Shield, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useCustomer } from '../../context/CustomerContext'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../ui/cn'
import { MotionCard } from '../../ui/MotionCard'
import { RippleButton } from '../../ui/RippleButton'

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const savedLocations = [
  { id: 'loc-1', name: 'Home', city: 'Bengaluru', coordinates: [12.9716, 77.5946] },
  { id: 'loc-2', name: 'Office', city: 'Electronic City', coordinates: [12.8399, 77.677], },
  { id: 'loc-3', name: 'Airport', city: 'Kempegowda Airport', coordinates: [13.1986, 77.7066] },
]

function SectionCard({ title, children, icon: Icon, color }) {
  return (
    <MotionCard className={`bg-gradient-to-br ${color} shadow-lg`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5 text-gray-700" />}
          <h2 className="text-lg font-black text-gray-900">{title}</h2>
        </div>
        <button type="button" className="flex items-center gap-1 rounded-lg bg-white/60 px-2 py-1 text-xs font-bold text-emerald-600 shadow-sm hover:bg-white hover:text-emerald-700">
          <Edit className="h-3 w-3" />
          Edit
        </button>
      </div>
      {children}
    </MotionCard>
  )
}

function CustomerProfile() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { user, bookings, clearSession } = useCustomer()

  const totalSpent = bookings.reduce((sum, booking) => sum + (booking.pricing?.totalPrice || 0), 0)
  const totalSaved = Math.round(totalSpent * 0.12)
  const preferredType = bookings.find((booking) => booking.vehicle?.type)?.vehicle?.type || 'EV'
  const center = savedLocations[0].coordinates

  const handleLogout = () => {
    clearSession()
    navigate('/login')
  }

  return (
    <div className="space-y-6">
      <MotionCard className="border-2 border-emerald-300 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 shadow-2xl" hover={false}>
        <div className="flex items-center gap-3">
          <User className="h-10 w-10 text-gray-900" />
          <div>
            <h1 className="text-3xl font-black text-gray-900">Customer Profile</h1>
            <p className="mt-1 text-sm font-bold text-gray-900">Manage your account and travel preferences</p>
          </div>
        </div>
      </MotionCard>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Personal Information" icon={User} color="from-blue-50 to-blue-100">
          <div className="space-y-2">
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <p className="text-xs font-semibold text-gray-600">Full Name</p>
              <p className="text-sm font-bold text-gray-900">{user.name}</p>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <p className="text-xs font-semibold text-gray-600">Gender</p>
              <p className="text-sm font-bold text-gray-900">{user.gender}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Contact Details" icon={Mail} color="from-purple-50 to-purple-100">
          <div className="space-y-2">
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <p className="text-xs font-semibold text-gray-600">Email Address</p>
              <p className="text-sm font-bold text-gray-900">{user.email}</p>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <p className="text-xs font-semibold text-gray-600">Company</p>
              <p className="text-sm font-bold text-gray-900">{user.companyName}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Travel Preferences" icon={Car} color="from-green-50 to-green-100">
          <div className="space-y-2">
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <p className="text-xs font-semibold text-gray-600">Preferred Vehicle Type</p>
              <p className="text-sm font-bold text-gray-900">{preferredType}</p>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <p className="text-xs font-semibold text-gray-600">Preferred Route Mode</p>
              <p className="text-sm font-bold text-gray-900">Fuel Efficient</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Payment & Savings" icon={DollarSign} color="from-orange-50 to-orange-100">
          <div className="space-y-2">
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <p className="text-xs font-semibold text-gray-600">Total Spent</p>
              <p className="text-lg font-black text-orange-600">₹{totalSpent}</p>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <p className="text-xs font-semibold text-gray-600">Estimated Savings</p>
              <p className="text-lg font-black text-green-600">₹{totalSaved}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Account Status" icon={Shield} color="from-teal-50 to-teal-100">
          <div className="space-y-2">
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <p className="text-xs font-semibold text-gray-600">Role</p>
              <span className="inline-flex rounded-full bg-teal-500 px-3 py-1 text-xs font-bold text-white">CUSTOMER</span>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <p className="text-xs font-semibold text-gray-600">Account Status</p>
              <span className="inline-flex rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">Active</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Saved Locations" icon={MapPin} color="from-yellow-50 to-yellow-100">
          <div className="space-y-2 mb-3">
            {savedLocations.map((location) => (
              <div key={location.id} className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
                <div className="rounded-full bg-yellow-500 p-2">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{location.name}</p>
                  <p className="text-xs font-semibold text-gray-600">{location.city}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="h-56 overflow-hidden rounded-xl border-2 border-yellow-300 shadow-md">
            <MapContainer center={center} zoom={10} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {savedLocations.map((location) => (
                <Marker key={location.id} position={location.coordinates}>
                  <Popup>{location.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </SectionCard>
      </div>

      <RippleButton
        onClick={handleLogout}
        className="border-2 border-red-500 bg-red-500 px-5 py-3 font-bold text-white shadow-md hover:bg-red-600"
      >
        <LogOut className="mr-2 inline h-5 w-5" />
        Logout
      </RippleButton>
    </div>
  )
}

export default CustomerProfile

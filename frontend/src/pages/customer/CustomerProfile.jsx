import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  LeafletSuspense,
  LazyMapContainer as MapContainer,
  LazyMarker as Marker,
  LazyPopup as Popup,
  LazyTileLayer as TileLayer,
} from '../../components/leaflet/LazyReactLeaflet'
import { useCustomer } from '../../context/CustomerContext'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../ui/cn'

const savedLocations = [
  { id: 'loc-1', name: 'Home', city: 'Bengaluru', coordinates: [12.9716, 77.5946] },
  { id: 'loc-2', name: 'Office', city: 'Electronic City', coordinates: [12.8399, 77.677], },
  { id: 'loc-3', name: 'Airport', city: 'Kempegowda Airport', coordinates: [13.1986, 77.7066] },
]

function SectionCard({ title, children, theme }) {
  return (
    <section className={cn('rounded-2xl border p-5', theme === 'light' ? 'border-emerald-200 bg-white' : 'border-white/10 bg-zinc-900/65')}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button type="button" className="text-xs font-semibold text-emerald-600">Edit</button>
      </div>
      {children}
    </section>
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
      <div className={cn('rounded-2xl border p-6', theme === 'light' ? 'border-emerald-200 bg-emerald-50/45' : 'border-white/10 bg-zinc-900/65')}>
        <h1 className="text-2xl font-semibold">Customer Profile</h1>
        <p className={cn('mt-1 text-sm', theme === 'light' ? 'text-slate-600' : 'text-zinc-300')}>Manage your account and travel preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Personal Information" theme={theme}>
          <p className="text-sm text-slate-600">Name: {user.name}</p>
          <p className="text-sm text-slate-600">Gender: {user.gender}</p>
        </SectionCard>

        <SectionCard title="Contact Details" theme={theme}>
          <p className="text-sm text-slate-600">Email: {user.email}</p>
          <p className="text-sm text-slate-600">Company: {user.companyName}</p>
        </SectionCard>

        <SectionCard title="Travel Preferences" theme={theme}>
          <p className="text-sm text-slate-600">Preferred vehicle type: {preferredType}</p>
          <p className="text-sm text-slate-600">Preferred route mode: Fuel Efficient</p>
        </SectionCard>

        <SectionCard title="Payment & Savings" theme={theme}>
          <p className="text-sm text-slate-600">Total spent: ₹{totalSpent}</p>
          <p className="text-sm text-slate-600">Estimated savings: ₹{totalSaved}</p>
        </SectionCard>

        <SectionCard title="Account Status" theme={theme}>
          <p className="text-sm text-slate-600">Role: CUSTOMER</p>
          <p className="text-sm text-slate-600">Status: Active</p>
        </SectionCard>

        <SectionCard title="Saved Locations" theme={theme}>
          <div className="space-y-2">
            {savedLocations.map((location) => (
              <p key={location.id} className="text-sm text-slate-600">{location.name}: {location.city}</p>
            ))}
          </div>
          <div className="mt-3 h-56 overflow-hidden rounded-xl border border-emerald-200">
            <LeafletSuspense>
              <MapContainer center={center} zoom={10} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {savedLocations.map((location) => (
                  <Marker key={location.id} position={location.coordinates}>
                    <Popup>{location.name}</Popup>
                  </Marker>
                ))}
              </MapContainer>
            </LeafletSuspense>
          </div>
        </SectionCard>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex items-center gap-2 rounded-xl border border-red-300/40 bg-red-500/10 px-4 py-2.5 font-semibold text-red-500"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </div>
  )
}

export default CustomerProfile

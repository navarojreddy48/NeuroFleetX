import { NavLink } from 'react-router-dom'
import { Gauge, MapPinned, CarFront, IndianRupee, User, Settings, ChevronLeft, ChevronRight } from 'lucide-react'

function DriverSidebar({ isCollapsed, onToggle, isMobile }) {
  const navItems = [
    { icon: Gauge, label: 'Dashboard', path: '/driver/dashboard' },
    { icon: MapPinned, label: 'Live Tracking', path: '/driver/live-tracking' },
    { icon: CarFront, label: 'Trips', path: '/driver/trips' },
    { icon: IndianRupee, label: 'Earnings', path: '/driver/earnings' },
    { icon: User, label: 'Profile', path: '/driver/profile' },
    { icon: Settings, label: 'Settings', path: '/driver/settings' },
  ]

  return (
    <div
      className={`fixed left-0 top-0 z-40 flex h-full flex-col border-r-2 border-emerald-200 bg-white shadow-2xl transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-72'
      } ${isMobile && isCollapsed ? '-translate-x-full' : 'translate-x-0'}`}
    >
      {/* Header */}
      <div className="border-b-2 border-emerald-200 bg-gradient-to-r from-emerald-400 to-teal-400 px-4 py-6">
        {!isCollapsed && (
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-white">NEUROFLEET</p>
            <p className="mt-1 text-lg font-bold text-white">Driver Portal</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="mt-3 rounded-lg border-2 border-white/30 bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/30"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-4 py-3 font-bold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                        : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                    } ${isCollapsed ? 'justify-center' : ''}`
                  }
                >
                  <Icon size={22} className="flex-shrink-0" />
                  {!isCollapsed && <span className="text-sm">{item.label}</span>}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer - Quick Stats */}
      {!isCollapsed && (
        <div className="border-t-2 border-emerald-200 p-4">
          <div className="rounded-xl bg-white p-3 shadow-md">
            <p className="text-xs font-bold uppercase text-gray-600">Quick Stats</p>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-600">Today's Trips:</span>
                <span className="font-black text-emerald-600">8</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-600">Earnings:</span>
                <span className="font-black text-emerald-600">₹1,850</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DriverSidebar

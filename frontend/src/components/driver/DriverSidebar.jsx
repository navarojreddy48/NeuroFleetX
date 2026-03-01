import {
  CarFront,
  CircleDollarSign,
  Gauge,
  LogOut,
  MapPinned,
  Settings,
  User,
  X,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'

const navItems = [
  { to: '/driver/dashboard', label: 'Dashboard', icon: Gauge },
  { to: '/driver/live-tracking', label: 'Live Tracking', icon: MapPinned },
  { to: '/driver/trips', label: 'Trips', icon: CarFront },
  { to: '/driver/earnings', label: 'Earnings', icon: CircleDollarSign },
  { to: '/driver/profile', label: 'Profile', icon: User },
  { to: '/driver/settings', label: 'Settings', icon: Settings },
]

function DriverSidebar({ name, role, avatarInitial, mobileOpen, onClose }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('authToken')
    localStorage.removeItem('role')
    localStorage.removeItem('authRole')
    localStorage.removeItem('authName')
    localStorage.removeItem('authEmail')
    localStorage.removeItem('authGender')
    localStorage.removeItem('authCompanyName')
    navigate('/login', { replace: true })
  }

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-slate-200 px-5 py-5">
        <p className="text-xl font-bold tracking-tight text-slate-900">NeuroFleetX</p>
        <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-slate-500">Driver Panel</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  'group flex items-center gap-3 rounded-r-xl border-l-4 px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                ].join(' ')
              }
            >
              <Icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>

        <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
            {avatarInitial}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{name}</p>
            <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              {String(role).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden h-screen w-[260px] shrink-0 border-r border-slate-200 bg-white lg:block">{sidebarContent}</aside>

      <div
        className={[
          'fixed inset-0 z-[2000] lg:hidden',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none',
        ].join(' ')}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          aria-label="Close sidebar backdrop"
          onClick={onClose}
          className={[
            'absolute inset-0 bg-slate-900/40 transition-opacity duration-300',
            mobileOpen ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
        />

        <aside
          className={[
            'absolute left-0 top-0 h-full w-[260px] border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 ease-out',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          ].join(' ')}
        >
          <div className="flex items-center justify-end border-b border-slate-200 px-3 py-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {sidebarContent}
        </aside>
      </div>
    </>
  )
}

export default DriverSidebar

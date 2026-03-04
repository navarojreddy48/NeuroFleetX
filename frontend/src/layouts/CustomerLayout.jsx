import { ChevronLeft, ChevronRight, X, LayoutDashboard, Route, Calendar, MapPin, User, Settings } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { cn } from '../ui/cn'
import { useCustomer } from '../context/CustomerContext'
import { TopNavbar } from '../components/TopNavbar'

const navItems = [
  { to: '/customer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/customer/plan', label: 'Plan Trip', icon: Route },
  { to: '/customer/bookings', label: 'Bookings', icon: Calendar },
  { to: '/customer/trips', label: 'Trips', icon: MapPin },
  { to: '/customer/profile', label: 'Profile', icon: User },
  { to: '/customer/settings', label: 'Settings', icon: Settings },
]

function CustomerLayout() {
  const navigate = useNavigate()
  const { user, clearSession } = useCustomer()
  const { theme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    clearSession()
    navigate('/login')
  }

  return (
    <div className={cn('min-h-screen transition-colors', theme === 'light' ? 'bg-slate-100' : 'bg-slate-950')}>
      <aside
        className={cn(
          'fixed left-0 top-0 z-30 hidden h-screen bg-white md:block',
          'border-r-2 border-emerald-200',
          collapsed ? 'w-20' : 'w-72',
        )}
      >
        <div className="border-b-2 border-emerald-200 bg-gradient-to-r from-emerald-400 to-teal-400 px-4 py-6">
          {!collapsed ? (
            <>
              <p className="text-xs font-black uppercase tracking-widest text-white">NEUROFLEET</p>
              <p className="mt-1 text-lg font-bold text-white">Customer Portal</p>
            </>
          ) : (
            <p className="text-center text-xs font-black uppercase text-white">N</p>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="mt-3 rounded-lg border-2 border-white/30 bg-white/20 p-2 text-white transition hover:bg-white/30"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-2 px-3">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                        : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600',
                    )
                  }
                >
                  <Icon className="h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              )
            })}
          </nav>
        </div>

        {!collapsed && (
          <div className="border-t-2 border-emerald-200 p-4">
            <div className="rounded-xl bg-white p-3 shadow-md">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-600">Quick Stats</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Active Bookings</span>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-sm font-bold text-blue-700">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total Trips</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-sm font-bold text-emerald-700">15</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

      <TopNavbar onOpenMobileSidebar={() => setMobileOpen(true)} />

      <div className={cn('transition-all duration-300', collapsed ? 'md:pl-20' : 'md:pl-72')}>
        <main className="p-6 pt-24">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default CustomerLayout

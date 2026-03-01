import { Bell, LogOut } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { cn } from '../ui/cn'
import { useCustomer } from '../context/CustomerContext'

const navItems = [
  { to: '/customer/dashboard', label: 'Dashboard' },
  { to: '/customer/plan', label: 'Plan Trip' },
  { to: '/customer/bookings', label: 'Bookings' },
  { to: '/customer/trips', label: 'Trips' },
  { to: '/customer/profile', label: 'Profile' },
  { to: '/customer/settings', label: 'Settings' },
]

function CustomerLayout() {
  const navigate = useNavigate()
  const { user, clearSession } = useCustomer()
  const { theme } = useTheme()

  const handleLogout = () => {
    clearSession()
    navigate('/login')
  }

  return (
    <div className="min-h-screen">
      <aside
        className={cn(
          'fixed left-0 top-0 z-20 h-screen w-72 border-r px-4 py-6',
          theme === 'light' ? 'border-emerald-100 bg-white' : 'border-white/10 bg-slate-950/90',
        )}
      >
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-500">NeuroFleet</p>
          <p className={cn('mt-1 text-2xl font-semibold', theme === 'light' ? 'text-slate-900' : 'text-zinc-100')}>Customer</p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'block rounded-xl px-4 py-2.5 text-sm font-medium transition',
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-600'
                    : theme === 'light'
                      ? 'text-slate-600 hover:bg-emerald-50 hover:text-slate-900'
                      : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-zinc-100',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="md:pl-72">
        <header
          className={cn(
            'sticky top-0 z-10 flex h-20 items-center justify-between border-b px-6 backdrop-blur',
            theme === 'light' ? 'border-emerald-100 bg-white/95' : 'border-white/10 bg-slate-950/80',
          )}
        >
          <div>
            <p className={cn('text-sm', theme === 'light' ? 'text-slate-500' : 'text-zinc-400')}>Welcome back</p>
            <p className={cn('text-lg font-semibold', theme === 'light' ? 'text-slate-900' : 'text-zinc-100')}>{user.name}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className={cn(
                'rounded-xl border p-2',
                theme === 'light' ? 'border-emerald-100 text-slate-700' : 'border-white/15 text-zinc-200',
              )}
            >
              <Bell className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-red-300/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default CustomerLayout

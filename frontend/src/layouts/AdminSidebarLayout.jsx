import { motion } from 'framer-motion'
import {
  BrainCircuit,
  ChartNoAxesCombined,
  LayoutDashboard,
  LogOut,
  Menu,
  Route,
  TrafficCone,
  User,
  Users,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/fleet-analytics', label: 'Fleet Analytics', icon: ChartNoAxesCombined },
  { to: '/admin/traffic-analytics', label: 'Traffic Analytics', icon: TrafficCone },
  { to: '/admin/route-reports', label: 'Route Reports', icon: Route },
  { to: '/admin/ai-settings', label: 'AI Settings', icon: BrainCircuit },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/profile', label: 'Profile', icon: User },
]

function AdminSidebarLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const adminName = useMemo(() => {
    const storedName = localStorage.getItem('authName')
    if (storedName) {
      return storedName
    }

    const email = localStorage.getItem('authEmail') || ''
    if (!email) {
      return 'Admin'
    }

    return email
      .split('@')[0]
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  }, [])

  const role = useMemo(() => {
    const savedRole = localStorage.getItem('role') || 'admin'
    return String(savedRole).toUpperCase()
  }, [])

  const avatarInitial = (adminName || 'A').charAt(0).toUpperCase()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/login')
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 px-5 py-5">
        <p className="text-xl font-bold tracking-tight text-slate-900">NeuroFleetX</p>
        <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-slate-500">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileSidebarOpen(false)}
              className={({ isActive }) =>
                [
                  'group flex items-center gap-3 rounded-r-xl border-l-4 px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'border-green-500 bg-green-50 text-green-600'
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
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-[260px] border-r border-slate-200 bg-slate-50 lg:block">
          {sidebarContent}
        </aside>

        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-[2000] lg:hidden" role="dialog" aria-modal="true">
            <button
              type="button"
              className="absolute inset-0 bg-slate-900/40"
              aria-label="Close sidebar backdrop"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <aside className="absolute left-0 top-0 h-full w-[260px] border-r border-slate-200 bg-slate-50 shadow-xl">
              <div className="flex items-center justify-end border-b border-slate-200 px-3 py-2.5">
                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="rounded-lg p-1.5 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
                  aria-label="Close sidebar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {sidebarContent}
            </aside>
          </div>
        )}

        <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-6">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(true)}
                className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
                aria-label="Open sidebar"
              >
                <Menu className="h-4 w-4" />
              </button>

              <div className="ml-auto flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{adminName}</p>
                  <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    {role}
                  </span>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                  {avatarInitial}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminSidebarLayout
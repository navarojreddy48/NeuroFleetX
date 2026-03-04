import { motion } from 'framer-motion'
import {
  BrainCircuit,
  ChartNoAxesCombined,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Route,
  TrafficCone,
  User,
  Users,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { TopNavbar } from '../components/TopNavbar'

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
  const [collapsed, setCollapsed] = useState(false)

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

  const sidebarContent = (collapsed) => (
    <div className="flex h-full flex-col">
      <div className="border-b-2 border-emerald-200 bg-gradient-to-r from-emerald-400 to-teal-400 px-4 py-6">
        {!collapsed && (
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-white">NEUROFLEET</p>
            <p className="mt-1 text-lg font-bold text-white">Admin Portal</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mt-3 rounded-lg border-2 border-white/30 bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/30"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-4 py-3 font-bold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                        : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                    } ${collapsed ? 'justify-center' : ''}`
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span className="text-sm">{item.label}</span>}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {!collapsed && (
        <div className="border-t-2 border-emerald-200 p-4">
          <div className="rounded-xl bg-white p-3 shadow-md">
            <p className="text-xs font-bold uppercase text-gray-600">Quick Stats</p>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-600">Total Users:</span>
                <span className="font-black text-emerald-600">128</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-600">Active Fleets:</span>
                <span className="font-black text-emerald-600">42</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-100 transition-colors">
      <div className="flex">
        <aside className={`fixed left-0 top-0 z-30 hidden h-screen border-r-2 border-emerald-200 bg-white shadow-2xl transition-all duration-300 lg:block ${collapsed ? 'w-20' : 'w-72'}`}>
          {sidebarContent(collapsed)}
        </aside>

        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-[2000] lg:hidden" role="dialog" aria-modal="true">
            <button
              type="button"
              className="absolute inset-0 bg-slate-900/40"
              aria-label="Close sidebar backdrop"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <aside className="absolute left-0 top-0 h-full w-72 border-r-2 border-emerald-200 bg-white shadow-xl">
              <div className="flex items-center justify-end border-b-2 border-emerald-200 px-3 py-2.5">
                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="rounded-lg p-1.5 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
                  aria-label="Close sidebar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {sidebarContent(false)}
            </aside>
          </div>
        )}

        <div className={`flex min-h-screen flex-1 flex-col overflow-hidden transition-all duration-300 ${collapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
          <TopNavbar onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />

          <main className="flex-1 overflow-y-auto p-6 pt-24">
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
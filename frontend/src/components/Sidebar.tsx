import { motion } from 'framer-motion'
import {
  AlertTriangle,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Route,
  Truck,
  User,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { cn } from '../ui/cn'

type SidebarProps = {
  collapsed: boolean
  onToggle: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}

const baseNavigation = [
  { key: 'dashboard', to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'vehicles', to: '/vehicles', label: 'Vehicles', icon: Truck },
  { key: 'alerts', to: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { key: 'route-optimization', to: '/route-optimization', label: 'Route Optimization', icon: Route },
  { key: 'traffic-analytics', to: '/traffic-analytics', label: 'Traffic Analytics', icon: BarChart3 },
]

const LinkList = ({ collapsed, onNavigate, theme }: { collapsed: boolean; onNavigate?: () => void; theme: 'light' | 'dark' }) => (
  <nav className="space-y-2 px-3">
    {(() => {
      const storedRole = localStorage.getItem('role') || localStorage.getItem('authRole') || ''
      const normalizedRole = String(storedRole)
        .toLowerCase()
        .replace(/[_\s-]+/g, '')
      const isFleetManager = normalizedRole === 'fleetmanager'

      const navigation = [
        ...baseNavigation.map((item) =>
          item.key === 'dashboard' && isFleetManager
            ? { ...item, to: '/fleetmanager/dashboard' }
            : item,
        ),
        ...(isFleetManager ? [{ key: 'profile', to: '/fleetmanager/profile', label: 'Profile', icon: User }] : []),
      ]

      return navigation.map((item) => {
      const Icon = item.icon
      return (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
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
      })
    })()}
  </nav>
)

export const Sidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) => {
  const { theme } = useTheme()

  return (
    <>
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
              <p className="mt-1 text-lg font-bold text-white">Fleet Manager</p>
            </>
          ) : (
            <p className="text-center text-xs font-black uppercase text-white">N</p>
          )}
          <button
            onClick={onToggle}
            className="mt-3 rounded-lg border-2 border-white/30 bg-white/20 p-2 text-white transition hover:bg-white/30"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <LinkList collapsed={collapsed} theme={theme} />
        </div>
        {!collapsed && (
          <div className="border-t-2 border-emerald-200 p-4">
            <div className="rounded-xl bg-white p-3 shadow-md">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-600">Quick Stats</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Active Vehicles</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-sm font-bold text-emerald-700">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Alerts Today</span>
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-sm font-bold text-orange-700">3</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

      <motion.div
        initial={false}
        animate={{ x: mobileOpen ? 0 : -320 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed inset-y-0 left-0 z-40 w-72 border-r-2 border-emerald-200 bg-white md:hidden"
      >
        <div className="border-b-2 border-emerald-200 bg-gradient-to-r from-emerald-400 to-teal-400 px-4 py-6">
          <p className="text-xs font-black uppercase tracking-widest text-white">NEUROFLEET</p>
          <p className="mt-1 text-lg font-bold text-white">Fleet Manager</p>
          <button
            onClick={onMobileClose}
            className="mt-3 rounded-lg border-2 border-white/30 bg-white/20 p-2 text-white transition hover:bg-white/30"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto py-4" style={{height: 'calc(100vh - 170px)'}}>
          <LinkList collapsed={false} onNavigate={onMobileClose} theme={theme} />
        </div>
        <div className="border-t-2 border-emerald-200 p-4">
          <div className="rounded-xl bg-white p-3 shadow-md">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-600">Quick Stats</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Active Vehicles</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-sm font-bold text-emerald-700">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Alerts Today</span>
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-sm font-bold text-orange-700">3</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {mobileOpen && (
        <button
          onClick={onMobileClose}
          className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm md:hidden"
          aria-label="Close sidebar"
        />
      )}
    </>
  )
}

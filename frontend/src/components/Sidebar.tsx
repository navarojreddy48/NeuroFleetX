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
              'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition duration-300 ease-in-out',
              isActive
                ? 'bg-emerald-500/20 text-emerald-300 shadow-lg'
                : theme === 'light'
                  ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  : 'text-zinc-300 hover:bg-zinc-800/70 hover:text-zinc-100',
            )
          }
        >
          <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
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
          'fixed left-0 top-0 z-30 hidden h-screen py-6 backdrop-blur md:block',
          theme === 'light'
            ? 'border-r border-slate-200 bg-white/95'
            : 'border-r border-white/10 bg-slate-950/90',
          collapsed ? 'w-20' : 'w-72',
        )}
      >
        <div className="mb-8 flex items-center justify-between px-4">
          {!collapsed && (
            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-400">NeuroFleet</p>
              <p className={cn('text-base font-semibold', theme === 'light' ? 'text-slate-900' : 'text-zinc-100')}>Fleet Manager</p>
            </div>
          )}
          <button
            onClick={onToggle}
            className={cn(
              'rounded-lg border p-2 transition',
              theme === 'light'
                ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                : 'border-white/10 text-zinc-300 hover:bg-white/10',
            )}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
        <LinkList collapsed={collapsed} theme={theme} />
      </aside>

      <motion.div
        initial={false}
        animate={{ x: mobileOpen ? 0 : -320 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-72 py-6 backdrop-blur md:hidden',
          theme === 'light'
            ? 'border-r border-slate-200 bg-white/95'
            : 'border-r border-white/10 bg-slate-950/95',
        )}
      >
        <div className="mb-8 flex items-center justify-between px-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-400">NeuroFleet</p>
            <p className={cn('text-base font-semibold', theme === 'light' ? 'text-slate-900' : 'text-zinc-100')}>Fleet Manager</p>
          </div>
          <button
            onClick={onMobileClose}
            className={cn(
              'rounded-lg border p-2 transition',
              theme === 'light'
                ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                : 'border-white/10 text-zinc-300 hover:bg-white/10',
            )}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <LinkList collapsed={false} onNavigate={onMobileClose} theme={theme} />
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

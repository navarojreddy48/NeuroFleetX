import { Bell, LogOut, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { cn } from '../ui/cn'

type TopNavbarProps = {
  onOpenMobileSidebar: () => void
}

export const TopNavbar = ({ onOpenMobileSidebar }: TopNavbarProps) => {
  const navigate = useNavigate()
  const { theme } = useTheme()

  const authEmail = localStorage.getItem('authEmail') || 'user@neurofleet.ai'
  const emailNameFallback = authEmail
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
  const authName = localStorage.getItem('authName') || emailNameFallback
  const authRoleRaw = localStorage.getItem('authRole') || localStorage.getItem('role') || 'USER'
  const normalizedRole = String(authRoleRaw)
    .toLowerCase()
    .replace(/[_\s-]+/g, '')
  const profileRoute = normalizedRole === 'fleetmanager' ? '/fleetmanager/profile' : '/'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('authToken')
    localStorage.removeItem('authRole')
    localStorage.removeItem('authName')
    localStorage.removeItem('authEmail')
    localStorage.removeItem('authGender')
    localStorage.removeItem('authCompanyName')
    navigate('/login')
  }

  return (
    <header
      className={cn(
        'fixed right-0 top-0 z-20 flex h-20 w-full items-center justify-between border-b px-4 backdrop-blur md:px-6',
        theme === 'light'
          ? 'border-slate-200 bg-white/85'
          : 'border-white/10 bg-slate-950/70',
      )}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className={cn(
            'rounded-xl border p-2 transition md:hidden',
            theme === 'light'
              ? 'border-slate-200 text-slate-700 hover:bg-slate-100'
              : 'border-white/10 text-zinc-300 hover:bg-white/10',
          )}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          className={cn(
            'rounded-xl border p-2 transition',
            theme === 'light'
              ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              : 'border-white/10 bg-zinc-900/70 text-zinc-200 hover:bg-zinc-800',
          )}
        >
          <Bell className="h-4 w-4" />
        </button>
        <button
          onClick={() => navigate(profileRoute)}
          className={cn(
            'flex items-center gap-3 rounded-2xl border px-3 py-2',
            theme === 'light'
              ? 'border-slate-200 bg-white'
              : 'border-white/10 bg-zinc-900/70',
          )}
        >
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400 to-indigo-500" />
          <div className="hidden md:block">
            <p className={cn('text-sm font-medium', theme === 'light' ? 'text-slate-900' : 'text-zinc-100')}>{authName}</p>
            <p className={cn('text-xs', theme === 'light' ? 'text-slate-500' : 'text-zinc-400')}>{authEmail}</p>
          </div>
        </button>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}

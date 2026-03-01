import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { TopNavbar } from '../components/TopNavbar'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useTheme } from '../hooks/useTheme'
import { cn } from '../ui/cn'

export const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const { theme } = useTheme()

  useEffect(() => {
    if (isDesktop) {
      setMobileOpen(false)
    }
  }, [isDesktop])

  return (
    <div
      className={cn(
        'min-h-screen transition-colors duration-300',
        theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-zinc-100',
      )}
    >
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((current) => !current)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <TopNavbar onOpenMobileSidebar={() => setMobileOpen(true)} />

      <main
        className={cn(
          'pt-24 transition-all duration-300 ease-in-out',
          collapsed ? 'md:pl-24' : 'md:pl-[19rem]',
        )}
      >
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

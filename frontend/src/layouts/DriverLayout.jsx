import { Menu } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Outlet } from 'react-router-dom'
import DriverSidebar from '../components/driver/DriverSidebar'
import { driverIdentity } from '../data/driverMockData'
import { TopNavbar } from '../components/TopNavbar'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'

function resolveToken() {
  const authToken = localStorage.getItem('authToken')
  if (authToken) {
    return authToken
  }

  const legacyToken = localStorage.getItem('token')
  if (!legacyToken || legacyToken === 'dummy_token') {
    return ''
  }

  return legacyToken
}

function DriverLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [sidebarIdentity, setSidebarIdentity] = useState(driverIdentity)

  const fallbackIdentity = useMemo(() => {
    const savedName = localStorage.getItem('authName') || driverIdentity.name
    const rawRole = localStorage.getItem('authRole') || localStorage.getItem('role') || driverIdentity.role

    return {
      name: savedName,
      role: String(rawRole).replace(/[_-]+/g, ' '),
      avatarInitial: (savedName || 'D').charAt(0).toUpperCase(),
    }
  }, [])

  useEffect(() => {
    setSidebarIdentity(fallbackIdentity)

    const loadSidebarIdentity = async () => {
      const token = resolveToken()
      if (!token) {
        return
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const raw = await response.text()
        let payload = {}
        try {
          payload = raw ? JSON.parse(raw) : {}
        } catch {
          payload = {}
        }

        if (!response.ok) {
          return
        }

        const resolvedName = payload.fullName || fallbackIdentity.name
        const resolvedRole = payload.role || fallbackIdentity.role

        setSidebarIdentity({
          name: resolvedName,
          role: String(resolvedRole).replace(/[_-]+/g, ' '),
          avatarInitial: (resolvedName || 'D').charAt(0).toUpperCase(),
        })
      } catch {
      }
    }

    loadSidebarIdentity()
  }, [fallbackIdentity])

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <DriverSidebar
        isCollapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      <div className="flex flex-1 flex-col overflow-hidden transition-all duration-300" style={{ marginLeft: collapsed ? '80px' : '288px' }}>
        <TopNavbar onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto bg-slate-100 p-6 pt-24">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DriverLayout
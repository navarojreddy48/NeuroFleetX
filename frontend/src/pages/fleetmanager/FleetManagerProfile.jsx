import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Car, Activity, Settings, Shield, LogOut } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { alertRows, fleetVehicles } from '../../data/mockData'
import { MotionCard } from '../../ui/MotionCard'
import { RippleButton } from '../../ui/RippleButton'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'

function FleetManagerProfile() {
  const navigate = useNavigate()
  const { theme, setTheme, toggleTheme } = useTheme()
  const [deleteError, setDeleteError] = useState('')
  const [deleteSuccess, setDeleteSuccess] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const profile = useMemo(() => {
    const email = localStorage.getItem('authEmail') || ''
    const savedRoleRaw = localStorage.getItem('authRole') || localStorage.getItem('role') || 'FLEET_MANAGER'
    const emailNameFallback = email
      ? email
          .split('@')[0]
          .replace(/[._-]+/g, ' ')
          .replace(/\b\w/g, (letter) => letter.toUpperCase())
      : 'Fleet Manager'

    const displayRole = savedRoleRaw
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase())

    const companyName = localStorage.getItem('authCompanyName') || 'Not Available'
    const gender = localStorage.getItem('authGender') || 'Not Available'

    return {
      name: localStorage.getItem('authName') || emailNameFallback,
      email: email || 'user@neurofleet.ai',
      role: displayRole,
      roleRaw: savedRoleRaw,
      companyName,
      gender,
    }
  }, [])

  const initial = profile.name.charAt(0).toUpperCase()
  const activeVehicles = fleetVehicles.filter((vehicle) => vehicle.status === 'Active').length
  const activeDrivers = Math.max(activeVehicles - 1, 1)
  const alertsToday = alertRows.length

  const clearSession = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('authToken')
    localStorage.removeItem('authRole')
    localStorage.removeItem('authName')
    localStorage.removeItem('authEmail')
    localStorage.removeItem('authGender')
    localStorage.removeItem('authCompanyName')
  }

  const handleLogout = () => {
    clearSession()
    navigate('/login')
  }

  const executeDeleteAccount = async () => {
    setDeleteError('')
    setDeleteSuccess('')
    setIsDeleting(true)

    const token = localStorage.getItem('token') || localStorage.getItem('authToken')

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/account`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })

      if (!response.ok) {
        const bodyText = await response.text()
        throw new Error(bodyText || `Delete failed (${response.status})`)
      }

      setDeleteSuccess('Account deleted successfully. Redirecting to login...')
      clearSession()
      window.setTimeout(() => {
        navigate('/login')
      }, 1200)
    } catch (error) {
      setDeleteError(error.message || 'Unable to delete account right now.')
    }

    setIsDeleting(false)
  }

  const handleDeleteAccount = () => {
    setDeleteError('')
    setDeleteSuccess('')
    setShowDeleteConfirm(true)
  }

  const handleCancelDelete = () => {
    if (isDeleting) {
      return
    }
    setShowDeleteConfirm(false)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <MotionCard className="border-2 border-emerald-300 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 shadow-2xl" hover={false}>
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/30 text-3xl font-black text-gray-900">
              {initial}
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">{profile.name}</h1>
              <p className="text-lg font-bold text-gray-900">
                {profile.companyName} • {profile.role}
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900">Managing fleet operations and vehicle tracking</p>
            </div>
          </div>
          <RippleButton
            onClick={handleLogout}
            className="border-2 border-red-500 bg-red-500 px-5 py-3 font-bold text-white shadow-md hover:bg-red-600"
          >
            <LogOut className="mr-2 inline h-5 w-5" />
            Logout
          </RippleButton>
        </div>
      </MotionCard>

      <div className="grid gap-4 md:grid-cols-3">
        <MotionCard className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-2xl bg-white/60 p-3 text-blue-600">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900">Account Details</h3>
              <p className="text-xs font-semibold text-gray-600">Your login information</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <p className="text-xs font-semibold text-gray-600">Email</p>
              <p className="text-sm font-bold text-gray-900">{profile.email}</p>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <p className="text-xs font-semibold text-gray-600">Role</p>
              <p className="text-sm font-bold text-gray-900">{profile.roleRaw}</p>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <p className="text-xs font-semibold text-gray-600">Status</p>
              <span className="inline-flex rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">Active</span>
            </div>
          </div>
          <div className="mt-4 border-t border-blue-200 pt-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-700">Theme</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  theme === 'light'
                    ? 'bg-blue-600 text-white'
                    : 'border border-blue-300 text-blue-700 hover:bg-blue-50'
                }`}
              >
                Light
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  theme === 'dark'
                    ? 'bg-blue-600 text-white'
                    : 'border border-blue-300 text-blue-700 hover:bg-blue-50'
                }`}
              >
                Dark
              </button>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="mt-2 rounded-lg border border-blue-300 px-3 py-1.5 text-xs font-bold text-blue-700 transition hover:bg-blue-50"
            >
              Toggle Theme
            </button>
          </div>
          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="mt-4 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </button>
          {deleteError && <p className="mt-2 text-xs font-bold text-red-600">{deleteError}</p>}
          {deleteSuccess && <p className="mt-2 text-xs font-bold text-emerald-700">{deleteSuccess}</p>}
        </MotionCard>

        <MotionCard className="bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-2xl bg-white/60 p-3 text-purple-600">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900">Personal Information</h3>
              <p className="text-xs font-semibold text-gray-600">Your profile details</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <p className="text-xs font-semibold text-gray-600">Full Name</p>
              <p className="text-sm font-bold text-gray-900">{profile.name}</p>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <p className="text-xs font-semibold text-gray-600">Gender</p>
              <p className="text-sm font-bold text-gray-900">{profile.gender}</p>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <p className="text-xs font-semibold text-gray-600">Company</p>
              <p className="text-sm font-bold text-gray-900">{profile.companyName}</p>
            </div>
          </div>
        </MotionCard>

        <MotionCard className="bg-gradient-to-br from-green-50 to-green-100 shadow-lg">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-2xl bg-white/60 p-3 text-green-600">
              <Car className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900">Fleet Overview</h3>
              <p className="text-xs font-semibold text-gray-600">Your fleet statistics</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <p className="text-xs font-semibold text-gray-600">Total Vehicles</p>
              <p className="text-lg font-black text-green-600">{fleetVehicles.length}</p>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <p className="text-xs font-semibold text-gray-600">Active Vehicles</p>
              <p className="text-lg font-black text-green-600">{activeVehicles}</p>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <p className="text-xs font-semibold text-gray-600">Active Drivers</p>
              <p className="text-lg font-black text-gray-900">{activeDrivers}</p>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <p className="text-xs font-semibold text-gray-600">Alerts Today</p>
              <p className="text-lg font-black text-orange-600">{alertsToday}</p>
            </div>
          </div>
        </MotionCard>
      </div>

      <MotionCard className="bg-gradient-to-br from-teal-50 to-teal-100 shadow-lg">
        <div className="mb-4 flex items-center gap-2">
          <div className="rounded-2xl bg-white/60 p-3 text-teal-600">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">Fleet Management Tools</h2>
            <p className="text-sm font-semibold text-gray-600">Quick access to fleet operations</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Link to="/vehicles" className="rounded-xl border-2 border-teal-400 bg-white px-6 py-4 text-center font-bold text-teal-700 shadow-md transition hover:bg-teal-50">
            Add Vehicle
          </Link>
          <Link to="/vehicles" className="rounded-xl border-2 border-teal-400 bg-white px-6 py-4 text-center font-bold text-teal-700 shadow-md transition hover:bg-teal-50">
            View Vehicles
          </Link>
          <Link to="/fleetmanager/dashboard" className="rounded-xl border-2 border-teal-400 bg-white px-6 py-4 text-center font-bold text-teal-700 shadow-md transition hover:bg-teal-50">
            Manage Drivers
          </Link>
          <Link to="/alerts" className="rounded-xl border-2 border-teal-400 bg-white px-6 py-4 text-center font-bold text-teal-700 shadow-md transition hover:bg-teal-50">
            View Alerts
          </Link>
        </div>
      </MotionCard>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/70">
          <MotionCard className="w-full max-w-md bg-white shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-red-100 p-3 text-red-600">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black text-gray-900">Delete Account?</h3>
            </div>
            <p className="text-sm font-semibold text-gray-600">
              This action is permanent and cannot be undone. Your account and access will be removed.
            </p>

            {deleteError && <p className="mt-3 text-xs font-bold text-red-600">{deleteError}</p>}

            <div className="mt-5 flex items-center justify-end gap-3">
              <RippleButton
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="border-2 border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-md hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </RippleButton>
              <RippleButton
                onClick={executeDeleteAccount}
                disabled={isDeleting}
                className="border-2 border-red-500 bg-red-500 px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </RippleButton>
            </div>
          </MotionCard>
        </div>
      )}

    </div>
  )
}

export default FleetManagerProfile

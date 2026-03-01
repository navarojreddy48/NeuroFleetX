import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { alertRows, fleetVehicles } from '../data/mockData'

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
      <div
        className={`rounded-2xl border p-6 shadow-lg md:p-8 ${
          theme === 'light'
            ? 'border-emerald-200 bg-white'
            : 'border-emerald-400/40 bg-zinc-900/80'
        }`}
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-300/30 text-3xl font-semibold text-violet-300">
              {initial}
            </div>
            <div>
              <h1 className={`text-3xl font-bold tracking-tight ${theme === 'light' ? 'text-slate-900' : 'text-zinc-100'}`}>{profile.name}</h1>
              <p className={`text-lg font-medium ${theme === 'light' ? 'text-violet-600' : 'text-violet-300'}`}>
                {profile.companyName} • {profile.role}
              </p>
              <p className={`mt-1 text-sm ${theme === 'light' ? 'text-slate-500' : 'text-zinc-400'}`}>Managing fleet operations and vehicle tracking</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl bg-red-400 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div
          className={`rounded-xl border p-5 ${
            theme === 'light'
              ? 'border-emerald-200 bg-white'
              : 'border-emerald-400/40 bg-emerald-400/10'
          }`}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className={`text-base font-semibold ${theme === 'light' ? 'text-slate-800' : 'text-emerald-200'}`}>Account Details</h3>
            <span className={`text-xs font-semibold ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-300'}`}>Edit</span>
          </div>
          <div className={`space-y-1.5 text-sm ${theme === 'light' ? 'text-slate-700' : 'text-zinc-200'}`}>
            <p>Email: {profile.email}</p>
            <p>Role: {profile.roleRaw}</p>
            <p>Status: Active</p>
          </div>
          <div className={`mt-4 border-t pt-3 ${theme === 'light' ? 'border-emerald-200' : 'border-emerald-400/30'}`}>
            <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-300'}`}>Theme</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  theme === 'light'
                    ? 'bg-emerald-500 text-white'
                    : theme === 'dark'
                      ? 'border border-emerald-300/40 text-emerald-200 hover:bg-emerald-400/10'
                      : 'border border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                Light
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  theme === 'dark'
                    ? 'bg-emerald-500 text-white'
                    : theme === 'light'
                      ? 'border border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                      : 'border border-emerald-300/40 text-emerald-200 hover:bg-emerald-400/10'
                }`}
              >
                Dark
              </button>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className={`mt-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                theme === 'light'
                  ? 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                  : 'border-emerald-300/40 text-emerald-200 hover:bg-emerald-400/10'
              }`}
            >
              Toggle Theme
            </button>
          </div>
          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className={`mt-4 rounded-xl border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
              theme === 'light'
                ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100'
                : 'border-red-400/40 bg-red-500/10 text-red-300 hover:bg-red-500/20'
            }`}
          >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </button>
          {deleteError && <p className={`mt-2 text-xs ${theme === 'light' ? 'text-red-600' : 'text-red-300'}`}>{deleteError}</p>}
          {deleteSuccess && <p className={`mt-2 text-xs ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-300'}`}>{deleteSuccess}</p>}
        </div>

        <div
          className={`rounded-xl border p-5 ${
            theme === 'light'
              ? 'border-emerald-200 bg-white'
              : 'border-emerald-400/40 bg-emerald-400/10'
          }`}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className={`text-base font-semibold ${theme === 'light' ? 'text-slate-800' : 'text-emerald-200'}`}>Personal Information</h3>
            <span className={`text-xs font-semibold ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-300'}`}>Edit</span>
          </div>
          <div className={`space-y-1.5 text-sm ${theme === 'light' ? 'text-slate-700' : 'text-zinc-200'}`}>
            <p>Full Name: {profile.name}</p>
            <p>Gender: {profile.gender}</p>
            <p>Company: {profile.companyName}</p>
          </div>
        </div>

        <div
          className={`rounded-xl border p-5 ${
            theme === 'light'
              ? 'border-emerald-200 bg-white'
              : 'border-emerald-400/40 bg-emerald-400/10'
          }`}
        >
          <h3 className={`mb-3 text-base font-semibold ${theme === 'light' ? 'text-slate-800' : 'text-emerald-200'}`}>Fleet Overview</h3>
          <div className={`space-y-1.5 text-sm ${theme === 'light' ? 'text-slate-700' : 'text-zinc-200'}`}>
            <p>Total Vehicles: {fleetVehicles.length}</p>
            <p>Active Drivers: {activeDrivers}</p>
            <p>Alerts Today: {alertsToday}</p>
            <p>Active Vehicles: {activeVehicles}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-6">
        <h2 className="text-3xl font-semibold text-zinc-100">Fleet Management Tools</h2>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Link to="/vehicles" className="rounded-xl border border-emerald-400/50 bg-emerald-400/10 px-6 py-4 text-center font-semibold text-emerald-200 transition hover:bg-emerald-400/20">
            Add Vehicle
          </Link>
          <Link to="/vehicles" className="rounded-xl border border-emerald-400/50 bg-emerald-400/10 px-6 py-4 text-center font-semibold text-emerald-200 transition hover:bg-emerald-400/20">
            View Vehicles
          </Link>
          <Link to="/fleetmanager/dashboard" className="rounded-xl border border-emerald-400/50 bg-emerald-400/10 px-6 py-4 text-center font-semibold text-emerald-200 transition hover:bg-emerald-400/20">
            Manage Drivers
          </Link>
          <Link to="/alerts" className="rounded-xl border border-emerald-400/50 bg-emerald-400/10 px-6 py-4 text-center font-semibold text-emerald-200 transition hover:bg-emerald-400/20">
            View Alerts
          </Link>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm ${theme === 'light' ? 'bg-slate-300/60' : 'bg-slate-950/70'}`}>
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${theme === 'light' ? 'border-red-200 bg-white' : 'border-red-400/30 bg-zinc-900'}`}>
            <h3 className={`text-xl font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-zinc-100'}`}>Delete Account?</h3>
            <p className={`mt-2 text-sm ${theme === 'light' ? 'text-slate-600' : 'text-zinc-300'}`}>
              This action is permanent and cannot be undone. Your account and access will be removed.
            </p>

            {deleteError && <p className={`mt-3 text-xs ${theme === 'light' ? 'text-red-600' : 'text-red-300'}`}>{deleteError}</p>}

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className={`rounded-xl border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  theme === 'light'
                    ? 'border-slate-300 text-slate-700 hover:bg-slate-100'
                    : 'border-white/15 text-zinc-200 hover:bg-white/10'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDeleteAccount}
                disabled={isDeleting}
                className="rounded-xl border border-red-400/40 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default FleetManagerProfile

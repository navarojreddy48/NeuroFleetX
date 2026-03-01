import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { driverProfile } from '../../data/driverMockData'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'

function DriverProfile() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(driverProfile)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      const authToken = localStorage.getItem('authToken')
      const legacyToken = localStorage.getItem('token')
      const token = authToken || (legacyToken && legacyToken !== 'dummy_token' ? legacyToken : '')

      if (!token) {
        setIsLoading(false)
        setError('Session token missing. Please login again.')
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
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token')
            localStorage.removeItem('authToken')
            localStorage.removeItem('role')
            localStorage.removeItem('authRole')
            localStorage.removeItem('authName')
            localStorage.removeItem('authEmail')
            localStorage.removeItem('authGender')
            localStorage.removeItem('authCompanyName')
            navigate('/login', { replace: true })
            return
          }
          throw new Error(payload.message || payload.error || `Failed to load profile (${response.status})`)
        }

        setFormData((previous) => ({
          ...previous,
          name: payload.fullName || previous.name,
          email: payload.email || previous.email,
          licenseNumber: payload.licenseNumber || previous.licenseNumber,
          vehicleAssigned: payload.vehicleAssigned || previous.vehicleAssigned,
        }))
      } catch (fetchError) {
        setError(fetchError.message || 'Unable to load profile data')
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
        <p className="mt-1 text-sm text-slate-600">Manage your driver account details</p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Driver Information</h2>

        {isLoading && <p className="mt-3 text-sm text-slate-500">Loading profile...</p>}
        {!isLoading && error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none"
            />
          </div>

          <div>
            <label htmlFor="licenseNumber" className="mb-1 block text-sm font-medium text-slate-700">
              License Number
            </label>
            <input
              id="licenseNumber"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="vehicleAssigned" className="mb-1 block text-sm font-medium text-slate-700">
              Vehicle Assigned
            </label>
            <input
              id="vehicleAssigned"
              name="vehicleAssigned"
              value={formData.vehicleAssigned}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none"
            />
          </div>
        </div>

        <button
          type="button"
          className="mt-5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Save Changes
        </button>
      </section>
    </div>
  )
}

export default DriverProfile
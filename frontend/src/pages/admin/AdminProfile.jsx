import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Award, Sparkles } from 'lucide-react'

function AdminProfile() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(true)
  const [securityMessage, setSecurityMessage] = useState('')

  const profile = useMemo(() => {
    const email = localStorage.getItem('authEmail') || ''
    const nameFallback = email
      ? email
          .split('@')[0]
          .replace(/[._-]+/g, ' ')
          .replace(/\b\w/g, (letter) => letter.toUpperCase())
      : 'Admin User'

    return {
      name: localStorage.getItem('authName') || nameFallback,
      email: email || 'admin@neurofleet.ai',
      phone: localStorage.getItem('authPhone') || '+91 98765 43210',
      organization: localStorage.getItem('authCompanyName') || 'NeuroFleetX',
      role: localStorage.getItem('role') || 'admin',
      lastLogin: localStorage.getItem('authLastLogin') || 'Today, 09:32 AM',
    }
  }, [])

  const recentActions = useMemo(
    () => [
      'Updated traffic model thresholds',
      'Approved new fleet manager account',
      'Reviewed route optimization report',
    ],
    [],
  )

  const avatarInitial = profile.name.charAt(0).toUpperCase()

  const handlePasswordChange = () => {
    if (!password.trim()) {
      setSecurityMessage('Please enter a new password.')
      return
    }

    setPassword('')
    setSecurityMessage('Password updated successfully.')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/login')
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border-2 border-fuchsia-300 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-fuchsia-600 p-6 shadow-2xl">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="h-9 w-9 text-gray-900" />
            <h1 className="text-3xl font-black text-gray-900">Admin Profile</h1>
          </div>
          <Sparkles className="h-11 w-11 animate-pulse text-gray-900" />
        </div>
      </section>

      <section className="rounded-2xl border-2 border-fuchsia-300 bg-gradient-to-br from-fuchsia-100 via-fuchsia-50 to-white p-6 shadow-xl">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl font-black text-fuchsia-700 shadow-lg">
            {avatarInitial}
          </div>
          <div>
            <p className="text-xl font-black text-slate-900">{profile.name}</p>
            <p className="text-sm font-semibold text-slate-600">{profile.email}</p>
            <span className="mt-1 inline-flex rounded-full bg-fuchsia-100 px-2.5 py-1 text-xs font-semibold text-fuchsia-700">
              {String(profile.role).toUpperCase()}
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-100 via-indigo-50 to-white p-6 shadow-xl">
        <h2 className="text-lg font-black text-slate-900">Account Details</h2>
        <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
          <p><span className="font-black text-slate-900">Name:</span> {profile.name}</p>
          <p><span className="font-black text-slate-900">Email:</span> {profile.email}</p>
          <p><span className="font-black text-slate-900">Phone:</span> {profile.phone}</p>
          <p><span className="font-black text-slate-900">Organization:</span> {profile.organization}</p>
        </div>
      </section>

      <section className="rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-100 via-amber-50 to-white p-6 shadow-xl">
        <h2 className="text-lg font-black text-slate-900">Security Settings</h2>
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Change Password"
              className="h-10 min-w-[220px] flex-1 rounded-xl border border-amber-200 px-3 text-sm font-semibold text-slate-700 outline-none"
            />
            <button
              type="button"
              onClick={handlePasswordChange}
              className="rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-amber-50"
            >
              Update Password
            </button>
          </div>

          <label className="flex items-center justify-between rounded-xl border border-amber-200 bg-white px-3 py-2.5">
            <span className="text-sm font-semibold text-slate-700">Two-Factor Authentication</span>
            <button
              type="button"
              onClick={() => setIsTwoFactorEnabled((prev) => !prev)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isTwoFactorEnabled
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </label>

          {securityMessage && <p className="text-sm font-semibold text-emerald-700">{securityMessage}</p>}
        </div>
      </section>

      <section className="rounded-2xl border-2 border-teal-300 bg-gradient-to-br from-teal-100 via-teal-50 to-white p-6 shadow-xl">
        <h2 className="text-lg font-black text-slate-900">Activity Summary</h2>
        <p className="mt-3 text-sm text-slate-700">
          <span className="font-black text-slate-900">Last Login:</span> {profile.lastLogin}
        </p>
        <div className="mt-3 space-y-2">
          {recentActions.map((action) => (
            <p key={action} className="rounded-xl border border-teal-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
              {action}
            </p>
          ))}
        </div>
      </section>

      <section>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2 text-sm font-black text-white shadow-lg transition hover:from-red-700 hover:to-rose-700"
        >
          Logout
        </button>
      </section>
    </div>
  )
}

export default AdminProfile
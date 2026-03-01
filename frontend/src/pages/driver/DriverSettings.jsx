import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function DriverSettings() {
  const navigate = useNavigate()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(false)
  const [language, setLanguage] = useState('English')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('authRole')
    navigate('/login')
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-600">Personalize your driver app preferences</p>
      </section>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
          <div>
            <p className="font-medium text-slate-900">Notifications</p>
            <p className="text-sm text-slate-600">Receive trip and earnings alerts</p>
          </div>
          <button
            type="button"
            onClick={() => setNotificationsEnabled((value) => !value)}
            className={[
              'rounded-full px-4 py-1.5 text-xs font-semibold transition',
              notificationsEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600',
            ].join(' ')}
          >
            {notificationsEnabled ? 'On' : 'Off'}
          </button>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
          <div>
            <p className="font-medium text-slate-900">Dark Mode</p>
            <p className="text-sm text-slate-600">Switch to low-light visual mode</p>
          </div>
          <button
            type="button"
            onClick={() => setDarkModeEnabled((value) => !value)}
            className={[
              'rounded-full px-4 py-1.5 text-xs font-semibold transition',
              darkModeEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600',
            ].join(' ')}
          >
            {darkModeEnabled ? 'On' : 'Off'}
          </button>
        </div>

        <div className="rounded-lg border border-slate-200 px-4 py-3">
          <label className="mb-2 block font-medium text-slate-900" htmlFor="driver-language">
            Language
          </label>
          <select
            id="driver-language"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Bengali</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
        >
          Logout
        </button>
      </section>
    </div>
  )
}

export default DriverSettings

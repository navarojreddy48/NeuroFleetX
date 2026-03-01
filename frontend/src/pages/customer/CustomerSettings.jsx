import { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../ui/cn'

function CustomerSettings() {
  const { theme } = useTheme()
  const [settings, setSettings] = useState({
    notifyTrips: true,
    notifyOffers: true,
    autoApplySavings: true,
  })

  const toggle = (key) => {
    setSettings((current) => ({ ...current, [key]: !current[key] }))
  }

  const cardClass = cn('rounded-2xl border p-5', theme === 'light' ? 'border-emerald-200 bg-white' : 'border-white/10 bg-zinc-900/65')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <div className={cardClass}>
        <h2 className="mb-3 text-lg font-semibold">Notifications</h2>
        <div className="space-y-3">
          <label className="flex items-center justify-between text-sm">
            <span>Trip reminders</span>
            <input type="checkbox" checked={settings.notifyTrips} onChange={() => toggle('notifyTrips')} />
          </label>
          <label className="flex items-center justify-between text-sm">
            <span>Promotional offers</span>
            <input type="checkbox" checked={settings.notifyOffers} onChange={() => toggle('notifyOffers')} />
          </label>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className="mb-3 text-lg font-semibold">Savings</h2>
        <label className="flex items-center justify-between text-sm">
          <span>Auto-apply best savings</span>
          <input type="checkbox" checked={settings.autoApplySavings} onChange={() => toggle('autoApplySavings')} />
        </label>
      </div>

      <button type="button" className="rounded-xl bg-emerald-500 px-5 py-2.5 font-semibold text-white">Save Preferences</button>
    </div>
  )
}

export default CustomerSettings

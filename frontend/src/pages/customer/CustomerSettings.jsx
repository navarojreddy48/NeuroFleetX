import { useState } from 'react'
import { Settings, Bell, DollarSign, Save } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../ui/cn'
import { MotionCard } from '../../ui/MotionCard'
import { RippleButton } from '../../ui/RippleButton'

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

  return (
    <div className="space-y-6">
      <MotionCard className="border-2 border-emerald-300 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 shadow-2xl" hover={false}>
        <div className="flex items-center gap-3">
          <Settings className="h-10 w-10 text-gray-900" />
          <div>
            <h1 className="text-3xl font-black text-gray-900">Settings</h1>
            <p className="mt-1 text-sm font-bold text-gray-900">Customize your preferences and notifications</p>
          </div>
        </div>
      </MotionCard>

      <MotionCard className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
        <div className="mb-4 flex items-center gap-2">
          <Bell className="h-6 w-6 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
            <span className="font-semibold text-gray-800">Trip reminders</span>
            <input 
              type="checkbox" 
              checked={settings.notifyTrips} 
              onChange={() => toggle('notifyTrips')}
              className="h-5 w-5 cursor-pointer accent-emerald-600" 
            />
          </label>
          <label className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
            <span className="font-semibold text-gray-800">Promotional offers</span>
            <input 
              type="checkbox" 
              checked={settings.notifyOffers} 
              onChange={() => toggle('notifyOffers')}
              className="h-5 w-5 cursor-pointer accent-emerald-600" 
            />
          </label>
        </div>
      </MotionCard>

      <MotionCard className="bg-gradient-to-br from-green-50 to-green-100 shadow-lg">
        <div className="mb-4 flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-green-600" />
          <h2 className="text-lg font-bold text-gray-900">Savings</h2>
        </div>
        <label className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
          <span className="font-semibold text-gray-800">Auto-apply best savings</span>
          <input 
            type="checkbox" 
            checked={settings.autoApplySavings} 
            onChange={() => toggle('autoApplySavings')}
            className="h-5 w-5 cursor-pointer accent-emerald-600" 
          />
        </label>
      </MotionCard>

      <RippleButton className="border-2 border-emerald-500 bg-emerald-600 px-6 py-3 font-bold text-white shadow-lg hover:bg-emerald-700">
        <Save className="mr-2 inline h-5 w-5" />
        Save Preferences
      </RippleButton>
    </div>
  )
}

export default CustomerSettings

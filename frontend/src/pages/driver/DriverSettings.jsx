import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, Bell, Moon, Globe, LogOut, Shield, Lock, Smartphone, Volume2 } from 'lucide-react'
import { MotionCard } from '../../ui/MotionCard'
import { PageTransition } from '../../ui/PageTransition'
import { RippleButton } from '../../ui/RippleButton'

function DriverSettings() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState({
    notifications: true,
    pushNotifications: true,
    emailNotifications: false,
    darkMode: false,
    language: 'English',
    soundEffects: true,
    autoAcceptTrips: false,
    locationTracking: true
  })

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('authRole')
    navigate('/login')
  }

  const toggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] })
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <MotionCard className="border-2 border-emerald-300 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 shadow-2xl" hover={false}>
          <div className="flex items-center gap-3">
            <Settings className="h-10 w-10 text-gray-900" />
            <div>
              <h1 className="text-3xl font-black text-gray-900">Settings</h1>
              <p className="mt-1 text-sm font-bold text-gray-900">Customize your driver app preferences</p>
            </div>
          </div>
        </MotionCard>

        {/* Notifications */}
        <MotionCard className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-white shadow-xl">
          <h2 className="flex items-center gap-2 border-b-2 border-blue-200 pb-4 text-xl font-black text-gray-900">
            <Bell className="h-6 w-6 text-blue-600" />
            Notifications
          </h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900">Push Notifications</p>
                <p className="text-sm font-bold text-gray-600">Receive trip alerts and updates</p>
              </div>
              <button
                onClick={() => toggleSetting('pushNotifications')}
                className={`relative h-7 w-14 rounded-full transition-all ${
                  settings.pushNotifications ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all ${
                    settings.pushNotifications ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900">Email Notifications</p>
                <p className="text-sm font-bold text-gray-600">Get weekly earnings reports via email</p>
              </div>
              <button
                onClick={() => toggleSetting('emailNotifications')}
                className={`relative h-7 w-14 rounded-full transition-all ${
                  settings.emailNotifications ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all ${
                    settings.emailNotifications ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900">Sound Effects</p>
                <p className="text-sm font-bold text-gray-600">Play sounds for new trip requests</p>
              </div>
              <button
                onClick={() => toggleSetting('soundEffects')}
                className={`relative h-7 w-14 rounded-full transition-all ${
                  settings.soundEffects ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all ${
                    settings.soundEffects ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </MotionCard>

        {/* Trip Preferences */}
        <MotionCard className="border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-white shadow-xl">
          <h2 className="flex items-center gap-2 border-b-2 border-orange-200 pb-4 text-xl font-black text-gray-900">
            <Smartphone className="h-6 w-6 text-orange-600" />
            Trip Preferences
          </h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900">Auto-Accept Trips</p>
                <p className="text-sm font-bold text-gray-600">Automatically accept incoming trip requests</p>
              </div>
              <button
                onClick={() => toggleSetting('autoAcceptTrips')}
                className={`relative h-7 w-14 rounded-full transition-all ${
                  settings.autoAcceptTrips ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all ${
                    settings.autoAcceptTrips ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900">Location Tracking</p>
                <p className="text-sm font-bold text-gray-600">Share your live location with customers</p>
              </div>
              <button
                onClick={() => toggleSetting('locationTracking')}
                className={`relative h-7 w-14 rounded-full transition-all ${
                  settings.locationTracking ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all ${
                    settings.locationTracking ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </MotionCard>

        {/* Security & Privacy */}
        <MotionCard className="border-2 border-red-300 bg-gradient-to-br from-red-50 to-white shadow-xl">
          <h2 className="flex items-center gap-2 border-b-2 border-red-200 pb-4 text-xl font-black text-gray-900">
            <Shield className="h-6 w-6 text-red-600" />
            Security & Privacy
          </h2>
          <div className="mt-4 space-y-3">
            <RippleButton className="w-full bg-gradient-to-r from-blue-600 to-blue-700 py-3 font-black text-white shadow-lg hover:from-blue-700 hover:to-blue-800">
              <Lock className="mr-2 inline h-5 w-5" />
              Change Password
            </RippleButton>
            <RippleButton className="w-full bg-gradient-to-r from-purple-600 to-purple-700 py-3 font-black text-white shadow-lg hover:from-purple-700 hover:to-purple-800">
              <Shield className="mr-2 inline h-5 w-5" />
              Privacy Settings
            </RippleButton>
          </div>
        </MotionCard>

        {/* Account Actions */}
        <MotionCard className="border-2 border-gray-300 bg-gradient-to-br from-gray-50 to-white shadow-xl">
          <h2 className="flex items-center gap-2 border-b-2 border-gray-200 pb-4 text-xl font-black text-gray-900">
            <Settings className="h-6 w-6 text-gray-600" />
            Account Actions
          </h2>
          <div className="mt-4 space-y-3">
            <RippleButton className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 py-3 font-black text-white shadow-lg hover:from-emerald-700 hover:to-teal-800">
              💾 Save All Changes
            </RippleButton>
            <RippleButton
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 py-3 font-black text-white shadow-lg hover:from-red-700 hover:to-red-800"
            >
              <LogOut className="mr-2 inline h-5 w-5" />
              Logout
            </RippleButton>
          </div>
        </MotionCard>

        {/* App Info */}
        <MotionCard className="border-2 border-gray-300 bg-white shadow-xl text-center">
          <p className="text-sm font-bold text-gray-600">NEUROFLEET Driver App</p>
          <p className="mt-1 text-xs font-bold text-gray-500">Version 2.0.0 • © 2025 NeuroFleet</p>
          <div className="mt-3 flex justify-center gap-3">
            <a href="#" className="text-xs font-bold text-emerald-600 hover:underline">Terms of Service</a>
            <span className="text-gray-400">•</span>
            <a href="#" className="text-xs font-bold text-emerald-600 hover:underline">Privacy Policy</a>
            <span className="text-gray-400">•</span>
            <a href="#" className="text-xs font-bold text-emerald-600 hover:underline">Help Center</a>
          </div>
        </MotionCard>
      </div>
    </PageTransition>
  )
}

export default DriverSettings

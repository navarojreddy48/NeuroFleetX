import { useMemo, useState } from 'react'
import { Award, Sparkles } from 'lucide-react'

function AISettings() {
  const [mapsApiKey, setMapsApiKey] = useState('AIzaSyNeuroFleetX-Demo-Key-1234')
  const [showApiKey, setShowApiKey] = useState(false)
  const [etaAccuracy, setEtaAccuracy] = useState(86)
  const [trafficWeight, setTrafficWeight] = useState(68)
  const [energyEfficiencyWeight, setEnergyEfficiencyWeight] = useState(72)
  const [fuelOptimizationWeight, setFuelOptimizationWeight] = useState(74)
  const [enableDynamicRouting, setEnableDynamicRouting] = useState(true)
  const [enableAutoReassignment, setEnableAutoReassignment] = useState(true)
  const [enableSmartTrafficAlerts, setEnableSmartTrafficAlerts] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const trafficWeightLabel = useMemo(() => {
    if (trafficWeight <= 33) {
      return 'Low'
    }
    if (trafficWeight <= 66) {
      return 'Medium'
    }
    return 'High'
  }, [trafficWeight])

  const handleSaveApiKey = () => {
    setStatusMessage('API key saved successfully.')
  }

  const handleSaveAllSettings = () => {
    setStatusMessage('AI configuration saved successfully.')
  }

  return (
    <div className="space-y-8 pb-24">
      <section className="relative overflow-hidden rounded-3xl border-2 border-violet-300 bg-gradient-to-r from-violet-500 via-purple-500 to-violet-600 p-6 shadow-2xl">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="h-9 w-9 text-gray-900" />
            <div>
              <h1 className="text-3xl font-black text-gray-900">AI Settings &amp; Configuration</h1>
              <p className="mt-1 text-sm font-bold text-gray-900">Configure APIs, model weights, and intelligent automation behavior.</p>
            </div>
          </div>
          <Sparkles className="h-11 w-11 animate-pulse text-gray-900" />
        </div>
      </section>

      <section className="rounded-2xl border-2 border-violet-300 bg-gradient-to-br from-violet-100 via-violet-50 to-white p-5 shadow-xl">
        <h2 className="text-lg font-black text-slate-900">API Configuration</h2>
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
          <input
            type={showApiKey ? 'text' : 'password'}
            value={mapsApiKey}
            onChange={(event) => setMapsApiKey(event.target.value)}
            className="h-11 w-full rounded-xl border border-violet-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none"
            placeholder="Enter Maps API key"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowApiKey((prev) => !prev)}
              className="rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-violet-50"
            >
              {showApiKey ? 'Hide' : 'Show'}
            </button>
            <button
              type="button"
              onClick={handleSaveApiKey}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 px-4 py-2 text-sm font-black text-white shadow-lg transition hover:from-violet-700 hover:to-violet-800"
            >
              Save
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-100 via-indigo-50 to-white p-5 shadow-xl">
        <h2 className="text-lg font-black text-slate-900">Model Tuning Sliders</h2>

        <div className="mt-5 space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">ETA Accuracy</p>
              <span className="text-sm font-black text-violet-700">{etaAccuracy}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              value={etaAccuracy}
              onChange={(event) => setEtaAccuracy(Number(event.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Traffic Weight</p>
              <span className="text-sm font-black text-violet-700">{trafficWeightLabel} ({trafficWeight}%)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={trafficWeight}
              onChange={(event) => setTrafficWeight(Number(event.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Energy Efficiency Weight</p>
              <span className="text-sm font-black text-violet-700">{energyEfficiencyWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={energyEfficiencyWeight}
              onChange={(event) => setEnergyEfficiencyWeight(Number(event.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Fuel Optimization Weight</p>
              <span className="text-sm font-black text-violet-700">{fuelOptimizationWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={fuelOptimizationWeight}
              onChange={(event) => setFuelOptimizationWeight(Number(event.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-100 via-emerald-50 to-white p-5 shadow-xl">
        <h2 className="text-lg font-black text-slate-900">Toggle Settings</h2>
        <div className="mt-4 space-y-3">
          <label className="flex items-center justify-between rounded-xl border border-emerald-200 bg-white px-3 py-2.5">
            <span className="text-sm font-semibold text-slate-700">Enable Dynamic Routing</span>
            <input
              type="checkbox"
              checked={enableDynamicRouting}
              onChange={(event) => setEnableDynamicRouting(event.target.checked)}
              className="h-4 w-4 accent-emerald-500"
            />
          </label>

          <label className="flex items-center justify-between rounded-xl border border-emerald-200 bg-white px-3 py-2.5">
            <span className="text-sm font-semibold text-slate-700">Enable Auto Reassignment</span>
            <input
              type="checkbox"
              checked={enableAutoReassignment}
              onChange={(event) => setEnableAutoReassignment(event.target.checked)}
              className="h-4 w-4 accent-emerald-500"
            />
          </label>

          <label className="flex items-center justify-between rounded-xl border border-emerald-200 bg-white px-3 py-2.5">
            <span className="text-sm font-semibold text-slate-700">Enable Smart Traffic Alerts</span>
            <input
              type="checkbox"
              checked={enableSmartTrafficAlerts}
              onChange={(event) => setEnableSmartTrafficAlerts(event.target.checked)}
              className="h-4 w-4 accent-emerald-500"
            />
          </label>
        </div>
      </section>

      <div className="sticky bottom-2 z-10 rounded-2xl border-2 border-violet-300 bg-gradient-to-r from-violet-100 via-violet-50 to-white p-3 shadow-lg backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-700">{statusMessage || 'Changes are not saved yet.'}</p>
          <button
            type="button"
            onClick={handleSaveAllSettings}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 px-5 py-2.5 text-sm font-black text-white shadow-lg transition hover:from-violet-700 hover:to-violet-800"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  )
}

export default AISettings
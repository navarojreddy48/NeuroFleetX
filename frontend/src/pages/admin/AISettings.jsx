import { useMemo, useState } from 'react'

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
      <section>
        <h1 className="text-2xl font-semibold text-slate-900">AI Settings &amp; Configuration</h1>
        <p className="mt-1 text-sm text-slate-600">Configure APIs, model weights, and intelligent automation behavior.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">API Configuration</h2>
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
          <input
            type={showApiKey ? 'text' : 'password'}
            value={mapsApiKey}
            onChange={(event) => setMapsApiKey(event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none"
            placeholder="Enter Maps API key"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowApiKey((prev) => !prev)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {showApiKey ? 'Hide' : 'Show'}
            </button>
            <button
              type="button"
              onClick={handleSaveApiKey}
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Save
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Model Tuning Sliders</h2>

        <div className="mt-5 space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700">ETA Accuracy</p>
              <span className="text-sm font-semibold text-emerald-700">{etaAccuracy}%</span>
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
              <p className="text-sm font-medium text-slate-700">Traffic Weight</p>
              <span className="text-sm font-semibold text-emerald-700">{trafficWeightLabel} ({trafficWeight}%)</span>
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
              <p className="text-sm font-medium text-slate-700">Energy Efficiency Weight</p>
              <span className="text-sm font-semibold text-emerald-700">{energyEfficiencyWeight}%</span>
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
              <p className="text-sm font-medium text-slate-700">Fuel Optimization Weight</p>
              <span className="text-sm font-semibold text-emerald-700">{fuelOptimizationWeight}%</span>
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

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Toggle Settings</h2>
        <div className="mt-4 space-y-3">
          <label className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5">
            <span className="text-sm font-medium text-slate-700">Enable Dynamic Routing</span>
            <input
              type="checkbox"
              checked={enableDynamicRouting}
              onChange={(event) => setEnableDynamicRouting(event.target.checked)}
              className="h-4 w-4 accent-emerald-500"
            />
          </label>

          <label className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5">
            <span className="text-sm font-medium text-slate-700">Enable Auto Reassignment</span>
            <input
              type="checkbox"
              checked={enableAutoReassignment}
              onChange={(event) => setEnableAutoReassignment(event.target.checked)}
              className="h-4 w-4 accent-emerald-500"
            />
          </label>

          <label className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5">
            <span className="text-sm font-medium text-slate-700">Enable Smart Traffic Alerts</span>
            <input
              type="checkbox"
              checked={enableSmartTrafficAlerts}
              onChange={(event) => setEnableSmartTrafficAlerts(event.target.checked)}
              className="h-4 w-4 accent-emerald-500"
            />
          </label>
        </div>
      </section>

      <div className="sticky bottom-2 z-10 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">{statusMessage || 'Changes are not saved yet.'}</p>
          <button
            type="button"
            onClick={handleSaveAllSettings}
            className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  )
}

export default AISettings
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, Gauge, Pencil, Plus, Trash2 } from 'lucide-react'
import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { FleetMap } from '../../components/FleetMap'
import { type FleetVehicle, fleetVehicles } from '../../data/mockData'
import { useTheme } from '../../hooks/useTheme'
import { GlassModal } from '../../ui/GlassModal'
import { cn } from '../../ui/cn'
import { MotionCard } from '../../ui/MotionCard'
import { PageTransition } from '../../ui/PageTransition'
import { RippleButton } from '../../ui/RippleButton'

type VehicleFormState = {
  name: string
  registration: string
  type: 'EV' | 'Diesel'
  battery: string
  city: string
  status: 'Idle' | 'Active'
  driverLicense: string
  engineTemperature: string
  tireWear: string
  batteryHealth: string
  fuelEfficiency: string
  distanceCovered: string
}

const initialForm: VehicleFormState = {
  name: '',
  registration: '',
  type: 'EV',
  battery: '',
  city: '',
  status: 'Idle',
  driverLicense: '',
  engineTemperature: '',
  tireWear: '',
  batteryHealth: '',
  fuelEfficiency: '',
  distanceCovered: '',
}

const requiredFields: Array<keyof VehicleFormState> = [
  'name',
  'registration',
  'city',
  'driverLicense',
  'engineTemperature',
  'tireWear',
  'batteryHealth',
  'fuelEfficiency',
  'distanceCovered',
]

export const VehiclesPage = () => {
  const { theme } = useTheme()
  const [vehicles, setVehicles] = useState<FleetVehicle[]>(fleetVehicles)
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null)
  const [overspeedVehicle, setOverspeedVehicle] = useState<FleetVehicle | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [formState, setFormState] = useState<VehicleFormState>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof VehicleFormState, string>>>({})

  const canSubmit = useMemo(() => {
    return requiredFields.every((field) => formState[field].trim().length > 0)
  }, [formState])

  const onVehicleView = (vehicle: FleetVehicle) => {
    setSelectedVehicle(vehicle)
    if (vehicle.speed > 100) {
      setOverspeedVehicle(vehicle)
    }
  }

  const onDeleteVehicle = (id: string) => {
    setVehicles((current) => current.filter((vehicle) => vehicle.id !== id))
  }

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof VehicleFormState, string>> = {}

    requiredFields.forEach((field) => {
      if (!formState[field].trim()) {
        nextErrors[field] = 'Required'
      }
    })

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateForm()) {
      return
    }

    const createdVehicle: FleetVehicle = {
      id: `VH-${Math.floor(Math.random() * 900 + 100)}`,
      name: formState.name,
      registration: formState.registration,
      city: formState.city,
      fuel: 65,
      speed: 0,
      type: formState.type,
      battery: Number(formState.battery || 0),
      status: formState.status,
      driverLicense: formState.driverLicense,
      engineTemperature: Number(formState.engineTemperature),
      tireWear: Number(formState.tireWear),
      batteryHealth: Number(formState.batteryHealth),
      fuelEfficiency: Number(formState.fuelEfficiency),
      distanceCovered: Number(formState.distanceCovered),
      location: [19.076, 72.8777],
    }

    setVehicles((current) => [createdVehicle, ...current])
    setFormState(initialForm)
    setErrors({})
    setIsAddModalOpen(false)
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">Fleet Inventory</h1>
          <RippleButton onClick={() => setIsAddModalOpen(true)} className="inline-flex items-center gap-2 px-5 py-2.5">
            <Plus className="h-4 w-4" />
            Add Vehicle
          </RippleButton>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
          {vehicles.map((vehicle) => (
            <MotionCard
              key={vehicle.id}
              className={cn(
                'bg-gradient-to-br',
                theme === 'light'
                  ? 'from-white to-slate-50/80'
                  : 'from-slate-900/80 to-zinc-900/60',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className={cn('text-lg font-semibold', theme === 'light' ? 'text-slate-900' : 'text-zinc-100')}>{vehicle.name}</p>
                  <p className={cn('text-sm', theme === 'light' ? 'text-slate-500' : 'text-zinc-400')}>{vehicle.registration}</p>
                  <p className={cn('mt-1 text-sm', theme === 'light' ? 'text-slate-500' : 'text-zinc-400')}>{vehicle.city}</p>
                </div>
                <div
                  className={cn(
                    'rounded-xl border px-3 py-1 text-xs',
                    theme === 'light'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-white/10 bg-zinc-900/60 text-emerald-300',
                  )}
                >
                  {vehicle.status}
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <div className={cn('mb-1 flex items-center justify-between text-xs', theme === 'light' ? 'text-slate-500' : 'text-zinc-400')}>
                    <span>Fuel</span>
                    <span>{vehicle.fuel}%</span>
                  </div>
                  <div className={cn('h-2 rounded-full', theme === 'light' ? 'bg-slate-200' : 'bg-zinc-800')}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${vehicle.fuel}%` }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                      className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                    />
                  </div>
                </div>

                <div className={cn('flex items-center gap-2 text-sm', theme === 'light' ? 'text-slate-700' : 'text-zinc-300')}>
                  <Gauge className="h-4 w-4 text-indigo-300" />
                  Speed: {vehicle.speed} km/h
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onVehicleView(vehicle)}
                    className={cn(
                      'rounded-lg border p-2 transition',
                      theme === 'light'
                        ? 'border-slate-200 text-slate-700 hover:bg-slate-100'
                        : 'border-white/10 text-zinc-200 hover:bg-white/10',
                    )}
                    aria-label="View"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    className={cn(
                      'rounded-lg border p-2 transition',
                      theme === 'light'
                        ? 'border-slate-200 text-slate-700 hover:bg-slate-100'
                        : 'border-white/10 text-zinc-200 hover:bg-white/10',
                    )}
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDeleteVehicle(vehicle.id)}
                    className="rounded-lg border border-red-400/30 p-2 text-red-300 transition hover:bg-red-500/10"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </MotionCard>
          ))}
        </div>
      </div>

      <GlassModal
        open={selectedVehicle !== null}
        onClose={() => setSelectedVehicle(null)}
        title="Vehicle Live Tracking"
        className="max-w-4xl"
      >
        {selectedVehicle && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className={cn('rounded-xl border p-4', theme === 'light' ? 'border-slate-200 bg-white' : 'border-white/10 bg-zinc-900/70')}>
                <p className={cn('text-xs', theme === 'light' ? 'text-slate-500' : 'text-zinc-400')}>Reg no</p>
                <p className={cn('mt-1 font-semibold', theme === 'light' ? 'text-slate-900' : 'text-zinc-100')}>{selectedVehicle.registration}</p>
              </div>
              <div className={cn('rounded-xl border p-4', theme === 'light' ? 'border-slate-200 bg-white' : 'border-white/10 bg-zinc-900/70')}>
                <p className={cn('text-xs', theme === 'light' ? 'text-slate-500' : 'text-zinc-400')}>Fuel</p>
                <p className={cn('mt-1 font-semibold', theme === 'light' ? 'text-slate-900' : 'text-zinc-100')}>{selectedVehicle.fuel}%</p>
              </div>
              <div className={cn('rounded-xl border p-4', theme === 'light' ? 'border-slate-200 bg-white' : 'border-white/10 bg-zinc-900/70')}>
                <p className={cn('text-xs', theme === 'light' ? 'text-slate-500' : 'text-zinc-400')}>Speed</p>
                <p className={cn('mt-1 font-semibold', theme === 'light' ? 'text-slate-900' : 'text-zinc-100')}>{selectedVehicle.speed} km/h</p>
              </div>
            </div>

            <FleetMap
              center={selectedVehicle.location}
              markerLabel={`${selectedVehicle.id} - ${selectedVehicle.registration}`}
              className="h-[340px] w-full overflow-hidden rounded-2xl"
            />
          </div>
        )}
      </GlassModal>

      <GlassModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Vehicle" className="max-w-5xl">
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {(Object.keys(initialForm) as Array<keyof VehicleFormState>).map((field) => {
            const label =
              field === 'driverLicense'
                ? 'Driver License Number'
                : field === 'engineTemperature'
                  ? 'Engine Temperature'
                  : field === 'tireWear'
                    ? 'Tire Wear %'
                    : field === 'batteryHealth'
                      ? 'Battery Health %'
                      : field === 'fuelEfficiency'
                        ? 'Fuel Efficiency'
                        : field === 'distanceCovered'
                          ? 'Distance Covered'
                          : field === 'registration'
                            ? 'Registration Number'
                            : field === 'name'
                              ? 'Vehicle Name'
                              : field === 'type'
                                ? 'Vehicle Type'
                                : field === 'battery'
                                  ? 'Battery %'
                                  : field.charAt(0).toUpperCase() + field.slice(1)

            const isSelect = field === 'type' || field === 'status'

            return (
              <div key={field} className="space-y-1">
                <label className={cn('text-sm', theme === 'light' ? 'text-slate-700' : 'text-zinc-200')}>{label}</label>
                {isSelect ? (
                  <select
                    value={formState[field]}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        [field]: event.target.value,
                      }))
                    }
                    className={cn(
                      'w-full rounded-xl border px-3 py-2 outline-none transition focus:border-emerald-400/50',
                      theme === 'light'
                        ? 'border-slate-300 bg-white text-slate-900'
                        : 'border-white/15 bg-zinc-900/70 text-zinc-100',
                    )}
                  >
                    {field === 'type' ? (
                      <>
                        <option value="EV">EV</option>
                        <option value="Diesel">Diesel</option>
                      </>
                    ) : (
                      <>
                        <option value="Idle">Idle</option>
                        <option value="Active">Active</option>
                      </>
                    )}
                  </select>
                ) : (
                  <input
                    value={formState[field]}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        [field]: event.target.value,
                      }))
                    }
                    className={cn(
                      'w-full rounded-xl border px-3 py-2 outline-none transition',
                      theme === 'light' ? 'bg-white text-slate-900' : 'bg-zinc-900/70 text-zinc-100',
                      errors[field]
                        ? 'border-red-400/60 focus:border-red-400/80'
                        : theme === 'light'
                          ? 'border-slate-300 focus:border-emerald-400/50'
                          : 'border-white/15 focus:border-emerald-400/50',
                    )}
                  />
                )}
                {errors[field] && <p className="text-xs text-red-300">{errors[field]}</p>}
              </div>
            )
          })}

          <div className="md:col-span-2">
            <RippleButton type="submit" className="w-full py-3 text-base" disabled={!canSubmit}>
              Submit
            </RippleButton>
          </div>
        </form>
      </GlassModal>

      <AnimatePresence>
        {overspeedVehicle && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-[60] w-full max-w-sm rounded-2xl border border-red-400/40 bg-red-500/15 p-5 shadow-2xl backdrop-blur"
          >
            <p className="text-sm font-semibold text-red-200">Overspeed Alert</p>
            <p className="mt-2 text-sm text-red-100">Vehicle ID: {overspeedVehicle.id}</p>
            <p className="text-sm text-red-100">Speed: {overspeedVehicle.speed} km/h</p>
            <RippleButton onClick={() => setOverspeedVehicle(null)} variant="danger" className="mt-4 w-full">
              OK
            </RippleButton>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}

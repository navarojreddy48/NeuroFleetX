import { AnimatePresence, motion } from 'framer-motion'
import { Eye, Gauge, Pencil, Plus, Trash2, Car, Award, Sparkles } from 'lucide-react'
import type { FormEvent } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { GoogleMap } from '../../components/GoogleMap'
import { type FleetVehicle, fleetVehicles } from '../../data/mockData'
import { useTheme } from '../../hooks/useTheme'
import { simulationApi, vehicleApi } from '../../services/apiService'
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
  'battery',
]

export const VehiclesPage = () => {
  const OVERSPEED_THRESHOLD = 80

  const toNumber = (value: unknown, fallback = 0) => {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
  }

  const normalizePercent = (value: number) => Math.max(0, Math.min(100, value))

  const fuelStatusMeta = (value: number) => {
    if (value <= 20) {
      return {
        label: 'Low',
        className: 'border-red-300 bg-red-100 text-red-700',
      }
    }

    if (value <= 50) {
      return {
        label: 'Medium',
        className: 'border-amber-300 bg-amber-100 text-amber-700',
      }
    }

    return {
      label: 'Good',
      className: 'border-emerald-300 bg-emerald-100 text-emerald-700',
    }
  }

  const { theme } = useTheme()
  const [vehicles, setVehicles] = useState<FleetVehicle[]>(fleetVehicles)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null)
  const [overspeedVehicle, setOverspeedVehicle] = useState<FleetVehicle | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [formState, setFormState] = useState<VehicleFormState>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof VehicleFormState, string>>>({})
  const overspeedActiveIdsRef = useRef<Set<string>>(new Set())

  const closeVehicleFormModal = () => {
    setIsAddModalOpen(false)
    setEditingVehicleId(null)
    setFormState(initialForm)
    setErrors({})
  }

  const canSubmit = useMemo(() => {
    return requiredFields.every((field) => formState[field].trim().length > 0)
  }, [formState])

  useEffect(() => {
    let isMounted = true

    const loadVehicles = async (showLoader: boolean) => {
      if (showLoader) {
        setLoading(true)
      }

      try {
        const data = await vehicleApi.getAll()
        const mappedVehicles: FleetVehicle[] = (Array.isArray(data) ? data : []).map((vehicle) => {
          const vehicleType = String(vehicle.vehicleType ?? vehicle.vehicle_type ?? '').toUpperCase()
          const isElectric = vehicleType === 'EV'
          const batteryLevel = normalizePercent(
            toNumber(vehicle.batteryLevel ?? vehicle.battery_level ?? vehicle.batteryPercentage ?? vehicle.battery_percentage, 0),
          )
          const rawFuelLevel = vehicle.fuelLevel ?? vehicle.fuel_level ?? vehicle.fuel ?? vehicle.fuel_percentage
          const normalizedFuelLevel = normalizePercent(toNumber(rawFuelLevel, 0))
          const displayFuel = isElectric
            ? (batteryLevel > 0 ? batteryLevel : normalizedFuelLevel)
            : (normalizedFuelLevel > 0 ? normalizedFuelLevel : batteryLevel)

          return {
            id: String(vehicle.id),
            name: vehicle.vehicleName || vehicle.vehicle_name || 'Unnamed Vehicle',
            registration: vehicle.registrationNumber || vehicle.registration_number || 'N/A',
            city: vehicle.city || 'Unknown',
            fuel: displayFuel,
            speed: toNumber(vehicle.speed, 0),
            type: isElectric ? 'EV' : 'Diesel',
            battery: batteryLevel,
            status: vehicle.status === 'ACTIVE' || vehicle.status === 'IN_USE' ? 'Active' : 'Idle',
            driverLicense: vehicle.driverLicense || vehicle.driver_license || 'N/A',
            engineTemperature: toNumber(vehicle.engineTemperature ?? vehicle.engine_temperature, 0),
            tireWear: toNumber(vehicle.tireWear ?? vehicle.tire_wear, 0),
            batteryHealth: toNumber(vehicle.batteryHealth ?? vehicle.battery_health, 0),
            fuelEfficiency: toNumber(vehicle.fuelEfficiency ?? vehicle.fuel_efficiency, 0),
            distanceCovered: toNumber(vehicle.distanceCovered ?? vehicle.distance_covered, 0),
            location:
              typeof vehicle.latitude === 'number' && typeof vehicle.longitude === 'number'
                ? [vehicle.latitude, vehicle.longitude]
                : typeof vehicle.latitude === 'string' && typeof vehicle.longitude === 'string'
                  ? [toNumber(vehicle.latitude, 23.2599), toNumber(vehicle.longitude, 77.4126)]
                : [23.2599, 77.4126],
          }
        })

        if (!isMounted) {
          return
        }

        if (mappedVehicles.length > 0) {
          const crossedVehicle = mappedVehicles.find((vehicle) => {
            const isOverspeed = vehicle.speed > OVERSPEED_THRESHOLD
            const alreadyActive = overspeedActiveIdsRef.current.has(vehicle.id)
            return isOverspeed && !alreadyActive
          })

          mappedVehicles.forEach((vehicle) => {
            if (vehicle.speed > OVERSPEED_THRESHOLD) {
              overspeedActiveIdsRef.current.add(vehicle.id)
            } else {
              overspeedActiveIdsRef.current.delete(vehicle.id)
            }
          })

          setOverspeedVehicle((current) => {
            if (current) {
              const latestCurrent = mappedVehicles.find((vehicle) => vehicle.id === current.id)
              if (latestCurrent && latestCurrent.speed > OVERSPEED_THRESHOLD) {
                return latestCurrent
              }
            }

            return crossedVehicle ?? null
          })

          setVehicles(mappedVehicles)
          setSelectedVehicle((current) => {
            if (!current) {
              return current
            }

            return mappedVehicles.find((vehicle) => vehicle.id === current.id) ?? current
          })
        }

        setApiError('')
      } catch (error) {
        if (isMounted) {
          setApiError(error instanceof Error ? error.message : 'Unable to load vehicles from database')
        }
      } finally {
        if (showLoader && isMounted) {
          setLoading(false)
        }
      }
    }

    void simulationApi.start().catch((error) => {
      if (isMounted) {
        setApiError(error instanceof Error ? `Telemetry simulation issue: ${error.message}` : 'Telemetry simulation could not be started')
      }
      return null
    })

    void loadVehicles(true)
    const pollInterval = window.setInterval(() => {
      void loadVehicles(false)
    }, 2000)

    return () => {
      isMounted = false
      window.clearInterval(pollInterval)
    }
  }, [])

  useEffect(() => {
    if (!successMessage) {
      return
    }

    const timer = window.setTimeout(() => {
      setSuccessMessage('')
    }, 2500)

    return () => {
      window.clearTimeout(timer)
    }
  }, [successMessage])

  const onVehicleView = (vehicle: FleetVehicle) => {
    setSelectedVehicle(vehicle)
    if (vehicle.speed > OVERSPEED_THRESHOLD) {
      setOverspeedVehicle(vehicle)
    }
  }

  const onEditVehicle = (vehicle: FleetVehicle) => {
    setEditingVehicleId(vehicle.id)
    setFormState({
      name: vehicle.name,
      registration: vehicle.registration,
      type: vehicle.type,
      battery: String(vehicle.type === 'EV' ? vehicle.battery : vehicle.fuel),
      city: vehicle.city,
      status: vehicle.status === 'Active' ? 'Active' : 'Idle',
      driverLicense: vehicle.driverLicense,
      engineTemperature: String(vehicle.engineTemperature),
      tireWear: String(vehicle.tireWear),
      batteryHealth: String(vehicle.batteryHealth),
      fuelEfficiency: String(vehicle.fuelEfficiency),
      distanceCovered: String(vehicle.distanceCovered),
    })
    setErrors({})
    setIsAddModalOpen(true)
  }

  const onDeleteVehicle = async (id: string) => {
    setApiError('')
    try {
      const numericId = Number(id)
      if (Number.isFinite(numericId)) {
        await vehicleApi.delete(numericId)
      }
      setVehicles((current) => current.filter((vehicle) => vehicle.id !== id))
      setSelectedVehicle((current) => (current?.id === id ? null : current))
      setOverspeedVehicle((current) => (current?.id === id ? null : current))
      setSuccessMessage('Vehicle deleted successfully')
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Unable to delete vehicle')
    }
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

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateForm()) {
      return
    }

    setApiError('')

    try {
      const batteryValue = Math.max(0, Math.min(100, Number(formState.battery || 0)))
      const engineTemperature = Number(formState.engineTemperature || 0)
      const tireWear = Math.max(0, Math.min(100, Number(formState.tireWear || 0)))
      const batteryHealth = Math.max(0, Math.min(100, Number(formState.batteryHealth || 0)))

      const payload = {
        vehicleName: formState.name,
        registrationNumber: formState.registration,
        vehicleType: formState.type,
        batteryPercentage: batteryValue,
        batteryLevel: batteryValue,
        fuelLevel: batteryValue,
        batteryHealth,
        engineTemperature,
        tireWear,
        city: formState.city,
        status: formState.status === 'Active' ? 'ACTIVE' : 'IDLE',
      }

      if (editingVehicleId) {
        const updated = await vehicleApi.update(editingVehicleId, payload)
        setVehicles((current) =>
          current.map((vehicle) =>
            vehicle.id === editingVehicleId
              ? {
                  ...vehicle,
                  name: updated.vehicleName ?? payload.vehicleName,
                  registration: updated.registrationNumber ?? payload.registrationNumber,
                  city: updated.city ?? payload.city,
                  type: (updated.vehicleType ?? payload.vehicleType) === 'EV' ? 'EV' : 'Diesel',
                  fuel: Number(updated.fuelLevel ?? updated.batteryLevel ?? updated.batteryPercentage ?? payload.fuelLevel),
                  battery: Number(updated.batteryLevel ?? updated.batteryPercentage ?? payload.batteryPercentage),
                  status: (updated.status ?? payload.status) === 'ACTIVE' || (updated.status ?? payload.status) === 'IN_USE' ? 'Active' : 'Idle',
                  driverLicense: formState.driverLicense,
                  engineTemperature: Number(updated.engineTemperature ?? payload.engineTemperature),
                  tireWear: Number(updated.tireWear ?? payload.tireWear),
                  batteryHealth: Number(updated.batteryHealth ?? payload.batteryHealth),
                  fuelEfficiency: Number(formState.fuelEfficiency || 0),
                  distanceCovered: Number(formState.distanceCovered || 0),
                }
              : vehicle,
          ),
        )
        setSuccessMessage('Vehicle updated successfully')
      } else {
        const created = await vehicleApi.create(payload)
        const createdVehicle: FleetVehicle = {
          id: String(created.id),
          name: created.vehicleName,
          registration: created.registrationNumber,
          city: created.city,
          fuel: created.fuelLevel ?? created.fuel ?? created.batteryLevel ?? created.batteryPercentage ?? 0,
          speed: 0,
          type: created.vehicleType === 'EV' ? 'EV' : 'Diesel',
          battery: created.batteryPercentage ?? 0,
          status: created.status === 'ACTIVE' ? 'Active' : 'Idle',
          driverLicense: formState.driverLicense,
          engineTemperature: created.engineTemperature ?? 0,
          tireWear: created.tireWear ?? 0,
          batteryHealth: created.batteryHealth ?? 0,
          fuelEfficiency: Number(formState.fuelEfficiency || 0),
          distanceCovered: Number(formState.distanceCovered || 0),
          location:
            typeof created.latitude === 'number' && typeof created.longitude === 'number'
              ? [created.latitude, created.longitude]
              : [23.2599, 77.4126],
        }

        setVehicles((current) => [createdVehicle, ...current])
        setSuccessMessage('Vehicle added successfully')
      }

      closeVehicleFormModal()
    } catch (error) {
      setApiError(error instanceof Error ? error.message : `Unable to ${editingVehicleId ? 'update' : 'add'} vehicle`)
    }
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <MotionCard className="relative overflow-hidden border-2 border-blue-300 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 shadow-2xl" hover={false}>
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="h-10 w-10 text-gray-900" />
              <div>
                <h1 className="text-3xl font-black text-gray-900">Fleet Inventory</h1>
                <p className="mt-1 text-sm font-bold text-gray-900">Manage vehicles, status, and maintenance readiness</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 animate-pulse text-gray-900" />
              <RippleButton
                onClick={() => {
                  setEditingVehicleId(null)
                  setFormState(initialForm)
                  setErrors({})
                  setIsAddModalOpen(true)
                }}
                className="inline-flex items-center gap-2 border-2 border-gray-900 bg-gray-900 px-5 py-3 font-bold text-white shadow-md hover:bg-gray-800"
              >
              <Plus className="h-4 w-4" />
              Add Vehicle
              </RippleButton>
            </div>
          </div>
        </MotionCard>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
          {loading && (
            <MotionCard className="border-2 border-blue-300 bg-blue-50 lg:col-span-2 2xl:col-span-3" hover={false}>
              <p className="font-bold text-blue-700">Loading vehicles from database...</p>
            </MotionCard>
          )}

          {apiError && (
            <MotionCard className="border-2 border-red-300 bg-red-50 lg:col-span-2 2xl:col-span-3" hover={false}>
              <p className="font-bold text-red-700">{apiError}</p>
            </MotionCard>
          )}

          {vehicles.map((vehicle) => (
            <MotionCard
              key={vehicle.id}
              className={cn(
                'border-2 bg-gradient-to-br shadow-xl',
                vehicle.speed > OVERSPEED_THRESHOLD
                  ? 'border-red-400 from-red-100 via-red-50 to-white'
                  : vehicle.status === 'Active'
                    ? 'border-emerald-300 from-emerald-100 via-emerald-50 to-white'
                    : 'border-orange-300 from-orange-100 via-orange-50 to-white',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-black text-gray-900">{vehicle.name}</p>
                  <p className="text-sm font-semibold text-gray-500">{vehicle.registration}</p>
                  <p className="mt-1 text-sm font-semibold text-gray-500">{vehicle.city}</p>
                </div>
                <div
                  className={cn(
                    'rounded-xl border-2 px-3 py-1 text-xs font-black',
                    vehicle.speed > OVERSPEED_THRESHOLD
                      ? 'border-red-400 bg-red-100 text-red-700'
                      : vehicle.status === 'Active'
                        ? 'border-emerald-300 bg-emerald-100 text-emerald-700'
                        : 'border-orange-300 bg-orange-100 text-orange-700',
                  )}
                >
                  {vehicle.speed > OVERSPEED_THRESHOLD ? 'Overspeed' : vehicle.status}
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <div className={cn('mb-1 flex items-center justify-between text-xs', theme === 'light' ? 'text-slate-500' : 'text-zinc-400')}>
                    <span>{vehicle.type === 'EV' ? 'Battery' : 'Fuel'}</span>
                    <div className="flex items-center gap-2">
                      <span>{vehicle.fuel}%</span>
                      <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide', fuelStatusMeta(vehicle.fuel).className)}>
                        {fuelStatusMeta(vehicle.fuel).label}
                      </span>
                    </div>
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

                <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Gauge className="h-4 w-4 text-indigo-500" />
                  Speed: {vehicle.speed.toFixed(1)} km/h
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onVehicleView(vehicle)}
                    className="rounded-lg border-2 border-blue-300 bg-blue-100 p-2 text-blue-700 transition hover:bg-blue-200"
                    aria-label="View"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEditVehicle(vehicle)}
                    className="rounded-lg border-2 border-purple-300 bg-purple-100 p-2 text-purple-700 transition hover:bg-purple-200"
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDeleteVehicle(vehicle.id)}
                    className="rounded-lg border-2 border-red-300 bg-red-100 p-2 text-red-700 transition hover:bg-red-200"
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
        title="Vehicle Details"
        className="max-w-5xl"
      >
        {selectedVehicle && (
          <div className="space-y-5">
            {/* Basic Info Section */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className={cn('rounded-xl border p-3', theme === 'light' ? 'border-slate-200 bg-white' : 'border-white/10 bg-zinc-900/70')}>
                <p className={cn('text-xs font-semibold', theme === 'light' ? 'text-slate-500' : 'text-zinc-400')}>Vehicle Name</p>
                <p className={cn('mt-1 font-bold', theme === 'light' ? 'text-slate-900' : 'text-zinc-100')}>{selectedVehicle.name}</p>
              </div>
              <div className={cn('rounded-xl border p-3', theme === 'light' ? 'border-slate-200 bg-white' : 'border-white/10 bg-zinc-900/70')}>
                <p className={cn('text-xs font-semibold', theme === 'light' ? 'text-slate-500' : 'text-zinc-400')}>Registration</p>
                <p className={cn('mt-1 font-bold', theme === 'light' ? 'text-slate-900' : 'text-zinc-100')}>{selectedVehicle.registration}</p>
              </div>
              <div className={cn('rounded-xl border p-3', theme === 'light' ? 'border-slate-200 bg-white' : 'border-white/10 bg-zinc-900/70')}>
                <p className={cn('text-xs font-semibold', theme === 'light' ? 'text-slate-500' : 'text-zinc-400')}>Type</p>
                <p className={cn('mt-1 font-bold', theme === 'light' ? 'text-slate-900' : 'text-zinc-100')}>{selectedVehicle.type}</p>
              </div>
              <div className={cn('rounded-xl border p-3', theme === 'light' ? 'border-slate-200 bg-white' : 'border-white/10 bg-zinc-900/70')}>
                <p className={cn('text-xs font-semibold', theme === 'light' ? 'text-slate-500' : 'text-zinc-400')}>City</p>
                <p className={cn('mt-1 font-bold', theme === 'light' ? 'text-slate-900' : 'text-zinc-100')}>{selectedVehicle.city}</p>
              </div>
            </div>

            {/* Telemetry Section */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className={cn('rounded-xl border p-3', theme === 'light' ? 'border-emerald-200 bg-emerald-50' : 'border-emerald-900/30 bg-emerald-900/20')}>
                <p className={cn('text-xs font-semibold', theme === 'light' ? 'text-emerald-600' : 'text-emerald-400')}>Battery Level</p>
                <p className={cn('mt-1 text-lg font-bold', theme === 'light' ? 'text-emerald-900' : 'text-emerald-100')}>{selectedVehicle.battery}%</p>
              </div>
              <div className={cn('rounded-xl border p-3', theme === 'light' ? 'border-blue-200 bg-blue-50' : 'border-blue-900/30 bg-blue-900/20')}>
                <p className={cn('text-xs font-semibold', theme === 'light' ? 'text-blue-600' : 'text-blue-400')}>
                  {selectedVehicle.type === 'EV' ? 'Charge Level' : 'Fuel Level'}
                </p>
                <p className={cn('mt-1 text-lg font-bold', theme === 'light' ? 'text-blue-900' : 'text-blue-100')}>{selectedVehicle.fuel}%</p>
              </div>
              <div className={cn('rounded-xl border p-3', theme === 'light' ? 'border-purple-200 bg-purple-50' : 'border-purple-900/30 bg-purple-900/20')}>
                <p className={cn('text-xs font-semibold', theme === 'light' ? 'text-purple-600' : 'text-purple-400')}>Speed</p>
                <p className={cn('mt-1 text-lg font-bold', theme === 'light' ? 'text-purple-900' : 'text-purple-100')}>{selectedVehicle.speed.toFixed(1)} km/h</p>
              </div>
              <div className={cn('rounded-xl border p-3', theme === 'light' ? 'border-orange-200 bg-orange-50' : 'border-orange-900/30 bg-orange-900/20')}>
                <p className={cn('text-xs font-semibold', theme === 'light' ? 'text-orange-600' : 'text-orange-400')}>Status</p>
                <p className={cn('mt-1 text-lg font-bold', theme === 'light' ? 'text-orange-900' : 'text-orange-100')}>{selectedVehicle.status}</p>
              </div>
            </div>

            {/* Maintenance Metrics Section */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <div className={cn('rounded-xl border p-3', theme === 'light' ? 'border-slate-200 bg-white' : 'border-white/10 bg-zinc-900/70')}>
                <p className={cn('text-xs font-semibold', theme === 'light' ? 'text-slate-500' : 'text-zinc-400')}>Battery Health</p>
                <p className={cn('mt-1 font-semibold', theme === 'light' ? 'text-slate-900' : 'text-zinc-100')}>{selectedVehicle.batteryHealth}%</p>
              </div>
              <div className={cn('rounded-xl border p-3', theme === 'light' ? 'border-slate-200 bg-white' : 'border-white/10 bg-zinc-900/70')}>
                <p className={cn('text-xs font-semibold', theme === 'light' ? 'text-slate-500' : 'text-zinc-400')}>Engine Temp</p>
                <p className={cn('mt-1 font-semibold', theme === 'light' ? 'text-slate-900' : 'text-zinc-100')}>{selectedVehicle.engineTemperature}°C</p>
              </div>
              <div className={cn('rounded-xl border p-3', theme === 'light' ? 'border-slate-200 bg-white' : 'border-white/10 bg-zinc-900/70')}>
                <p className={cn('text-xs font-semibold', theme === 'light' ? 'text-slate-500' : 'text-zinc-400')}>Tire Wear</p>
                <p className={cn('mt-1 font-semibold', theme === 'light' ? 'text-slate-900' : 'text-zinc-100')}>{selectedVehicle.tireWear}%</p>
              </div>
              <div className={cn('rounded-xl border p-3', theme === 'light' ? 'border-slate-200 bg-white' : 'border-white/10 bg-zinc-900/70')}>
                <p className={cn('text-xs font-semibold', theme === 'light' ? 'text-slate-500' : 'text-zinc-400')}>Fuel Efficiency</p>
                <p className={cn('mt-1 font-semibold', theme === 'light' ? 'text-slate-900' : 'text-zinc-100')}>{selectedVehicle.fuelEfficiency.toFixed(1)} km/l</p>
              </div>
              <div className={cn('rounded-xl border p-3', theme === 'light' ? 'border-slate-200 bg-white' : 'border-white/10 bg-zinc-900/70')}>
                <p className={cn('text-xs font-semibold', theme === 'light' ? 'text-slate-500' : 'text-zinc-400')}>Distance Covered</p>
                <p className={cn('mt-1 font-semibold', theme === 'light' ? 'text-slate-900' : 'text-zinc-100')}>{selectedVehicle.distanceCovered.toFixed(1)} km</p>
              </div>
              <div className={cn('rounded-xl border p-3', theme === 'light' ? 'border-slate-200 bg-white' : 'border-white/10 bg-zinc-900/70')}>
                <p className={cn('text-xs font-semibold', theme === 'light' ? 'text-slate-500' : 'text-zinc-400')}>Driver License</p>
                <p className={cn('mt-1 font-semibold', theme === 'light' ? 'text-slate-900' : 'text-zinc-100')}>{selectedVehicle.driverLicense}</p>
              </div>
            </div>

            {/* Location Section */}
            <div className={cn('rounded-xl border p-4', theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-zinc-900/50')}>
              <p className={cn('mb-3 text-sm font-bold', theme === 'light' ? 'text-slate-700' : 'text-zinc-300')}>Vehicle Location</p>
              <div className={cn('rounded-xl border p-3 mb-3', theme === 'light' ? 'border-slate-200 bg-white' : 'border-white/10 bg-zinc-900/70')}>
                <p className={cn('text-xs font-semibold', theme === 'light' ? 'text-slate-500' : 'text-zinc-400')}>Coordinates</p>
                <p className={cn('mt-1 font-mono text-sm', theme === 'light' ? 'text-slate-900' : 'text-zinc-100')}>
                  Lat: {selectedVehicle.location[0].toFixed(6)}, Lng: {selectedVehicle.location[1].toFixed(6)}
                </p>
              </div>
              <GoogleMap
                center={selectedVehicle.location}
                markerLabel={`${selectedVehicle.name} - ${selectedVehicle.registration}`}
                className="h-[300px] w-full overflow-hidden rounded-xl"
              />
            </div>
          </div>
        )}
      </GlassModal>

      <GlassModal
        open={isAddModalOpen}
        onClose={closeVehicleFormModal}
        title={editingVehicleId ? 'Edit Vehicle' : 'Add Vehicle'}
        className="max-w-5xl"
      >
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
              {editingVehicleId ? 'Update Vehicle' : 'Submit'}
            </RippleButton>
          </div>
        </form>
      </GlassModal>

      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed right-6 top-6 z-[70] rounded-xl border border-emerald-300 bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-xl"
          >
            {successMessage}
          </motion.div>
        )}

        {overspeedVehicle && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-[60] w-full max-w-sm rounded-2xl border border-red-300 bg-red-600/95 p-5 text-white shadow-2xl"
          >
            <p className="text-sm font-semibold text-red-100">Overspeed Alert</p>
            <p className="mt-2 text-sm text-white">Vehicle: {overspeedVehicle.name}</p>
            <p className="text-sm text-red-100">Registration: {overspeedVehicle.registration}</p>
            <p className="text-sm text-red-100">Speed: {overspeedVehicle.speed.toFixed(1)} km/h (limit: {OVERSPEED_THRESHOLD} km/h)</p>
            <RippleButton onClick={() => setOverspeedVehicle(null)} variant="danger" className="mt-4 w-full">
              OK
            </RippleButton>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}

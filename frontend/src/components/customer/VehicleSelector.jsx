import { useMemo, useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../ui/cn'

const filters = ['All', 'EV', 'Petrol']

function VehicleSelector({ vehicles, selectedVehicle, onSelect }) {
  const { theme } = useTheme()
  const [filter, setFilter] = useState('All')

  const filteredVehicles = useMemo(() => {
    if (filter === 'All') {
      return vehicles
    }
    return vehicles.filter((vehicle) => vehicle.type === filter)
  }, [filter, vehicles])

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Select Vehicle</h2>

      <div className="flex flex-wrap gap-2">
        {filters.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            className={cn(
              'rounded-xl border px-3 py-1.5 text-sm font-semibold transition',
              filter === option
                ? 'border-emerald-500 bg-emerald-500 text-white'
                : theme === 'light'
                  ? 'border-emerald-200 bg-white text-emerald-700'
                  : 'border-emerald-300/40 bg-emerald-500/10 text-emerald-200',
            )}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {filteredVehicles.map((vehicle) => {
          const isSelected = selectedVehicle?.id === vehicle.id

          return (
            <button
              key={vehicle.id}
              type="button"
              onClick={() => onSelect(vehicle)}
              className={cn(
                'rounded-2xl border p-4 text-left transition',
                isSelected
                  ? 'border-emerald-500 bg-emerald-500/15'
                  : theme === 'light'
                    ? 'border-emerald-200 bg-white hover:border-emerald-300'
                    : 'border-white/15 bg-zinc-900/60 hover:border-emerald-400/40',
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{vehicle.name}</p>
                  <p className={cn('text-sm', theme === 'light' ? 'text-slate-500' : 'text-zinc-400')}>{vehicle.type}</p>
                </div>
                <p className="text-sm font-semibold text-emerald-500">₹{vehicle.price}</p>
              </div>
              <p className={cn('mt-2 text-sm', theme === 'light' ? 'text-slate-600' : 'text-zinc-300')}>{vehicle.subtitle}</p>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default VehicleSelector

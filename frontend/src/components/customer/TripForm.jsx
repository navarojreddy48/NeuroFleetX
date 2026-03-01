import { Plus } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../ui/cn'

function TripForm({ trip, onChange, onAddStop, onShowRoute }) {
  const { theme } = useTheme()

  const inputClass = cn(
    'w-full rounded-xl border px-3 py-2.5 outline-none transition focus:border-emerald-400',
    theme === 'light' ? 'border-emerald-200 bg-white text-slate-900' : 'border-white/15 bg-zinc-900/70 text-zinc-100',
  )

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Trip Details</h2>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <input
          value={trip.source}
          onChange={(event) => onChange('source', event.target.value)}
          placeholder="Enter source"
          className={inputClass}
        />

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onAddStop}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/40 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-600"
          >
            <Plus className="h-4 w-4" />
            Add Stop
          </button>
        </div>
      </div>

      {trip.stops.length > 0 && (
        <div className="space-y-2">
          {trip.stops.map((stop, index) => (
            <input
              key={`stop-${index}`}
              value={stop}
              onChange={(event) => onChange('stop', event.target.value, index)}
              placeholder={`Stop ${index + 1}`}
              className={inputClass}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <input
          value={trip.destination}
          onChange={(event) => onChange('destination', event.target.value)}
          placeholder="Enter destination"
          className={inputClass}
        />
        <button
          type="button"
          onClick={onShowRoute}
          className="rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-white"
        >
          Show Route on Map
        </button>
      </div>
    </section>
  )
}

export default TripForm

import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../ui/cn'

function DateTimeSelector({ selectedDate, selectedTime, onDateChange, onTimeChange, timeSlots }) {
  const { theme } = useTheme()

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Date & Time</h2>

      <input
        type="date"
        value={selectedDate}
        min={new Date().toISOString().split('T')[0]}
        onChange={(event) => onDateChange(event.target.value)}
        className={cn(
          'w-full rounded-xl border px-3 py-2.5 outline-none transition focus:border-emerald-400',
          theme === 'light' ? 'border-emerald-200 bg-white text-slate-900' : 'border-white/15 bg-zinc-900/70 text-zinc-100',
        )}
      />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {timeSlots.map((slot) => (
          <button
            key={slot}
            type="button"
            onClick={() => onTimeChange(slot)}
            className={cn(
              'rounded-xl border px-3 py-2 text-sm font-medium transition',
              selectedTime === slot
                ? 'border-emerald-500 bg-emerald-500 text-white'
                : theme === 'light'
                  ? 'border-emerald-200 bg-white text-slate-700 hover:border-emerald-300'
                  : 'border-white/15 bg-zinc-900/60 text-zinc-200 hover:border-emerald-400/40',
            )}
          >
            {slot}
          </button>
        ))}
      </div>
    </section>
  )
}

export default DateTimeSelector

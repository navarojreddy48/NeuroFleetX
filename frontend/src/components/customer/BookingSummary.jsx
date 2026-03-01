import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../ui/cn'

function SummaryItem({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-800 text-right">{value || '-'}</span>
    </div>
  )
}

function BookingSummary({
  trip,
  selectedRoute,
  selectedVehicle,
  selectedDate,
  selectedTime,
  onContinue,
  continueDisabled,
  buttonLabel = 'Continue',
}) {
  const { theme } = useTheme()

  return (
    <aside
      className={cn(
        'sticky top-24 h-fit rounded-2xl border p-5 shadow-lg',
        theme === 'light' ? 'border-emerald-200 bg-white' : 'border-white/15 bg-zinc-900/70',
      )}
    >
      <h3 className="text-lg font-semibold">Trip Summary</h3>

      <div className="mt-4 space-y-2">
        <SummaryItem label="From" value={trip.source} />
        <SummaryItem label="To" value={trip.destination} />
        <SummaryItem label="Selected Route" value={selectedRoute?.label} />
        <SummaryItem label="Vehicle" value={selectedVehicle?.name} />
        <SummaryItem label="Date" value={selectedDate} />
        <SummaryItem label="Time" value={selectedTime} />
      </div>

      <button
        type="button"
        disabled={continueDisabled}
        onClick={onContinue}
        className="mt-6 w-full rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {buttonLabel}
      </button>
    </aside>
  )
}

export default BookingSummary

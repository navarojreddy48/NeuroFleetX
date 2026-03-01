import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../ui/cn'

function RouteSelector({ routes, selectedRoute, onSelect }) {
  const { theme } = useTheme()

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Route Options</h2>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {routes.map((routeOption) => {
          const isSelected = selectedRoute?.id === routeOption.id

          return (
            <button
              key={routeOption.id}
              type="button"
              onClick={() => onSelect(routeOption)}
              className={cn(
                'rounded-2xl border p-4 text-left transition',
                isSelected
                  ? 'border-emerald-500 bg-emerald-500/15'
                  : theme === 'light'
                    ? 'border-emerald-200 bg-white hover:border-emerald-300'
                    : 'border-white/15 bg-zinc-900/60 hover:border-emerald-400/40',
              )}
            >
              <p className="font-semibold text-emerald-500">{routeOption.label}</p>
              <p className={cn('mt-1 text-sm', theme === 'light' ? 'text-slate-600' : 'text-zinc-300')}>{routeOption.description}</p>
              <div className="mt-3 flex items-center justify-between text-sm font-medium">
                <span>{routeOption.distance}</span>
                <span>{routeOption.duration}</span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default RouteSelector

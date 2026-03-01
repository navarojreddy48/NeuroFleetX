import { NavLink } from 'react-router-dom'

const navLinks = [
  { to: '/driver/dashboard', label: 'Dashboard' },
  { to: '/driver/live-tracking', label: 'Live Tracking' },
  { to: '/driver/trips', label: 'Trips' },
  { to: '/driver/earnings', label: 'Earnings' },
  { to: '/driver/profile', label: 'Profile' },
  { to: '/driver/settings', label: 'Settings' },
]

function DriverTopNav({ name, role, avatarInitial }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="mr-2 text-lg font-bold tracking-tight text-slate-900">NeuroFleetX</div>

        <nav className="order-3 flex w-full items-center gap-1 overflow-x-auto pb-1 sm:order-none sm:w-auto sm:flex-1 sm:justify-center sm:pb-0">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition',
                  isActive
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">{name}</p>
            <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              {role}
            </span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
            {avatarInitial}
          </div>
        </div>
      </div>
    </header>
  )
}

export default DriverTopNav

import { Plus, AlertTriangle } from 'lucide-react'
import { alertRows } from '../../data/mockData'
import { SeverityBadge } from '../../components/SeverityBadge'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../ui/cn'
import { MotionCard } from '../../ui/MotionCard'
import { PageTransition } from '../../ui/PageTransition'
import { RippleButton } from '../../ui/RippleButton'

export const AlertsPage = () => {
  const { theme } = useTheme()

  return (
    <PageTransition>
      <div className="space-y-6">
        <MotionCard className="border-2 border-orange-300 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 shadow-2xl" hover={false}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-10 w-10 text-gray-900" />
              <div>
                <h1 className="text-3xl font-black text-gray-900">Alerts</h1>
                <p className="mt-1 text-sm font-bold text-gray-900">Monitor and manage fleet alerts</p>
              </div>
            </div>
            <RippleButton className="inline-flex items-center gap-2 border-2 border-gray-900 bg-gray-900 px-4 py-2 font-bold text-white shadow-md hover:bg-gray-800">
              <Plus className="h-4 w-4" />
              Add Alert
            </RippleButton>
          </div>
        </MotionCard>

        <div
          className={cn(
            'overflow-hidden rounded-2xl border shadow-xl',
            theme === 'light'
              ? 'border-slate-200 bg-white'
              : 'border-white/10 bg-zinc-900/70',
          )}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className={cn(theme === 'light' ? 'bg-slate-100 text-slate-700' : 'bg-zinc-800/80 text-zinc-300')}>
                <tr>
                  <th className="px-4 py-3 text-left">Vehicle Reg No</th>
                  <th className="px-4 py-3 text-left">Issue</th>
                  <th className="px-4 py-3 text-left">Severity</th>
                  <th className="px-4 py-3 text-left">Action Needed</th>
                </tr>
              </thead>
              <tbody>
                {alertRows.map((row) => (
                  <tr
                    key={row.regNo + row.issue}
                    className={cn(
                      'border-t transition',
                      theme === 'light'
                        ? 'border-slate-100 hover:bg-slate-50'
                        : 'border-white/5 hover:bg-white/5',
                    )}
                  >
                    <td className={cn('whitespace-nowrap px-4 py-3', theme === 'light' ? 'text-slate-900' : 'text-zinc-100')}>{row.regNo}</td>
                    <td className={cn('px-4 py-3', theme === 'light' ? 'text-slate-700' : 'text-zinc-300')}>{row.issue}</td>
                    <td className="px-4 py-3">
                      <SeverityBadge severity={row.severity as 'CRITICAL' | 'MEDIUM' | 'NORMAL'} />
                    </td>
                    <td className={cn('px-4 py-3', theme === 'light' ? 'text-slate-500' : 'text-zinc-400')}>{row.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

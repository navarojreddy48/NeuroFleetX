import { useMemo, useState } from 'react'
import { tripFilterOptions, tripRecords } from '../../data/driverMockData'

function Trips() {
  const [activeFilter, setActiveFilter] = useState('Today')

  const filteredTrips = useMemo(() => {
    if (activeFilter === 'This Month') {
      return tripRecords
    }

    return tripRecords.filter((trip) => trip.bucket === activeFilter || trip.bucket === 'Today')
  }, [activeFilter])

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold text-slate-900">Trips</h1>
        <p className="mt-1 text-sm text-slate-600">Track all your recent and ongoing rides</p>
      </section>

      <section className="flex flex-wrap gap-2">
        {tripFilterOptions.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={[
              'rounded-lg px-3 py-2 text-sm font-medium transition',
              activeFilter === filter
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-white text-slate-600 hover:bg-slate-100',
            ].join(' ')}
          >
            {filter}
          </button>
        ))}
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Pickup</th>
                <th className="px-4 py-3 font-semibold">Drop</th>
                <th className="px-4 py-3 font-semibold">Distance</th>
                <th className="px-4 py-3 font-semibold">Fare</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTrips.map((trip) => (
                <tr key={trip.id} className="text-slate-700">
                  <td className="px-4 py-3">{trip.date}</td>
                  <td className="px-4 py-3">{trip.pickup}</td>
                  <td className="px-4 py-3">{trip.drop}</td>
                  <td className="px-4 py-3">{trip.distance}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{trip.fare}</td>
                  <td className="px-4 py-3">
                    <span
                      className={[
                        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
                        trip.status === 'Completed' && 'bg-emerald-100 text-emerald-700',
                        trip.status === 'Ongoing' && 'bg-blue-100 text-blue-700',
                        trip.status === 'Cancelled' && 'bg-rose-100 text-rose-700',
                      ].join(' ')}
                    >
                      {trip.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default Trips

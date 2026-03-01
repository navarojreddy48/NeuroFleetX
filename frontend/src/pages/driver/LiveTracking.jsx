import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet'
import {
  destinationPosition,
  driverPosition,
  liveTrackingStats,
  nextInstruction,
  routeCoordinates,
  routeInfo,
} from '../../data/driverMockData'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

function LiveTracking() {
  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Live Tracking</h1>
          <p className="mt-1 text-sm text-slate-600">Real-time navigation and route monitoring</p>
        </div>

        <button
          type="button"
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
        >
          Pause
        </button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {liveTrackingStats.map((item) => (
          <article key={item.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">{item.label}</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-2">
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <MapContainer
              center={[23.2599, 77.4126]}
              zoom={13}
              scrollWheelZoom
              className="h-[480px] w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <Marker position={driverPosition} />
              <Marker position={destinationPosition} />
              <Polyline
                positions={routeCoordinates}
                pathOptions={{ color: '#2563eb', dashArray: '8 10', weight: 4, opacity: 0.9 }}
              />
            </MapContainer>
          </div>
        </article>

        <aside className="space-y-4">
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Route Information</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <p>
                <span className="font-medium text-slate-900">Route Type:</span> {routeInfo.routeType}
              </p>
              <p>
                <span className="font-medium text-slate-900">Total Distance:</span> {routeInfo.totalDistance}
              </p>
              <p>
                <span className="font-medium text-slate-900">Estimated Time:</span> {routeInfo.estimatedTime}
              </p>
            </div>
          </article>

          <article className="rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Next Instructions</h2>
            <p className="mt-3 text-sm font-medium text-blue-800">{nextInstruction.current}</p>
            <p className="mt-2 text-sm text-blue-700">{nextInstruction.preview}</p>
          </article>
        </aside>
      </section>
    </div>
  )
}

export default LiveTracking

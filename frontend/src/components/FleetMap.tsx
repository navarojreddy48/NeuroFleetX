import L from 'leaflet'
import {
  LeafletSuspense,
  LazyCircle as Circle,
  LazyMapContainer as MapContainer,
  LazyMarker as Marker,
  LazyPopup as Popup,
  LazyTileLayer as TileLayer,
} from './leaflet/LazyReactLeaflet'

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

type CircleZone = {
  id: number
  center: [number, number]
  radius: number
  color: string
}

type FleetMapProps = {
  center: [number, number]
  zoom?: number
  markerLabel?: string
  circles?: CircleZone[]
  className?: string
}

export const FleetMap = ({
  center,
  zoom = 10,
  markerLabel = 'Vehicle Location',
  circles,
  className,
}: FleetMapProps) => {
  // Validate center coordinates
  if (!center || !Array.isArray(center) || center.length !== 2 || typeof center[0] !== 'number' || typeof center[1] !== 'number') {
    return (
      <div className={className ?? 'h-[320px] w-full overflow-hidden rounded-2xl'}>
        <div className="flex h-full items-center justify-center bg-slate-100 dark:bg-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-400">Invalid map coordinates</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className ?? 'h-[320px] w-full overflow-hidden rounded-2xl'}>
      <LeafletSuspense fallbackClassName="h-full w-full animate-pulse bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
        <MapContainer center={center} zoom={zoom} className="h-full w-full rounded-2xl">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={center} icon={markerIcon}>
            <Popup>{markerLabel}</Popup>
          </Marker>

          {circles?.map((zone) => (
            <Circle
              key={zone.id}
              center={zone.center}
              radius={zone.radius}
              pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.25 }}
            />
          ))}
        </MapContainer>
      </LeafletSuspense>
    </div>
  )
}

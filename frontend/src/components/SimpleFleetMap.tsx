import L from 'leaflet'
import { MapContainer, Marker, Popup, Circle, TileLayer } from 'react-leaflet'

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

type SimpleFleetMapProps = {
  center: [number, number]
  zoom?: number
  markerLabel?: string
  circles?: CircleZone[]
  className?: string
}

export const SimpleFleetMap = ({
  center,
  zoom = 10,
  markerLabel = 'Vehicle Location',
  circles,
  className,
}: SimpleFleetMapProps) => {
  return (
    <div className={className ?? 'h-[320px] w-full overflow-hidden rounded-2xl'}>
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
    </div>
  )
}

type GoogleMapProps = {
  center: [number, number]
  zoom?: number
  markerLabel?: string
  className?: string
}

export const GoogleMap = ({ center, markerLabel = 'Vehicle Location', className }: GoogleMapProps) => {
  // Use OpenStreetMap embed which requires no API key
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${center[1]-0.01},${center[0]-0.01},${center[1]+0.01},${center[0]+0.01}&layer=mapnik&marker=${center[0]},${center[1]}`

  return (
    <iframe
      src={osmUrl}
      className={className ?? 'h-[320px] w-full rounded-2xl border-0'}
      loading="lazy"
      title={markerLabel}
    />
  )
}

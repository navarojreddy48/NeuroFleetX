import { useEffect } from 'react'
import L from 'leaflet'
import { useMap } from 'react-leaflet'

function HeatmapLayer({ points }) {
  const map = useMap()

  useEffect(() => {
    if (!map || !Array.isArray(points) || points.length === 0) {
      return
    }

    let heatLayer = null
    let cancelled = false

    const attachLayer = async () => {
      if (!L.heatLayer) {
        await import('leaflet.heat')
      }

      console.log('Heat plugin loaded:', L.heatLayer)

      if (cancelled || !L.heatLayer) {
        return
      }

      map.whenReady(() => {
        if (cancelled) {
          return
        }

        heatLayer = L.heatLayer(points, {
          radius: 40,
          blur: 30,
          maxZoom: 17,
          gradient: {
            0.2: '#22c55e',
            0.4: '#84cc16',
            0.6: '#facc15',
            0.8: '#f97316',
            1.0: '#ef4444',
          },
        })

        heatLayer.addTo(map)
      })
    }

    attachLayer()

    return () => {
      cancelled = true
      if (heatLayer && map.hasLayer(heatLayer)) {
        map.removeLayer(heatLayer)
      }
    }
  }, [map, points])

  return null
}

export default HeatmapLayer
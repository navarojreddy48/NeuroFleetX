import { lazy, Suspense } from 'react'
import type { ComponentType, ReactNode } from 'react'

const importLeafletComponent = async (componentName: string) => {
  const leaflet = await import('react-leaflet')
  return { default: leaflet[componentName as keyof typeof leaflet] as ComponentType<any> }
}

export const LazyMapContainer = lazy(() => importLeafletComponent('MapContainer'))
export const LazyTileLayer = lazy(() => importLeafletComponent('TileLayer'))
export const LazyMarker = lazy(() => importLeafletComponent('Marker'))
export const LazyPopup = lazy(() => importLeafletComponent('Popup'))
export const LazyCircle = lazy(() => importLeafletComponent('Circle'))
export const LazyPolyline = lazy(() => importLeafletComponent('Polyline'))

type LeafletSuspenseProps = {
  children: ReactNode
  fallbackClassName?: string
}

export const LeafletSuspense = ({
  children,
  fallbackClassName = 'h-full w-full animate-pulse bg-emerald-100/60 dark:bg-slate-800/50',
}: LeafletSuspenseProps) => {
  return <Suspense fallback={<div className={fallbackClassName} />}>{children}</Suspense>
}
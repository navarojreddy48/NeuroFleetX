declare module 'react-leaflet' {
  import type { CSSProperties, FC, ReactNode } from 'react'

  export type LatLngExpression = [number, number]

  export type MapContainerProps = {
    center: LatLngExpression
    zoom: number
    className?: string
    style?: CSSProperties
    children?: ReactNode
  }

  export const MapContainer: FC<MapContainerProps>

  export type TileLayerProps = {
    attribution?: string
    url: string
  }

  export const TileLayer: FC<TileLayerProps>

  export type MarkerProps = {
    position: LatLngExpression
    icon?: unknown
    children?: ReactNode
  }

  export const Marker: FC<MarkerProps>

  export type PopupProps = {
    children?: ReactNode
  }

  export const Popup: FC<PopupProps>

  export type CircleProps = {
    center: LatLngExpression
    radius: number
    pathOptions?: {
      color?: string
      fillColor?: string
      fillOpacity?: number
    }
  }

  export const Circle: FC<CircleProps>
}

declare module 'leaflet' {
  type IconOptions = {
    iconUrl: string
    iconRetinaUrl?: string
    shadowUrl?: string
    iconSize?: [number, number]
    iconAnchor?: [number, number]
  }

  export class Icon {
    constructor(options: IconOptions)
  }

  const L: {
    Icon: typeof Icon
  }

  export default L
}

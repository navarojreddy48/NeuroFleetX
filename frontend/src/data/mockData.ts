export type FleetVehicle = {
  id: string
  name: string
  registration: string
  city: string
  fuel: number
  speed: number
  type: 'EV' | 'Diesel'
  battery: number
  status: 'Idle' | 'Active' | 'Available' | 'In Use' | 'Maintenance'
  driverLicense: string
  engineTemperature: number
  tireWear: number
  batteryHealth: number
  fuelEfficiency: number
  distanceCovered: number
  location: [number, number]
}

export const weeklyTrips = [
  { day: 'Mon', trips: 140 },
  { day: 'Tue', trips: 158 },
  { day: 'Wed', trips: 170 },
  { day: 'Thu', trips: 182 },
  { day: 'Fri', trips: 210 },
  { day: 'Sat', trips: 168 },
  { day: 'Sun', trips: 150 },
]

export const vehicleUsageData = [
  { name: 'In Service', value: 58 },
  { name: 'Idle', value: 22 },
  { name: 'Maintenance', value: 12 },
  { name: 'Charging', value: 8 },
]

export const fleetVehicles: FleetVehicle[] = [
  {
    id: 'VH-101',
    name: 'Ashok Leyland AVTR',
    registration: 'KA-01-MN-4582',
    city: 'Bengaluru',
    fuel: 72,
    speed: 86,
    type: 'Diesel',
    battery: 0,
    status: 'Active',
    driverLicense: 'DL-9821-445',
    engineTemperature: 92,
    tireWear: 34,
    batteryHealth: 0,
    fuelEfficiency: 13.8,
    distanceCovered: 134820,
    location: [12.9716, 77.5946],
  },
  {
    id: 'VH-102',
    name: 'Tata Prima E.55S',
    registration: 'MH-12-TR-2291',
    city: 'Pune',
    fuel: 48,
    speed: 108,
    type: 'EV',
    battery: 61,
    status: 'Active',
    driverLicense: 'DL-2193-672',
    engineTemperature: 88,
    tireWear: 22,
    batteryHealth: 84,
    fuelEfficiency: 0,
    distanceCovered: 76210,
    location: [18.5204, 73.8567],
  },
  {
    id: 'VH-103',
    name: 'Mahindra Blazo X',
    registration: 'DL-08-KA-9033',
    city: 'Delhi',
    fuel: 31,
    speed: 72,
    type: 'Diesel',
    battery: 0,
    status: 'Idle',
    driverLicense: 'DL-6723-199',
    engineTemperature: 85,
    tireWear: 39,
    batteryHealth: 0,
    fuelEfficiency: 12.9,
    distanceCovered: 201440,
    location: [28.6139, 77.209],
  },
  {
    id: 'VH-104',
    name: 'Eicher Pro 3019',
    registration: 'TN-22-FD-5538',
    city: 'Chennai',
    fuel: 65,
    speed: 94,
    type: 'Diesel',
    battery: 0,
    status: 'Active',
    driverLicense: 'DL-1766-928',
    engineTemperature: 90,
    tireWear: 19,
    batteryHealth: 0,
    fuelEfficiency: 14.4,
    distanceCovered: 118060,
    location: [13.0827, 80.2707],
  },
]

export const alertRows = [
  {
    regNo: 'KA-01-MN-4582',
    issue: 'Brake sensor anomaly',
    severity: 'CRITICAL',
    action: 'Dispatch maintenance immediately',
  },
  {
    regNo: 'MH-12-TR-2291',
    issue: 'Overspeed detected',
    severity: 'MEDIUM',
    action: 'Driver coaching required',
  },
  {
    regNo: 'TN-22-FD-5538',
    issue: 'Scheduled service due',
    severity: 'NORMAL',
    action: 'Book service slot this week',
  },
  {
    regNo: 'DL-08-KA-9033',
    issue: 'Tire wear above threshold',
    severity: 'MEDIUM',
    action: 'Inspect tire set in 48 hours',
  },
]

export const routeOptimizationMapCenter: [number, number] = [20.5937, 78.9629]

export const trafficZones = [
  { id: 1, center: [19.076, 72.8777] as [number, number], radius: 4500, color: '#ef4444' },
  { id: 2, center: [28.6139, 77.209] as [number, number], radius: 4200, color: '#f59e0b' },
  { id: 3, center: [13.0827, 80.2707] as [number, number], radius: 3600, color: '#22c55e' },
]

export const congestionAlerts = [
  { id: 'A-01', level: 'HIGH', area: 'Mumbai Western Corridor' },
  { id: 'A-02', level: 'MEDIUM', area: 'Delhi Ring Road' },
  { id: 'A-03', level: 'BLOCK', area: 'Chennai Port Access Lane' },
]

export const peakHourPredictions = [
  { time: '08:00', value: 86 },
  { time: '12:00', value: 64 },
  { time: '17:00', value: 92 },
  { time: '20:00', value: 51 },
]

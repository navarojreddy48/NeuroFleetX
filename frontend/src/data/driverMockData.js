export const driverIdentity = {
  name: 'Sucharit Saha',
  role: 'Driver',
  avatarInitial: 'S',
}

export const driverDashboardStats = [
  { key: 'todayTrips', label: "Today's Trips", value: '8', tone: 'neutral' },
  { key: 'todayEarnings', label: "Today's Earnings", value: '₹1,850', tone: 'green' },
  { key: 'distanceCovered', label: 'Distance Covered', value: '124 km', tone: 'neutral' },
  { key: 'completedTrips', label: 'Completed Trips', value: '540', tone: 'neutral' },
  { key: 'acceptanceRate', label: 'Acceptance Rate', value: '92%', tone: 'neutral' },
  { key: 'driverRating', label: 'Driver Rating', value: '4.6 ⭐⭐⭐⭐⭐', tone: 'lightGreen' },
]

export const performanceSummary =
  'Great job! Your acceptance rate is above average and your customer rating is excellent. Keep maintaining consistent performance to unlock weekly incentives.'

export const liveTrackingStats = [
  { label: 'ETA', value: '13 min' },
  { label: 'Distance Remaining', value: '4.1 km' },
  { label: 'Route', value: 'Fastest Route' },
  { label: 'Status', value: 'On Route' },
]

export const routeInfo = {
  routeType: 'Fastest Route',
  totalDistance: '5.1 km',
  estimatedTime: '14 mins',
}

export const nextInstruction = {
  current: 'In 200m – Turn right onto Station Road',
  preview: 'Then continue straight for 1.3 km toward MP Nagar.',
}

export const routeCoordinates = [
  [23.2599, 77.4126],
  [23.2625, 77.418],
  [23.2662, 77.425],
  [23.271, 77.432],
]

export const driverPosition = routeCoordinates[1]
export const destinationPosition = routeCoordinates[routeCoordinates.length - 1]

export const tripFilterOptions = ['Today', 'This Week', 'This Month']

export const tripRecords = [
  {
    id: 1,
    date: '2026-03-01',
    pickup: 'MP Nagar Zone 1',
    drop: 'Habibganj Station',
    distance: '7.2 km',
    fare: '₹280',
    status: 'Completed',
    bucket: 'Today',
  },
  {
    id: 2,
    date: '2026-03-01',
    pickup: 'New Market',
    drop: 'BHEL Gate 3',
    distance: '9.1 km',
    fare: '₹340',
    status: 'Ongoing',
    bucket: 'Today',
  },
  {
    id: 3,
    date: '2026-02-28',
    pickup: 'Ashoka Garden',
    drop: 'ISBT Bhopal',
    distance: '5.8 km',
    fare: '₹215',
    status: 'Completed',
    bucket: 'This Week',
  },
  {
    id: 4,
    date: '2026-02-26',
    pickup: 'Lalghati',
    drop: 'DB Mall',
    distance: '6.4 km',
    fare: '₹245',
    status: 'Cancelled',
    bucket: 'This Week',
  },
  {
    id: 5,
    date: '2026-02-17',
    pickup: 'Kolar Road',
    drop: 'AIIMS Bhopal',
    distance: '10.5 km',
    fare: '₹390',
    status: 'Completed',
    bucket: 'This Month',
  },
]

export const earningsStats = [
  { label: 'Today Earnings', value: '₹1,850' },
  { label: 'Weekly Earnings', value: '₹11,760' },
  { label: 'Monthly Earnings', value: '₹46,320' },
  { label: 'Incentives Earned', value: '₹4,500' },
]

export const last7DaysEarnings = [
  { day: 'Mon', amount: 1450 },
  { day: 'Tue', amount: 1720 },
  { day: 'Wed', amount: 1680 },
  { day: 'Thu', amount: 1900 },
  { day: 'Fri', amount: 2050 },
  { day: 'Sat', amount: 2160 },
  { day: 'Sun', amount: 1850 },
]

export const monthlyEarningsTrend = [
  { month: 'Oct', amount: 38900 },
  { month: 'Nov', amount: 41200 },
  { month: 'Dec', amount: 43800 },
  { month: 'Jan', amount: 45550 },
  { month: 'Feb', amount: 46320 },
]

export const driverProfile = {
  name: 'Sucharit Saha',
  phone: '+91 98765 43210',
  email: 'sucharit.saha@neurofleetx.com',
  licenseNumber: 'WB-DRV-2020-99871',
  vehicleAssigned: 'Tata Nexon EV - NFX-DR-118',
}

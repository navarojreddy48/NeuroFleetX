import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const BOOKINGS_KEY = 'customerBookings'
const SELECTED_TRIP_KEY = 'customerSelectedTrip'
const SELECTED_ROUTE_KEY = 'customerSelectedRoute'
const SELECTED_VEHICLE_KEY = 'customerSelectedVehicle'
const SELECTED_DATE_KEY = 'customerSelectedDate'
const SELECTED_TIME_KEY = 'customerSelectedTime'

const defaultBookings = [
  {
    id: 'BK-420381',
    route: { source: 'Bengaluru', destination: 'Mysuru', distance: '146 km', duration: '3h 20m' },
    date: '2026-03-04',
    time: '08:30',
    vehicle: { name: 'Urban EV Prime', type: 'EV' },
    status: 'Upcoming',
    pricing: { basePrice: 540, timeMultiplier: 1.1, totalPrice: 594 },
  },
  {
    id: 'BK-420144',
    route: { source: 'Pune', destination: 'Mumbai', distance: '149 km', duration: '3h 05m' },
    date: '2026-02-26',
    time: '16:00',
    vehicle: { name: 'City Petrol Comfort', type: 'Petrol' },
    status: 'Completed',
    pricing: { basePrice: 780, timeMultiplier: 1.2, totalPrice: 936 },
  },
]

const parseStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const normalizeRole = (roleValue) =>
  String(roleValue || '')
    .toLowerCase()
    .replace(/[_\s-]+/g, '')

const CustomerContext = createContext(null)

export const CustomerProvider = ({ children }) => {
  const [user, setUser] = useState(() => ({
    name: localStorage.getItem('authName') || 'Customer',
    email: localStorage.getItem('authEmail') || 'customer@neurofleet.ai',
    gender: localStorage.getItem('authGender') || 'Not Available',
    companyName: localStorage.getItem('authCompanyName') || 'Not Available',
  }))

  const [role, setRole] = useState(() => {
    const roleValue = localStorage.getItem('role') || localStorage.getItem('authRole')
    return normalizeRole(roleValue)
  })

  const [bookings, setBookings] = useState(() => parseStorage(BOOKINGS_KEY, defaultBookings))
  const [selectedTrip, setSelectedTrip] = useState(() =>
    parseStorage(SELECTED_TRIP_KEY, { source: '', stops: [], destination: '' }),
  )
  const [selectedRoute, setSelectedRoute] = useState(() => parseStorage(SELECTED_ROUTE_KEY, null))
  const [selectedVehicle, setSelectedVehicle] = useState(() => parseStorage(SELECTED_VEHICLE_KEY, null))
  const [selectedDate, setSelectedDate] = useState(() => localStorage.getItem(SELECTED_DATE_KEY) || '')
  const [selectedTime, setSelectedTime] = useState(() => localStorage.getItem(SELECTED_TIME_KEY) || '')

  useEffect(() => {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))
  }, [bookings])

  useEffect(() => {
    localStorage.setItem(SELECTED_TRIP_KEY, JSON.stringify(selectedTrip))
  }, [selectedTrip])

  useEffect(() => {
    localStorage.setItem(SELECTED_ROUTE_KEY, JSON.stringify(selectedRoute))
  }, [selectedRoute])

  useEffect(() => {
    localStorage.setItem(SELECTED_VEHICLE_KEY, JSON.stringify(selectedVehicle))
  }, [selectedVehicle])

  useEffect(() => {
    localStorage.setItem(SELECTED_DATE_KEY, selectedDate)
  }, [selectedDate])

  useEffect(() => {
    localStorage.setItem(SELECTED_TIME_KEY, selectedTime)
  }, [selectedTime])

  useEffect(() => {
    const authName = localStorage.getItem('authName')
    const authEmail = localStorage.getItem('authEmail')
    const authGender = localStorage.getItem('authGender')
    const authCompanyName = localStorage.getItem('authCompanyName')
    const authRole = localStorage.getItem('role') || localStorage.getItem('authRole')

    setUser((current) => ({
      ...current,
      name: authName || current.name,
      email: authEmail || current.email,
      gender: authGender || current.gender,
      companyName: authCompanyName || current.companyName,
    }))

    setRole(normalizeRole(authRole))
  }, [])

  const addBooking = (booking) => {
    setBookings((current) => [booking, ...current])
  }

  const cancelBooking = (bookingId) => {
    setBookings((current) =>
      current.map((booking) =>
        booking.id === bookingId && booking.status === 'Upcoming'
          ? { ...booking, status: 'Cancelled' }
          : booking,
      ),
    )
  }

  const setPlannerState = ({ trip, routeOption, vehicleOption, date, time }) => {
    setSelectedTrip(trip)
    setSelectedRoute(routeOption)
    setSelectedVehicle(vehicleOption)
    setSelectedDate(date)
    setSelectedTime(time)
  }

  const clearSession = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('authToken')
    localStorage.removeItem('authRole')
    localStorage.removeItem('authName')
    localStorage.removeItem('authEmail')
    localStorage.removeItem('authGender')
    localStorage.removeItem('authCompanyName')
  }

  const value = useMemo(
    () => ({
      user,
      setUser,
      role,
      setRole,
      bookings,
      setBookings,
      addBooking,
      cancelBooking,
      selectedTrip,
      setSelectedTrip,
      selectedVehicle,
      setSelectedVehicle,
      selectedRoute,
      setSelectedRoute,
      selectedDate,
      setSelectedDate,
      selectedTime,
      setSelectedTime,
      setPlannerState,
      clearSession,
    }),
    [
      user,
      role,
      bookings,
      selectedTrip,
      selectedVehicle,
      selectedRoute,
      selectedDate,
      selectedTime,
    ],
  )

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>
}

export const useCustomer = () => {
  const context = useContext(CustomerContext)
  if (!context) {
    throw new Error('useCustomer must be used within CustomerProvider')
  }
  return context
}

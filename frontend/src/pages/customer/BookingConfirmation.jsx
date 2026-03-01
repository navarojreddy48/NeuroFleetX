import { motion } from 'framer-motion'
import { CheckCircle2, Download, Loader2, Printer } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCustomer } from '../../context/CustomerContext'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../ui/cn'

const getTimeMultiplier = (timeValue) => {
  if (!timeValue) {
    return 1
  }

  const hour = Number(timeValue.split(':')[0])
  if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20)) {
    return 1.2
  }
  return 1
}

function BookingConfirmation() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { addBooking, selectedTrip, selectedRoute, selectedVehicle, selectedDate, selectedTime } = useCustomer()
  const [isLoading, setIsLoading] = useState(true)
  const [booking, setBooking] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const createdRef = useRef(false)

  useEffect(() => {
    const incomplete = !selectedTrip?.source || !selectedTrip?.destination || !selectedRoute || !selectedVehicle || !selectedDate || !selectedTime

    if (incomplete) {
      navigate('/customer/plan', { replace: true })
      return
    }

    const timer = window.setTimeout(() => {
      const basePrice = selectedRoute.basePrice || selectedVehicle.price || 500
      const timeMultiplier = getTimeMultiplier(selectedTime)
      const totalPrice = Math.round(basePrice * timeMultiplier)
      const bookingId = `BK-${Date.now().toString().slice(-6)}`

      const nextBooking = {
        id: bookingId,
        route: {
          source: selectedTrip.source,
          destination: selectedTrip.destination,
          distance: selectedRoute.distance,
          duration: selectedRoute.duration,
        },
        date: selectedDate,
        time: selectedTime,
        vehicle: {
          name: selectedVehicle.name,
          type: selectedVehicle.type,
        },
        status: 'Upcoming',
        pricing: {
          basePrice,
          timeMultiplier,
          totalPrice,
        },
      }

      if (!createdRef.current) {
        addBooking(nextBooking)
        createdRef.current = true
      }

      setBooking(nextBooking)
      setIsLoading(false)
      setShowToast(true)

      window.setTimeout(() => {
        setShowToast(false)
      }, 2400)
    }, 1100)

    return () => window.clearTimeout(timer)
  }, [addBooking, navigate, selectedDate, selectedRoute, selectedTime, selectedTrip, selectedVehicle])

  if (isLoading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-white px-5 py-3 text-emerald-700 shadow-md">
          <Loader2 className="h-5 w-5 animate-spin" />
          Confirming your booking...
        </div>
      </div>
    )
  }

  if (!booking) {
    return null
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={cn(
          'rounded-2xl border p-6 shadow-lg',
          theme === 'light' ? 'border-emerald-200 bg-emerald-50/45' : 'border-white/10 bg-slate-900/60',
        )}
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-1 h-8 w-8 text-emerald-500" />
          <div>
            <h1 className="text-2xl font-semibold">Booking Confirmed</h1>
            <p className={cn('mt-1 text-sm', theme === 'light' ? 'text-slate-600' : 'text-zinc-300')}>
              Your booking ID is <span className="font-semibold text-emerald-600">{booking.id}</span>
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className={cn('rounded-2xl border p-5', theme === 'light' ? 'border-emerald-200 bg-white' : 'border-white/10 bg-zinc-900/60')}>
          <h2 className="text-lg font-semibold">Booking Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <p><span className="text-slate-500">Route:</span> {booking.route.source} → {booking.route.destination}</p>
            <p><span className="text-slate-500">Distance:</span> {booking.route.distance}</p>
            <p><span className="text-slate-500">Duration:</span> {booking.route.duration}</p>
            <p><span className="text-slate-500">Vehicle:</span> {booking.vehicle.name} ({booking.vehicle.type})</p>
            <p><span className="text-slate-500">Date:</span> {booking.date}</p>
            <p><span className="text-slate-500">Time:</span> {booking.time}</p>
          </div>
        </div>

        <div className={cn('rounded-2xl border p-5', theme === 'light' ? 'border-emerald-200 bg-white' : 'border-white/10 bg-zinc-900/60')}>
          <h2 className="text-lg font-semibold">Pricing Details</h2>
          <div className="mt-4 space-y-2 text-sm">
            <p><span className="text-slate-500">Base price:</span> ₹{booking.pricing.basePrice}</p>
            <p><span className="text-slate-500">Time multiplier:</span> {booking.pricing.timeMultiplier}x</p>
            <p className="pt-2 text-base font-semibold text-emerald-600">Total price: ₹{booking.pricing.totalPrice}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-400"
            >
              <Download className="h-4 w-4" />
              Download PDF (Soon)
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate('/customer/dashboard')}
        className="rounded-xl border border-emerald-300 bg-white px-5 py-2.5 font-semibold text-emerald-700"
      >
        Back to Dashboard
      </button>

      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg">
          Booking created successfully
        </div>
      )}
    </div>
  )
}

export default BookingConfirmation

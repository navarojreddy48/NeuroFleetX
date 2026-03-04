import { CheckCircle2, Download, Loader2, Printer, MapPin, Calendar, Clock, Car, DollarSign, ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCustomer } from '../../context/CustomerContext'
import { MotionCard } from '../../ui/MotionCard'
import { RippleButton } from '../../ui/RippleButton'

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
  const { addBooking, selectedTrip, selectedRoute, selectedVehicle, selectedDate, selectedTime } = useCustomer()
  const [isLoading, setIsLoading] = useState(true)
  const [booking, setBooking] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const createdRef = useRef(false)

  useEffect(() => {
    const incomplete =
      !selectedTrip?.source ||
      !selectedTrip?.destination ||
      !selectedRoute ||
      !selectedVehicle ||
      !selectedDate ||
      !selectedTime

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
        <MotionCard className="border-2 border-emerald-400 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-xl">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            <span className="text-base font-bold text-emerald-700">Confirming your booking...</span>
          </div>
        </MotionCard>
      </div>
    )
  }

  if (!booking) {
    return null
  }

  return (
    <div className="space-y-6">
      <MotionCard
        className="border-2 border-emerald-300 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 shadow-2xl"
        hover={false}
      >
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-12 w-12 text-gray-900" />
          <div>
            <h1 className="text-3xl font-black text-gray-900">Booking Confirmed!</h1>
            <p className="mt-1 text-sm font-bold text-gray-900">
              Your booking ID is <span className="rounded bg-white/30 px-2 py-0.5 font-black">{booking.id}</span>
            </p>
          </div>
        </div>
      </MotionCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MotionCard className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
          <h2 className="mb-4 text-xl font-black text-gray-900">Booking Summary</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm">
              <MapPin className="mt-1 h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-xs font-semibold text-gray-600">Route</p>
                <p className="text-sm font-bold text-gray-900">
                  {booking.route.source} → {booking.route.destination}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
              <ArrowRight className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-xs font-semibold text-gray-600">Distance & Duration</p>
                <p className="text-sm font-bold text-gray-900">
                  {booking.route.distance} • {booking.route.duration}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
              <Car className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-xs font-semibold text-gray-600">Vehicle</p>
                <p className="text-sm font-bold text-gray-900">
                  {booking.vehicle.name} ({booking.vehicle.type})
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-xs font-semibold text-gray-600">Date</p>
                <p className="text-sm font-bold text-gray-900">{booking.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
              <Clock className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-xs font-semibold text-gray-600">Time</p>
                <p className="text-sm font-bold text-gray-900">{booking.time}</p>
              </div>
            </div>
          </div>
        </MotionCard>

        <MotionCard className="bg-gradient-to-br from-green-50 to-green-100 shadow-lg">
          <h2 className="mb-4 text-xl font-black text-gray-900">Pricing Details</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-xs font-semibold text-gray-600">Base price</p>
                <p className="text-sm font-bold text-gray-900">₹{booking.pricing.basePrice}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-xs font-semibold text-gray-600">Time multiplier</p>
                <p className="text-sm font-bold text-gray-900">{booking.pricing.timeMultiplier}x</p>
              </div>
            </div>
            <div className="rounded-lg border-2 border-emerald-500 bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-center text-white shadow-md">
              <p className="text-xs font-bold text-white/90">Total price</p>
              <p className="text-3xl font-black text-white">₹{booking.pricing.totalPrice}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <RippleButton
              onClick={() => window.print()}
              className="border-2 border-emerald-500 bg-emerald-600 px-5 py-2.5 font-bold text-white shadow-md hover:bg-emerald-700"
            >
              <Printer className="mr-2 inline h-4 w-4" />
              Print
            </RippleButton>
            <RippleButton
              disabled
              className="cursor-not-allowed border-2 border-gray-400 bg-gray-300 px-5 py-2.5 font-bold text-gray-600 opacity-70"
            >
              <Download className="mr-2 inline h-4 w-4" />
              Download PDF (Soon)
            </RippleButton>
          </div>
        </MotionCard>
      </div>

      <RippleButton
        onClick={() => navigate('/customer/dashboard')}
        className="border-2 border-emerald-500 bg-white px-6 py-3 font-bold text-emerald-700 shadow-md hover:bg-emerald-50"
      >
        Back to Dashboard
      </RippleButton>

      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg">
          Booking created successfully
        </div>
      )}
    </div>
  )
}

export default BookingConfirmation

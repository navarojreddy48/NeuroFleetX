import { IndianRupee, TrendingUp, Clock, Download, Calendar, Wallet } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { MotionCard } from '../../ui/MotionCard'
import { PageTransition } from '../../ui/PageTransition'
import { RippleButton } from '../../ui/RippleButton'
import { driverEarningsApi, tripApi } from '../../services/apiService'

function Earnings() {
  const [earnings, setEarnings] = useState([])
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError('')

      try {
        const [earningsData, tripsData] = await Promise.all([
          driverEarningsApi.getAll(),
          tripApi.getAll(),
        ])

        setEarnings(Array.isArray(earningsData) ? earningsData : [])
        setTrips(Array.isArray(tripsData) ? tripsData : [])
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load earnings data')
      }

      setLoading(false)
    }

    loadData()
  }, [])

  const earningsByDate = useMemo(() => {
    const aggregate = new Map()

    earnings.forEach((earning) => {
      const key = earning.date
      const current = aggregate.get(key) || { date: key, amount: 0, trips: 0 }
      current.amount += Number(earning.amount || 0)
      current.trips += 1
      aggregate.set(key, current)
    })

    return Array.from(aggregate.values()).sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [earnings])

  const recentPayments = earningsByDate.slice(0, 5).map((item, index) => ({
    date: item.date,
    amount: `₹${item.amount.toLocaleString()}`,
    trips: item.trips,
    status: 'Completed',
    method: index % 2 === 0 ? 'UPI' : 'Bank Transfer',
  }))

  const weeklyBreakdown = useMemo(() => {
    const dayOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const today = new Date()
    const rows = []

    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const key = date.toISOString().slice(0, 10)
      const matching = earningsByDate.find((entry) => entry.date === key)

      rows.push({
        day: dayOrder[date.getDay()],
        earnings: Number(matching?.amount || 0),
        trips: Number(matching?.trips || 0),
      })
    }

    return rows
  }, [earningsByDate])

  const todayKey = new Date().toISOString().slice(0, 10)
  const todayEarnings = earningsByDate.find((entry) => entry.date === todayKey)?.amount || 0
  const weekTotal = weeklyBreakdown.reduce((sum, row) => sum + row.earnings, 0)

  const now = new Date()
  const monthTotal = earningsByDate
    .filter((entry) => {
      const d = new Date(entry.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((sum, row) => sum + row.amount, 0)

  const totalEarnings = earningsByDate.reduce((sum, row) => sum + row.amount, 0)

  const stats = [
    {
      icon: IndianRupee,
      label: "Today's Earnings",
      value: `₹${todayEarnings.toLocaleString()}`,
      change: `${weeklyBreakdown[6]?.trips || 0} trips today`,
      bgColor: 'bg-gradient-to-br from-emerald-100 to-white',
      iconBg: 'bg-emerald-500',
      borderColor: 'border-emerald-300',
    },
    {
      icon: TrendingUp,
      label: 'This Week',
      value: `₹${weekTotal.toLocaleString()}`,
      change: `${weeklyBreakdown.reduce((sum, row) => sum + row.trips, 0)} trips this week`,
      bgColor: 'bg-gradient-to-br from-blue-100 to-white',
      iconBg: 'bg-blue-500',
      borderColor: 'border-blue-300',
    },
    {
      icon: Wallet,
      label: 'This Month',
      value: `₹${monthTotal.toLocaleString()}`,
      change: `${earningsByDate.length} earning records`,
      bgColor: 'bg-gradient-to-br from-purple-100 to-white',
      iconBg: 'bg-purple-500',
      borderColor: 'border-purple-300',
    },
    {
      icon: Calendar,
      label: 'Total Earnings',
      value: `₹${totalEarnings.toLocaleString()}`,
      change: `${trips.length} total trips`,
      bgColor: 'bg-gradient-to-br from-orange-100 to-white',
      iconBg: 'bg-orange-500',
      borderColor: 'border-orange-300',
    },
  ]

  const maxEarnings = Math.max(1, ...weeklyBreakdown.map((d) => d.earnings))

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <MotionCard className="border-2 border-emerald-300 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 shadow-2xl" hover={false}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IndianRupee className="h-10 w-10 text-gray-900" />
              <div>
                <h1 className="text-3xl font-black text-gray-900">Earnings Dashboard</h1>
                <p className="mt-1 text-sm font-bold text-gray-900">Track your income and payment history</p>
              </div>
            </div>
            <RippleButton className="bg-white/20 px-6 py-3 font-black text-white backdrop-blur-sm hover:bg-white/30">
              <Download className="mr-2 inline h-5 w-5" />
              Download Report
            </RippleButton>
          </div>
        </MotionCard>

        {/* Stats Grid */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <MotionCard 
                key={stat.label}
                className={`${stat.bgColor} border-2 ${stat.borderColor} shadow-xl`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-600">{stat.label}</p>
                    <p className="mt-3 text-3xl font-black text-gray-900">{stat.value}</p>
                    <p className="mt-2 text-xs font-bold text-emerald-600">{stat.change}</p>
                  </div>
                  <div className={`${stat.iconBg} rounded-2xl p-3 shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </MotionCard>
            )
          })}
        </div>

        {/* Weekly Chart */}
        <MotionCard className="border-2 border-gray-300 bg-white shadow-xl">
          {loading && <p className="mb-3 text-sm font-bold text-blue-700">Loading earnings from database...</p>}
          {error && <p className="mb-3 text-sm font-bold text-red-700">{error}</p>}
          <div className="flex items-center justify-between border-b-2 border-gray-200 pb-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-black text-gray-900">Weekly Earnings</h2>
            </div>
            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-700">
              Last 7 Days
            </span>
          </div>
          <div className="mt-6 space-y-3">
            {weeklyBreakdown.map((day) => (
              <div key={day.day} className="space-y-2">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="w-12 text-gray-700">{day.day}</span>
                  <span className="text-gray-600">{day.trips} trips</span>
                  <span className="text-lg font-black text-emerald-600">₹{day.earnings.toLocaleString()}</span>
                </div>
                <div className="relative h-3 overflow-hidden rounded-full bg-gray-100">
                  <div 
                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-md transition-all"
                    style={{ width: `${(day.earnings / maxEarnings) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </MotionCard>

        {/* Recent Payments */}
        <MotionCard className="border-2 border-gray-300 bg-white shadow-xl" hover={false}>
          <div className="flex items-center gap-3 border-b-2 border-gray-200 pb-4">
            <Clock className="h-6 w-6 text-gray-600" />
            <h2 className="text-xl font-black text-gray-900">Recent Payments</h2>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-black uppercase text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase text-gray-700">Trips</th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase text-gray-700">Method</th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment, index) => (
                  <tr key={index} className="border-b border-gray-100 transition-colors hover:bg-emerald-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        {payment.date}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-lg font-black text-emerald-600">{payment.amount}</td>
                    <td className="px-4 py-4 text-sm font-bold text-gray-900">{payment.trips} trips</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">
                        {payment.method}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-black text-white shadow-md">
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MotionCard>

        {/* Payment Info */}
        <MotionCard className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-white shadow-xl">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-blue-500 p-4 shadow-lg">
              <Wallet className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-black text-gray-900">💳 Payment Information</h2>
              <div className="mt-3 space-y-2 text-sm font-bold text-gray-700">
                <p>Bank Account: **** **** **** 4567 (HDFC Bank)</p>
                <p>UPI ID: driver@paytm</p>
                <p>Payment Cycle: Weekly (Every Monday)</p>
              </div>
              <RippleButton className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-black text-white shadow-lg hover:from-blue-700 hover:to-blue-800">
                Update Payment Details
              </RippleButton>
            </div>
          </div>
        </MotionCard>
      </div>
    </PageTransition>
  )
}

export default Earnings

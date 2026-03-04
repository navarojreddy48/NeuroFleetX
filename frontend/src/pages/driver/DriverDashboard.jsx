import { CarFront, TrendingUp, IndianRupee, MapPin, ThumbsUp, Star, MapPinned, Sparkles, Award, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MotionCard } from '../../ui/MotionCard'
import { PageTransition } from '../../ui/PageTransition'
import { RippleButton } from '../../ui/RippleButton'

function DriverDashboard() {
  const navigate = useNavigate()

  const stats = [
    { 
      icon: CarFront, 
      label: "Today's Trips", 
      value: '8', 
      change: '+2 from yesterday',
      bgColor: 'bg-gradient-to-br from-blue-100 via-blue-50 to-white',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-500',
      borderColor: 'border-blue-300'
    },
    { 
      icon: IndianRupee, 
      label: "Today's Earnings", 
      value: '₹1,850', 
      change: '+₹450 from yesterday',
      bgColor: 'bg-gradient-to-br from-emerald-100 via-emerald-50 to-white',
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-500',
      borderColor: 'border-emerald-300'
    },
    { 
      icon: MapPin, 
      label: 'Distance Covered', 
      value: '124 km', 
      change: 'Today',
      bgColor: 'bg-gradient-to-br from-purple-100 via-purple-50 to-white',
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-500',
      borderColor: 'border-purple-300'
    },
    { 
      icon: ThumbsUp, 
      label: 'Completed Trips', 
      value: '540', 
      change: 'Total',
      bgColor: 'bg-gradient-to-br from-orange-100 via-orange-50 to-white',
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-500',
      borderColor: 'border-orange-300'
    },
    { 
      icon: TrendingUp, 
      label: 'Acceptance Rate', 
      value: '92%', 
      change: 'Above average',
      bgColor: 'bg-gradient-to-br from-teal-100 via-teal-50 to-white',
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-500',
      borderColor: 'border-teal-300'
    },
    { 
      icon: Star, 
      label: 'Driver Rating', 
      value: '4.6', 
      extra: '★★★★★',
      change: 'Excellent',
      bgColor: 'bg-gradient-to-br from-yellow-100 via-yellow-50 to-white',
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-500',
      borderColor: 'border-yellow-300'
    }
  ]

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Hero Header */}
        <MotionCard className="relative overflow-hidden border-2 border-emerald-300 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 shadow-2xl" hover={false}>
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Award className="h-10 w-10 text-gray-900" />
                <h1 className="text-4xl font-black text-gray-900">Driver Dashboard</h1>
              </div>
              <p className="mt-2 text-lg font-bold text-gray-900">Monitor your trips, earnings, and performance in real-time</p>
            </div>
            <Sparkles className="h-16 w-16 animate-pulse text-gray-900" />
          </div>
        </MotionCard>

        {/* Stats Grid */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
                    <div className="mt-3 flex items-baseline gap-2">
                      <p className="text-4xl font-black text-gray-900">{stat.value}</p>
                      {stat.extra && <span className="text-xl text-yellow-500">{stat.extra}</span>}
                    </div>
                    <p className="mt-2 text-xs font-bold text-gray-500">{stat.change}</p>
                  </div>
                  <div className={`${stat.iconBg} rounded-2xl p-3 shadow-lg`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </MotionCard>
            )
          })}
        </div>

        {/* Performance Card */}
        <MotionCard className="border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 shadow-2xl" hover={false}>
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 p-4 shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-black text-gray-900">🎉 Performance Summary</h2>
              <p className="mt-3 text-base font-bold leading-relaxed text-gray-800">
                Outstanding work! Your acceptance rate is <span className="text-emerald-600">above average</span> and your customer rating is <span className="text-yellow-600">excellent</span>. 
                Keep maintaining consistent performance to unlock weekly incentives and bonuses!
              </p>
              <div className="mt-4 flex gap-3">
                <span className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-black text-white shadow-md">High Performance</span>
                <span className="rounded-full bg-yellow-500 px-4 py-2 text-sm font-black text-white shadow-md">Top Rated</span>
              </div>
            </div>
          </div>
        </MotionCard>

        {/* Quick Actions */}
        <div className="grid gap-5 md:grid-cols-2">
          <MotionCard className="border-2 border-blue-300 bg-gradient-to-br from-blue-100 via-blue-50 to-white shadow-xl" hover={false}>
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 shadow-lg">
                <MapPinned className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-black text-gray-900">🗺️ Live Tracking</h2>
                <p className="mt-2 text-sm font-bold text-gray-700">Track your current trip in real-time with GPS navigation</p>
                <RippleButton
                  onClick={() => navigate('/driver/live-tracking')}
                  className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-black text-white shadow-lg hover:from-blue-700 hover:to-blue-800"
                >
                  Open Live Tracking →
                </RippleButton>
              </div>
            </div>
          </MotionCard>

          <MotionCard className="border-2 border-purple-300 bg-gradient-to-br from-purple-100 via-purple-50 to-white shadow-xl" hover={false}>
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-4 shadow-lg">
                <IndianRupee className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-black text-gray-900">💰 Earnings Report</h2>
                <p className="mt-2 text-sm font-bold text-gray-700">View detailed earnings breakdown and payment history</p>
                <RippleButton
                  onClick={() => navigate('/driver/earnings')}
                  className="mt-4 bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-3 font-black text-white shadow-lg hover:from-purple-700 hover:to-purple-800"
                >
                  View Earnings →
                </RippleButton>
              </div>
            </div>
          </MotionCard>
        </div>

        {/* Recent Activity */}
        <MotionCard className="border-2 border-gray-300 bg-gradient-to-br from-gray-50 to-white shadow-xl" hover={false}>
          <div className="flex items-center gap-3 border-b-2 border-gray-200 pb-4">
            <Clock className="h-6 w-6 text-gray-600" />
            <h2 className="text-xl font-black text-gray-900">Recent Activity</h2>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { time: '2 hours ago', activity: 'Completed trip to Electronic City', amount: '₹580', color: 'emerald' },
              { time: '4 hours ago', activity: 'Completed trip to Koramangala', amount: '₹420', color: 'blue' },
              { time: '6 hours ago', activity: 'Completed trip to Whitefield', amount: '₹850', color: 'purple' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between rounded-xl bg-gradient-to-r from-gray-50 to-white p-4 shadow-md">
                <div>
                  <p className="font-bold text-gray-900">{item.activity}</p>
                  <p className="text-xs font-bold text-gray-500">{item.time}</p>
                </div>
                <span className={`rounded-full bg-${item.color}-500 px-4 py-2 text-sm font-black text-white`}>
                  {item.amount}
                </span>
              </div>
            ))}
          </div>
        </MotionCard>
      </div>
    </PageTransition>
  )
}

export default DriverDashboard

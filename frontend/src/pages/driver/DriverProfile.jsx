import { useState } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Star, Edit, Save, Camera } from 'lucide-react'
import { MotionCard } from '../../ui/MotionCard'
import { PageTransition } from '../../ui/PageTransition'
import { RippleButton } from '../../ui/RippleButton'

function DriverProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@neurofleet.com',
    phone: '+91 98765 43210',
    address: 'MG Road, Bengaluru, Karnataka 560001',
    joinDate: '2023-01-15',
    vehicleNumber: 'KA-01-AB-1234',
    vehicleModel: 'Toyota Innova Crysta',
    licenseNumber: 'KA-123456789',
    rating: 4.6,
    totalTrips: 540,
    totalEarnings: '₹285,640'
  })

  const handleSave = () => {
    setIsEditing(false)
    // Save profile logic here
  }

  const stats = [
    { icon: Star, label: 'Rating', value: profile.rating, color: 'yellow' },
    { icon: User, label: 'Total Trips', value: profile.totalTrips, color: 'blue' },
    { icon: Calendar, label: 'Member Since', value: new Date(profile.joinDate).getFullYear(), color: 'purple' }
  ]

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <MotionCard className="border-2 border-emerald-300 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 shadow-2xl" hover={false}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-10 w-10 text-gray-900" />
              <div>
                <h1 className="text-3xl font-black text-gray-900">Driver Profile</h1>
                <p className="mt-1 text-sm font-bold text-gray-900">Manage your personal and vehicle information</p>
              </div>
            </div>
            <RippleButton 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="bg-white/20 px-6 py-3 font-black text-white backdrop-blur-sm hover:bg-white/30"
            >
              {isEditing ? (
                <><Save className="mr-2 inline h-5 w-5" /> Save Changes</>
              ) : (
                <><Edit className="mr-2 inline h-5 w-5" /> Edit Profile</>
              )}
            </RippleButton>
          </div>
        </MotionCard>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <MotionCard className="border-2 border-gray-300 bg-gradient-to-br from-gray-50 to-white shadow-xl text-center">
              <div className="relative mx-auto w-32">
                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-emerald-500 bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-lg">
                  <User className="h-full w-full p-6 text-emerald-600" />
                </div>
                <button className="absolute bottom-0 right-0 rounded-full bg-emerald-500 p-2 text-white shadow-lg hover:bg-emerald-600">
                  <Camera className="h-5 w-5" />
                </button>
              </div>
              <h2 className="mt-4 text-2xl font-black text-gray-900">{profile.name}</h2>
              <p className="text-sm font-bold text-gray-600">{profile.email}</p>
              
              {/* Stats */}
              <div className="mt-6 space-y-3">
                {stats.map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div key={stat.label} className="flex items-center justify-between rounded-xl bg-white p-3 shadow-md">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 text-${stat.color}-600`} />
                        <span className="text-sm font-bold text-gray-700">{stat.label}</span>
                      </div>
                      <span className="text-lg font-black text-gray-900">{stat.value}</span>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white shadow-lg">
                <p className="text-xs font-bold uppercase">Total Earnings</p>
                <p className="mt-1 text-3xl font-black">{profile.totalEarnings}</p>
              </div>
            </MotionCard>
          </div>

          {/* Profile Details */}
          <div className="space-y-6 lg:col-span-2">
            {/* Personal Information */}
            <MotionCard className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-white shadow-xl">
              <h2 className="flex items-center gap-2 border-b-2 border-blue-200 pb-4 text-xl font-black text-gray-900">
                <User className="h-6 w-6 text-blue-600" />
                Personal Information
              </h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-600">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="mt-1 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-bold text-gray-900 focus:border-emerald-500 focus:outline-none"
                    />
                  ) : (
                    <p className="mt-1 text-lg font-bold text-gray-900">{profile.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-gray-600">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="mt-1 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-bold text-gray-900 focus:border-emerald-500 focus:outline-none"
                    />
                  ) : (
                    <p className="mt-1 flex items-center gap-2 text-lg font-bold text-gray-900">
                      <Mail className="h-5 w-5 text-gray-600" />
                      {profile.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-gray-600">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="mt-1 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-bold text-gray-900 focus:border-emerald-500 focus:outline-none"
                    />
                  ) : (
                    <p className="mt-1 flex items-center gap-2 text-lg font-bold text-gray-900">
                      <Phone className="h-5 w-5 text-gray-600" />
                      {profile.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-gray-600">Address</label>
                  {isEditing ? (
                    <textarea
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      className="mt-1 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-bold text-gray-900 focus:border-emerald-500 focus:outline-none"
                      rows={2}
                    />
                  ) : (
                    <p className="mt-1 flex items-center gap-2 text-lg font-bold text-gray-900">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      {profile.address}
                    </p>
                  )}
                </div>
              </div>
            </MotionCard>

            {/* Vehicle Information */}
            <MotionCard className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-white shadow-xl">
              <h2 className="flex items-center gap-2 border-b-2 border-purple-200 pb-4 text-xl font-black text-gray-900">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
                Vehicle Information
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-600">Vehicle Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.vehicleNumber}
                      onChange={(e) => setProfile({ ...profile, vehicleNumber: e.target.value })}
                      className="mt-1 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-bold text-gray-900 focus:border-emerald-500 focus:outline-none"
                    />
                  ) : (
                    <p className="mt-1 text-lg font-black text-gray-900">{profile.vehicleNumber}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-gray-600">Vehicle Model</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.vehicleModel}
                      onChange={(e) => setProfile({ ...profile, vehicleModel: e.target.value })}
                      className="mt-1 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-bold text-gray-900 focus:border-emerald-500 focus:outline-none"
                    />
                  ) : (
                    <p className="mt-1 text-lg font-bold text-gray-900">{profile.vehicleModel}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase text-gray-600">License Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.licenseNumber}
                      onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })}
                      className="mt-1 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-bold text-gray-900 focus:border-emerald-500 focus:outline-none"
                    />
                  ) : (
                    <p className="mt-1 text-lg font-black text-gray-900">{profile.licenseNumber}</p>
                  )}
                </div>
              </div>
            </MotionCard>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default DriverProfile

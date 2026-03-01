import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Building2,
  IdCard,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  UserRound,
} from 'lucide-react'
import AuthLayout from '../components/AuthLayout.jsx'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'

const roleOptions = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Fleet Manager', value: 'FLEET_MANAGER' },
  { label: 'Driver', value: 'DRIVER' },
  { label: 'Customer', value: 'CUSTOMER' },
]
const genderOptions = ['Male', 'Female', 'Other']

const inputClass =
  'peer h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/25'

function InputField({ id, label, icon: Icon, className = '', ...props }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input id={id} placeholder=" " className={`${inputClass} ${className}`} {...props} />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 bg-white px-1 text-sm text-slate-500 transition-all duration-200 peer-focus:top-0 peer-focus:text-xs peer-focus:text-emerald-600 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs"
      >
        {label}
      </label>
    </div>
  )
}

function Signup() {
  const navigate = useNavigate()
  const [role, setRole] = useState('ADMIN')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    gender: '',
    registrationNumber: '',
    companyName: '',
    licenseNumber: '',
    phoneNumber: '',
    city: '',
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    if (!showSuccessModal) {
      return
    }

    const timer = window.setTimeout(() => {
      navigate('/login')
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [showSuccessModal, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')
    setIsLoading(true)

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      role,
      gender: formData.gender,
    }

    if (role === 'ADMIN') payload.registrationNumber = formData.registrationNumber
    if (role === 'FLEET_MANAGER') payload.companyName = formData.companyName
    if (role === 'DRIVER') payload.licenseNumber = formData.licenseNumber
    if (role === 'CUSTOMER') {
      payload.phoneNumber = formData.phoneNumber
      payload.city = formData.city
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const rawBody = await response.text()
      let data = {}
      try {
        data = rawBody ? JSON.parse(rawBody) : {}
      } catch {
        data = { message: rawBody || 'Signup failed' }
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || data.errors?.[0] || `Signup failed (${response.status})`)
      }

      setMessage(data.message || 'Registered successfully. Please login.')
      setShowSuccessModal(true)
      setFormData({
        fullName: '',
        email: '',
        password: '',
        gender: '',
        registrationNumber: '',
        companyName: '',
        licenseNumber: '',
        phoneNumber: '',
        city: '',
      })
    } catch (err) {
      setError(err.message || 'Unable to register')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 26, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-xl transition duration-300 hover:shadow-2xl"
      >
        <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-emerald-200/40 blur-2xl" />

        <div className="mb-6 space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Create Account</h2>
          <p className="text-sm text-slate-600">Sign up to manage your fleet</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03, duration: 0.3 }}>
            <InputField
              id="signup-name"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              label="Full Name"
              icon={User}
              required
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06, duration: 0.3 }}>
            <InputField
              id="signup-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              label="Email Address"
              icon={Mail}
              required
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09, duration: 0.3 }} className="relative">
            <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select value={role} onChange={(e) => setRole(e.target.value)} className={`${inputClass} appearance-none`}>
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.3 }} className="relative">
            <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              className={`${inputClass} appearance-none`}
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Gender
              </option>
              {genderOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </motion.div>

          {role === 'ADMIN' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14, duration: 0.3 }}>
              <InputField
                id="signup-reg"
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleInputChange}
                label="Registration Number"
                icon={IdCard}
                required
              />
            </motion.div>
          )}

          {role === 'FLEET_MANAGER' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14, duration: 0.3 }}>
              <InputField
                id="signup-company"
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                label="Company Name"
                icon={Building2}
                required
              />
            </motion.div>
          )}

          {role === 'DRIVER' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14, duration: 0.3 }}>
              <InputField
                id="signup-license"
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                label="License Number"
                icon={IdCard}
                required
              />
            </motion.div>
          )}

          {role === 'CUSTOMER' && (
            <>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14, duration: 0.3 }}>
                <InputField
                  id="signup-phone"
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  label="Phone Number"
                  icon={Phone}
                  required
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17, duration: 0.3 }}>
                <InputField
                  id="signup-city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  label="City"
                  icon={MapPin}
                  required
                />
              </motion.div>
            </>
          )}

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.3 }} className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder=" "
              className={`${inputClass} pr-24`}
              minLength={6}
              required
              id="signup-password"
            />
            <label
              htmlFor="signup-password"
              className="pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 bg-white px-1 text-sm text-slate-500 transition-all duration-200 peer-focus:top-0 peer-focus:text-xs peer-focus:text-emerald-600 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 transition hover:text-slate-700"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            type="submit"
            disabled={isLoading}
            className="h-12 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 font-semibold text-white shadow-md transition hover:shadow-lg"
          >
            {isLoading ? 'Creating account...' : 'Signup'}
          </motion.button>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-emerald-600 transition hover:underline">
            Login
          </Link>
        </p>
      </motion.div>

      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xl"
            >
              <h3 className="text-xl font-semibold text-slate-900">Registration Successful</h3>
              <p className="mt-2 text-sm text-slate-600">{message || 'User registered successfully'}</p>
              <p className="mt-1 text-xs text-slate-500">Redirecting to login...</p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="mt-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-md"
              >
                Go to Login
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  )
}

export default Signup

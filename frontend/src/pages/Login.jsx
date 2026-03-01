import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Mail, ShieldCheck } from 'lucide-react'
import AuthLayout from '../components/AuthLayout.jsx'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'

const roleOptions = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Fleet Manager', value: 'FLEET_MANAGER' },
  { label: 'Driver', value: 'DRIVER' },
  { label: 'Customer', value: 'CUSTOMER' },
]

const inputClass =
  'peer h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/25'

function normalizeRole(value) {
  const normalized = String(value || '')
    .toLowerCase()
    .replace(/^role[_-]?/, '')
    .replace(/[_\s-]+/g, '')

  return normalized
}

function getRoleRoute(role) {
  const normalized = normalizeRole(role)

  if (normalized === 'admin') return '/admin/dashboard'
  if (normalized === 'fleetmanager') return '/fleetmanager/dashboard'
  if (normalized === 'driver') return '/driver/dashboard'
  if (normalized === 'customer') return '/customer/dashboard'
  return '/login'
}

function InputField({ id, label, icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input id={id} placeholder=" " className={inputClass} {...props} />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 bg-white px-1 text-sm text-slate-500 transition-all duration-200 peer-focus:top-0 peer-focus:text-xs peer-focus:text-emerald-600 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs"
      >
        {label}
      </label>
    </div>
  )
}

function Login() {
  const navigate = useNavigate()
  const [role, setRole] = useState('ADMIN')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role,
        }),
      })

      const rawBody = await response.text()
      let data = {}
      try {
        data = rawBody ? JSON.parse(rawBody) : {}
      } catch {
        data = { message: rawBody || 'Login failed' }
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || data.errors?.[0] || `Login failed (${response.status})`)
      }

      const backendRole = data.role || role
      const selectedRole = normalizeRole(backendRole)
      const targetRoute = getRoleRoute(backendRole)
      const jwtToken = data.token || ''

      localStorage.setItem('token', jwtToken)
      localStorage.setItem('role', selectedRole)
      localStorage.setItem('authToken', jwtToken)
      localStorage.setItem('authRole', backendRole)
      localStorage.setItem('authName', data.fullName || data.email?.split('@')[0] || 'User')
      localStorage.setItem('authEmail', data.email)
      localStorage.setItem('authGender', data.gender || '')
      localStorage.setItem('authCompanyName', data.companyName || '')
      setMessage(`Login successful: ${data.email}`)

      navigate(targetRoute)
    } catch (err) {
      setError(err.message || 'Unable to login')
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
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Welcome Back</h2>
          <p className="text-sm text-slate-600">Sign in to manage your fleet</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.3 }}>
            <InputField
              id="login-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              label="Email"
              icon={Mail}
              required
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.3 }}>
            <InputField
              id="login-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              label="Password"
              icon={Lock}
              required
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.3 }} className="relative">
            <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select value={role} onChange={(e) => setRole(e.target.value)} className={`${inputClass} appearance-none`}>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            type="submit"
            disabled={isLoading}
            className="h-12 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 font-semibold text-white shadow-md transition hover:shadow-lg"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </motion.button>

          {message && <p className="text-sm text-emerald-600">{message}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-emerald-600 transition hover:underline">
            Signup
          </Link>
        </p>

      </motion.div>
    </AuthLayout>
  )
}

export default Login

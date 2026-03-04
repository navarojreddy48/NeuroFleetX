const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'

function resolveToken() {
  return localStorage.getItem('authToken') || localStorage.getItem('token') || ''
}

async function request(path, options = {}) {
  const token = resolveToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new Error(data?.message || `Request failed (${response.status})`)
  }

  return data
}

export const authApi = {
  login: (payload) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  register: (payload) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
}

export const vehicleApi = {
  getAll: () => request('/api/vehicles'),
  create: (payload) => request('/api/vehicles', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/api/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  delete: (id) => request(`/api/vehicles/${id}`, { method: 'DELETE' }),
}

export const telemetryApi = {
  getByVehicle: (vehicleId) => request(`/api/vehicles/${vehicleId}/telemetry`),
  create: (vehicleId, payload) => request(`/api/vehicles/${vehicleId}/telemetry`, { method: 'POST', body: JSON.stringify(payload) }),
}

export const simulationApi = {
  start: () => request('/api/simulation/start', { method: 'POST' }),
  stop: () => request('/api/simulation/stop', { method: 'POST' }),
}

export const tripApi = {
  getAll: () => request('/api/trips'),
  create: (payload) => request('/api/trips', { method: 'POST', body: JSON.stringify(payload) }),
  getByDriver: (driverId) => request(`/api/trips/driver/${driverId}`),
}

export const liveTrackingApi = {
  getByTrip: (tripId) => request(`/api/live-tracking/trip/${tripId}`),
}

export const driverEarningsApi = {
  getAll: () => request('/api/earnings'),
  getByDriver: (driverId) => request(`/api/earnings/driver/${driverId}`),
}

export const trafficApi = {
  getHeatmap: () => request('/api/traffic/heatmap'),
}

export const aiSettingsApi = {
  get: () => request('/api/ai/settings'),
  update: (payload) => request('/api/ai/settings', { method: 'PUT', body: JSON.stringify(payload) }),
}

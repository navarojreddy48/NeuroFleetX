import { Navigate } from 'react-router-dom'

function normalizeRole(roleValue) {
  return String(roleValue || '')
    .toLowerCase()
    .replace(/[_\s-]+/g, '')
}

function resolveToken() {
  const authToken = localStorage.getItem('authToken')
  if (authToken) {
    return authToken
  }

  const legacyToken = localStorage.getItem('token')
  if (!legacyToken || legacyToken === 'dummy_token') {
    return ''
  }

  return legacyToken
}

function PrivateRoute({ children, allowedRole }) {
  const token = resolveToken()
  const role = localStorage.getItem('role') || localStorage.getItem('authRole')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (allowedRole && normalizeRole(role) !== normalizeRole(allowedRole)) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default PrivateRoute

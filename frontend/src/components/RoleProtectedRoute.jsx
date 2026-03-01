import { Navigate } from 'react-router-dom'

const normalizeRole = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[_\s-]+/g, '')

const resolveToken = () => {
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

function RoleProtectedRoute({ children, allowedRole }) {
  const token = resolveToken()
  const role = localStorage.getItem('role') || localStorage.getItem('authRole')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (allowedRole && normalizeRole(role) !== normalizeRole(allowedRole)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default RoleProtectedRoute

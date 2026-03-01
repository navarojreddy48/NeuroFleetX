import { Navigate } from 'react-router-dom'

const normalizeRole = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[_\s-]+/g, '')

function RoleProtectedRoute({ children, allowedRole, unauthorizedPath = '/unauthorized' }) {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken')
  const role = localStorage.getItem('role') || localStorage.getItem('authRole')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (allowedRole && normalizeRole(role) !== normalizeRole(allowedRole)) {
    return <Navigate to={unauthorizedPath} replace />
  }

  return children
}

export default RoleProtectedRoute

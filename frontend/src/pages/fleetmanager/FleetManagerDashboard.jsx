import { Navigate, useNavigate } from 'react-router-dom'

function FleetManagerDashboard() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const savedRole = localStorage.getItem('role')
  const savedEmail = localStorage.getItem('authEmail')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('authToken')
    localStorage.removeItem('authRole')
    localStorage.removeItem('authEmail')
    navigate('/login')
  }

  if (!token || !savedRole) {
    return <Navigate to="/login" replace />
  }

  if (savedRole !== 'fleetmanager') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
      <div className="w-full max-w-2xl rounded-2xl border border-white/20 bg-white/10 p-10 text-center shadow-2xl backdrop-blur-lg">
        <h1 className="text-3xl font-semibold">{savedRole} Dashboard</h1>
        <p className="mt-4 text-slate-200">Blank dashboard page. Content will be added next.</p>
        {savedEmail && <p className="mt-2 text-sm text-slate-300">{savedEmail}</p>}
        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default FleetManagerDashboard

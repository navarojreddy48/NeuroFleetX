import { useNavigate } from 'react-router-dom'

function Unauthorized() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-lg">
        <h1 className="text-3xl font-semibold text-slate-900">Unauthorized</h1>
        <p className="mt-3 text-slate-600">You do not have permission to access this page.</p>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="mt-6 rounded-xl bg-emerald-500 px-5 py-2.5 font-semibold text-white"
        >
          Go to Login
        </button>
      </div>
    </div>
  )
}

export default Unauthorized

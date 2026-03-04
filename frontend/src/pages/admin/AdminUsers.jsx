import { useMemo, useState } from 'react'
import { Award, Sparkles } from 'lucide-react'

const initialUsers = [
  {
    id: 1,
    name: 'Arjun Mehta',
    email: 'arjun.mehta@neurofleet.ai',
    role: 'Fleet Manager',
    status: 'Active',
    lastActive: '2 mins ago',
  },
  {
    id: 2,
    name: 'Neha Rao',
    email: 'neha.rao@neurofleet.ai',
    role: 'Driver',
    status: 'Active',
    lastActive: '12 mins ago',
  },
  {
    id: 3,
    name: 'Rohit Sharma',
    email: 'rohit.sharma@neurofleet.ai',
    role: 'Customer',
    status: 'Inactive',
    lastActive: '1 day ago',
  },
  {
    id: 4,
    name: 'Isha Kapoor',
    email: 'isha.kapoor@neurofleet.ai',
    role: 'Fleet Manager',
    status: 'Active',
    lastActive: '35 mins ago',
  },
  {
    id: 5,
    name: 'Vikram Nair',
    email: 'vikram.nair@neurofleet.ai',
    role: 'Driver',
    status: 'Inactive',
    lastActive: '3 hours ago',
  },
  {
    id: 6,
    name: 'Priya Das',
    email: 'priya.das@neurofleet.ai',
    role: 'Customer',
    status: 'Active',
    lastActive: '8 mins ago',
  },
]

const emptyForm = {
  name: '',
  email: '',
  role: 'Customer',
  password: '',
  status: 'Active',
}

const roleFilters = ['All', 'Fleet Manager', 'Driver', 'Customer']

function Users() {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState(emptyForm)

  const userStats = useMemo(() => {
    const totalUsers = users.length
    const fleetManagers = users.filter((user) => user.role === 'Fleet Manager').length
    const drivers = users.filter((user) => user.role === 'Driver').length
    const customers = users.filter((user) => user.role === 'Customer').length

    return { totalUsers, fleetManagers, drivers, customers }
  }, [users])

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()

    return users.filter((user) => {
      const matchesRole = roleFilter === 'All' || user.role === roleFilter
      const matchesSearch =
        query.length === 0 ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)

      return matchesRole && matchesSearch
    })
  }, [users, search, roleFilter])

  const handleDelete = (userId) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId))
  }

  const handleEdit = (userId) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
          : user,
      ),
    )
  }

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddUser = (event) => {
    event.preventDefault()

    if (!formData.name || !formData.email || !formData.password) {
      return
    }

    const nextUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status,
      lastActive: 'Just now',
    }

    setUsers((prev) => [nextUser, ...prev])
    setFormData(emptyForm)
    setShowAddModal(false)
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border-2 border-cyan-300 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 p-6 shadow-2xl">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Award className="h-9 w-9 text-gray-900" />
            <div>
              <h1 className="text-3xl font-black text-gray-900">User Management</h1>
              <p className="mt-1 text-sm font-bold text-gray-900">Manage platform users, roles, and access status.</p>
            </div>
          </div>
          <Sparkles className="h-11 w-11 animate-pulse text-gray-900" />
        </div>
        <div className="relative mt-4">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="rounded-xl bg-gradient-to-r from-cyan-700 to-blue-700 px-4 py-2 text-sm font-black text-white shadow-lg transition hover:from-cyan-800 hover:to-blue-800"
          >
            Add User
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border-2 border-cyan-300 bg-gradient-to-br from-cyan-100 via-cyan-50 to-white p-4 shadow-lg">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Total Users</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{userStats.totalUsers}</p>
        </article>
        <article className="rounded-xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-100 via-indigo-50 to-white p-4 shadow-lg">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Fleet Managers</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{userStats.fleetManagers}</p>
        </article>
        <article className="rounded-xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-100 via-emerald-50 to-white p-4 shadow-lg">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Drivers</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{userStats.drivers}</p>
        </article>
        <article className="rounded-xl border-2 border-amber-300 bg-gradient-to-br from-amber-100 via-amber-50 to-white p-4 shadow-lg">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Customers</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{userStats.customers}</p>
        </article>
      </section>

      <section className="rounded-2xl border-2 border-cyan-300 bg-gradient-to-br from-cyan-100 via-cyan-50 to-white p-5 shadow-xl">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email"
            className="h-10 min-w-[220px] flex-1 rounded-xl border border-cyan-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none"
          />
          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="h-10 rounded-xl border border-cyan-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none"
          >
            {roleFilters.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-cyan-200 text-xs uppercase tracking-wide text-slate-600">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Last Active</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-cyan-100 transition hover:bg-white/80">
                  <td className="px-3 py-3 font-bold text-slate-900">{user.name}</td>
                  <td className="px-3 py-3 font-medium text-slate-700">{user.email}</td>
                  <td className="px-3 py-3 font-medium text-slate-700">{user.role}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        user.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-medium text-slate-700">{user.lastActive}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(user.id)}
                        className="rounded-lg border border-cyan-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 transition hover:bg-cyan-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(user.id)}
                        className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-2xl border-2 border-cyan-300 bg-gradient-to-br from-cyan-100 via-cyan-50 to-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900">Add User</h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-lg border border-cyan-200 bg-white px-2 py-1 text-xs font-bold text-slate-600 hover:bg-cyan-50"
              >
                Close
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleAddUser}>
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => handleFormChange('name', event.target.value)}
                  className="h-10 w-full rounded-xl border border-cyan-200 px-3 text-sm font-semibold text-slate-700 outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => handleFormChange('email', event.target.value)}
                  className="h-10 w-full rounded-xl border border-cyan-200 px-3 text-sm font-semibold text-slate-700 outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Role</label>
                <select
                  value={formData.role}
                  onChange={(event) => handleFormChange('role', event.target.value)}
                  className="h-10 w-full rounded-xl border border-cyan-200 px-3 text-sm font-semibold text-slate-700 outline-none"
                >
                  <option value="Fleet Manager">Fleet Manager</option>
                  <option value="Driver">Driver</option>
                  <option value="Customer">Customer</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(event) => handleFormChange('password', event.target.value)}
                  className="h-10 w-full rounded-xl border border-cyan-200 px-3 text-sm font-semibold text-slate-700 outline-none"
                  required
                />
              </div>

              <label className="flex items-center justify-between rounded-xl border border-cyan-200 bg-white px-3 py-2.5">
                <span className="text-sm font-semibold text-slate-700">Status</span>
                <button
                  type="button"
                  onClick={() =>
                    handleFormChange('status', formData.status === 'Active' ? 'Inactive' : 'Active')
                  }
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    formData.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {formData.status}
                </button>
              </label>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-cyan-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-cyan-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-cyan-700 to-blue-700 px-4 py-2 text-sm font-black text-white shadow-lg transition hover:from-cyan-800 hover:to-blue-800"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users
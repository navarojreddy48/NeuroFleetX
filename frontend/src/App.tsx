import { Suspense, lazy } from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import ScrollToTop from './components/ScrollToTop.jsx'
import RoleProtectedRoute from './components/RoleProtectedRoute.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import { CustomerProvider } from './context/CustomerContext.jsx'
import AdminSidebarLayout from './layouts/AdminSidebarLayout.jsx'
import CustomerLayout from './layouts/CustomerLayout.jsx'
import DriverLayout from './layouts/DriverLayout.jsx'
import FleetManagerLayout from './layouts/FleetManagerLayout.jsx'
import { LandingPage } from './pages/LandingPage'
import Login from './pages/Login.jsx'
import Unauthorized from './pages/Unauthorized.jsx'
import Signup from './pages/Signup.jsx'

const CustomerDashboard = lazy(() => import('./pages/customer/CustomerDashboard.jsx'))
const PlanTrip = lazy(() => import('./pages/customer/PlanTrip.jsx'))
const MyBookings = lazy(() => import('./pages/customer/MyBookings.jsx'))
const MyTrips = lazy(() => import('./pages/customer/MyTrips.jsx'))
const CustomerProfile = lazy(() => import('./pages/customer/CustomerProfile.jsx'))
const CustomerSettings = lazy(() => import('./pages/customer/CustomerSettings.jsx'))
const BookingConfirmation = lazy(() => import('./pages/customer/BookingConfirmation.jsx'))
const FleetManagerDashboard = lazy(() => import('./pages/FleetManagerDashboard.jsx'))
const FleetManagerProfile = lazy(() => import('./pages/FleetManagerProfile.jsx'))
const DashboardPage = lazy(() => import('./pages/fleetmanager/DashboardPage').then((module) => ({ default: module.DashboardPage })))
const VehiclesPage = lazy(() => import('./pages/fleetmanager/VehiclesPage').then((module) => ({ default: module.VehiclesPage })))
const AlertsPage = lazy(() => import('./pages/fleetmanager/AlertsPage').then((module) => ({ default: module.AlertsPage })))
const RouteOptimizationPage = lazy(() => import('./pages/fleetmanager/RouteOptimizationPage').then((module) => ({ default: module.RouteOptimizationPage })))
const TrafficAnalyticsPage = lazy(() => import('./pages/fleetmanager/TrafficAnalyticsPage').then((module) => ({ default: module.TrafficAnalyticsPage })))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'))
const FleetAnalytics = lazy(() => import('./pages/admin/FleetAnalytics.jsx'))
const AdminTrafficAnalytics = lazy(() => import('./pages/admin/TrafficAnalytics.jsx'))
const RouteReports = lazy(() => import('./pages/admin/RouteReports.jsx'))
const AISettings = lazy(() => import('./pages/admin/AISettings.jsx'))
const Users = lazy(() => import('./pages/admin/Users.jsx'))
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile.jsx'))
const DriverDashboard = lazy(() => import('./pages/driver/DriverDashboard.jsx'))
const DriverLiveTracking = lazy(() => import('./pages/driver/LiveTracking.jsx'))
const DriverTrips = lazy(() => import('./pages/driver/Trips.jsx'))
const DriverEarnings = lazy(() => import('./pages/driver/Earnings.jsx'))
const DriverProfile = lazy(() => import('./pages/driver/DriverProfile.jsx'))
const DriverSettings = lazy(() => import('./pages/driver/DriverSettings.jsx'))

function DashboardRouteEntry() {
  const role = localStorage.getItem('role') || localStorage.getItem('authRole') || ''
  const normalizedRole = String(role)
    .toLowerCase()
    .replace(/[_\s-]+/g, '')

  if (normalizedRole === 'fleetmanager') {
    return <Navigate to="/fleetmanager/dashboard" replace />
  }

  if (normalizedRole === 'customer') {
    return <Navigate to="/customer/dashboard" replace />
  }

  if (normalizedRole === 'driver') {
    return <Navigate to="/driver/dashboard" replace />
  }

  return <DashboardPage />
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-slate-100">
            <div className="rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm">
              Loading...
            </div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardRouteEntry />} />
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/route-optimization" element={<RouteOptimizationPage />} />
            <Route path="/traffic-analytics" element={<TrafficAnalyticsPage />} />
          </Route>
          <Route
            path="/fleetmanager"
            element={
              <RoleProtectedRoute allowedRole="fleetmanager">
                <FleetManagerLayout />
              </RoleProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<FleetManagerDashboard />} />
            <Route path="profile" element={<FleetManagerProfile />} />
          </Route>
          <Route
            path="/customer"
            element={
              <RoleProtectedRoute allowedRole="customer">
                <CustomerProvider>
                  <CustomerLayout />
                </CustomerProvider>
              </RoleProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route path="plan" element={<PlanTrip />} />
            <Route path="bookings" element={<MyBookings />} />
            <Route path="trips" element={<MyTrips />} />
            <Route path="profile" element={<CustomerProfile />} />
            <Route path="settings" element={<CustomerSettings />} />
            <Route path="booking/confirmation" element={<BookingConfirmation />} />
          </Route>
          <Route
            path="/admin"
            element={
              <RoleProtectedRoute allowedRole="admin">
                <AdminSidebarLayout />
              </RoleProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="fleet-analytics" element={<FleetAnalytics />} />
            <Route path="traffic-analytics" element={<AdminTrafficAnalytics />} />
            <Route path="route-reports" element={<RouteReports />} />
            <Route path="ai-settings" element={<AISettings />} />
            <Route path="users" element={<Users />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
          <Route
            path="/driver"
            element={
              <PrivateRoute allowedRole="driver">
                <DriverLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DriverDashboard />} />
            <Route path="live-tracking" element={<DriverLiveTracking />} />
            <Route path="trips" element={<DriverTrips />} />
            <Route path="earnings" element={<DriverEarnings />} />
            <Route path="profile" element={<DriverProfile />} />
            <Route path="settings" element={<DriverSettings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App

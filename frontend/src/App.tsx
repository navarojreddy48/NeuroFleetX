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
const CustomerPlanTrip = lazy(() => import('./pages/customer/CustomerPlanTrip.jsx'))
const CustomerMyBookings = lazy(() => import('./pages/customer/CustomerMyBookings.jsx'))
const CustomerMyTrips = lazy(() => import('./pages/customer/CustomerMyTrips.jsx'))
const CustomerProfile = lazy(() => import('./pages/customer/CustomerProfile.jsx'))
const CustomerSettings = lazy(() => import('./pages/customer/CustomerSettings.jsx'))
const CustomerBookingConfirmation = lazy(() => import('./pages/customer/CustomerBookingConfirmation.jsx'))
const FleetManagerDashboard = lazy(() => import('./pages/fleetmanager/FleetManagerDashboard.jsx'))
const FleetManagerProfile = lazy(() => import('./pages/fleetmanager/FleetManagerProfile.jsx'))
const FleetManagerDashboardPage = lazy(() => import('./pages/fleetmanager/FleetManagerDashboardPage').then((module) => ({ default: module.DashboardPage })))
const FleetManagerVehiclesPage = lazy(() => import('./pages/fleetmanager/FleetManagerVehiclesPage').then((module) => ({ default: module.VehiclesPage })))
const FleetManagerAlertsPage = lazy(() => import('./pages/fleetmanager/FleetManagerAlertsPage').then((module) => ({ default: module.AlertsPage })))
const FleetManagerRouteOptimizationPage = lazy(() => import('./pages/fleetmanager/FleetManagerRouteOptimizationPage').then((module) => ({ default: module.RouteOptimizationPage })))
const FleetManagerTrafficAnalyticsPage = lazy(() => import('./pages/fleetmanager/FleetManagerTrafficAnalyticsPage').then((module) => ({ default: module.TrafficAnalyticsPage })))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'))
const AdminFleetAnalytics = lazy(() => import('./pages/admin/AdminFleetAnalytics.jsx'))
const AdminTrafficAnalytics = lazy(() => import('./pages/admin/AdminTrafficAnalytics.jsx'))
const AdminRouteReports = lazy(() => import('./pages/admin/AdminRouteReports.jsx'))
const AdminAISettings = lazy(() => import('./pages/admin/AdminAISettings.jsx'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers.jsx'))
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile.jsx'))
const DriverDashboard = lazy(() => import('./pages/driver/DriverDashboard.jsx'))
const DriverLiveTracking = lazy(() => import('./pages/driver/DriverLiveTracking.jsx'))
const DriverTrips = lazy(() => import('./pages/driver/DriverTrips.jsx'))
const DriverEarnings = lazy(() => import('./pages/driver/DriverEarnings.jsx'))
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

  return <FleetManagerDashboardPage />
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
            <Route path="/vehicles" element={<FleetManagerVehiclesPage />} />
            <Route path="/alerts" element={<FleetManagerAlertsPage />} />
            <Route path="/route-optimization" element={<FleetManagerRouteOptimizationPage />} />
            <Route path="/traffic-analytics" element={<FleetManagerTrafficAnalyticsPage />} />
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
            <Route path="plan" element={<CustomerPlanTrip />} />
            <Route path="bookings" element={<CustomerMyBookings />} />
            <Route path="trips" element={<CustomerMyTrips />} />
            <Route path="profile" element={<CustomerProfile />} />
            <Route path="settings" element={<CustomerSettings />} />
            <Route path="booking/confirmation" element={<CustomerBookingConfirmation />} />
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
            <Route path="fleet-analytics" element={<AdminFleetAnalytics />} />
            <Route path="traffic-analytics" element={<AdminTrafficAnalytics />} />
            <Route path="route-reports" element={<AdminRouteReports />} />
            <Route path="ai-settings" element={<AdminAISettings />} />
            <Route path="users" element={<AdminUsers />} />
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

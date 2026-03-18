import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import FindBlood from './pages/FindBlood'
import About from './pages/About'
import Community from './pages/Community'
import DonorDashboard from './pages/donor/DonorDashboard'
import DonorProfile from './pages/donor/Profile'
import DonorRequests from './pages/donor/Requests'
import DonorHistory from './pages/donor/History'
import HospitalDashboard from './pages/hospital/HospitalDashboard'
import CreateRequest from './pages/hospital/CreateRequest'
import RequestTracking from './pages/hospital/RequestTracking'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagement from './pages/admin/UserManagement'
import DeveloperProfile from './pages/admin/DeveloperProfile'
import PatientDashboard from './pages/patient/PatientDashboard'
import PatientProfile from './pages/patient/Profile'
import PatientHistory from './pages/patient/History'
import Developers from './pages/Developers'
import ProtectedRoute, { RequireAuth, RequireRole } from './components/ProtectedRoute'
import { ROLES } from './lib/roles'
import RoleRedirect from './components/RoleRedirect'
import BottomNav from './components/BottomNav'
import ErrorBoundary from './components/ErrorBoundary'
import HospitalLayout from './pages/hospital/HospitalLayout'
import HospitalRequests from './pages/hospital/Requests'
import HospitalHistory from './pages/hospital/History'
import HospitalProfile from './pages/hospital/Profile'

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="pb-28 md:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<RoleRedirect fallback="/login" />} />
            <Route path="/find-blood" element={<FindBlood />} />
            {/* Community is public – no auth needed */}
            <Route path="/community" element={<Community />} />
            <Route path="/about" element={<About />} />
            <Route path="/developers" element={<Developers />} />
            {/* Donor */}
            <Route path="/donor/dashboard" element={
              <RequireAuth><RequireRole allow={[ROLES.donor]}><DonorDashboard /></RequireRole></RequireAuth>
            } />
            <Route path="/donor/profile" element={
              <ProtectedRoute><RequireRole allow={[ROLES.donor]}><DonorProfile /></RequireRole></ProtectedRoute>
            } />
            <Route path="/donor/requests" element={
              <ProtectedRoute><RequireRole allow={[ROLES.donor]}><DonorRequests /></RequireRole></ProtectedRoute>
            } />
            <Route path="/donor/history" element={
              <ProtectedRoute><RequireRole allow={[ROLES.donor]}><DonorHistory /></RequireRole></ProtectedRoute>
            } />

            {/* Hospital */}
            <Route
              path="/hospital"
              element={
                <RequireAuth>
                  <RequireRole allow={[ROLES.hospital]}>
                    <HospitalLayout />
                  </RequireRole>
                </RequireAuth>
              }
            >
              <Route path="dashboard" element={<HospitalDashboard />} />
              <Route path="requests" element={<HospitalRequests />} />
              <Route path="history" element={<HospitalHistory />} />
              <Route path="profile" element={<HospitalProfile />} />
              <Route path="create-request" element={<CreateRequest />} />
              <Route path="tracking" element={<RequestTracking />} />
            </Route>

            {/* Patient */}
            <Route path="/patient/dashboard" element={
              <RequireAuth><RequireRole allow={[ROLES.patient]}><PatientDashboard /></RequireRole></RequireAuth>
            } />
            <Route path="/patient/profile" element={
              <RequireAuth><RequireRole allow={[ROLES.patient]}><PatientProfile /></RequireRole></RequireAuth>
            } />
            <Route path="/patient/history" element={
              <RequireAuth><RequireRole allow={[ROLES.patient]}><PatientHistory /></RequireRole></RequireAuth>
            } />

            {/* Admin (optional) */}
            <Route path="/admin/dashboard" element={
              <RequireAuth><RequireRole allow={[ROLES.admin]}><AdminDashboard /></RequireRole></RequireAuth>
            } />
            <Route path="/admin/users" element={
              <RequireAuth><RequireRole allow={[ROLES.admin]}><UserManagement /></RequireRole></RequireAuth>
            } />
            <Route path="/admin/developer" element={
              <RequireAuth><RequireRole allow={[ROLES.admin]}><DeveloperProfile /></RequireRole></RequireAuth>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>

        <BottomNav />
      </BrowserRouter>
    </ErrorBoundary>
  )
}

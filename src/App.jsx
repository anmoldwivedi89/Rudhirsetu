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
import Developers from './pages/Developers'
import { RequireAuth, RequireRole } from './components/ProtectedRoute'
import { ROLES } from './lib/roles'
import RoleRedirect from './components/RoleRedirect'
import BottomNav from './components/BottomNav'

export default function App() {
  return (
    <BrowserRouter>
      <div className="pb-24 md:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<RoleRedirect fallback="/login" />} />
          <Route path="/find-blood" element={<FindBlood />} />
          <Route path="/community" element={<RequireAuth><Community /></RequireAuth>} />
          <Route path="/about" element={<About />} />
          <Route path="/developers" element={<Developers />} />
          {/* Donor */}
          <Route path="/donor/dashboard" element={
            <RequireAuth><RequireRole allow={[ROLES.donor]}><DonorDashboard /></RequireRole></RequireAuth>
          } />
          <Route path="/donor/profile" element={
            <RequireAuth><RequireRole allow={[ROLES.donor]}><DonorProfile /></RequireRole></RequireAuth>
          } />
          <Route path="/donor/requests" element={
            <RequireAuth><RequireRole allow={[ROLES.donor]}><DonorRequests /></RequireRole></RequireAuth>
          } />
          <Route path="/donor/history" element={
            <RequireAuth><RequireRole allow={[ROLES.donor]}><DonorHistory /></RequireRole></RequireAuth>
          } />

          {/* Hospital */}
          <Route path="/hospital/dashboard" element={
            <RequireAuth><RequireRole allow={[ROLES.hospital]}><HospitalDashboard /></RequireRole></RequireAuth>
          } />
          <Route path="/hospital/create-request" element={
            <RequireAuth><RequireRole allow={[ROLES.hospital]}><CreateRequest /></RequireRole></RequireAuth>
          } />
          <Route path="/hospital/tracking" element={
            <RequireAuth><RequireRole allow={[ROLES.hospital]}><RequestTracking /></RequireRole></RequireAuth>
          } />

          {/* Patient */}
          <Route path="/patient/dashboard" element={
            <RequireAuth><RequireRole allow={[ROLES.patient]}><PatientDashboard /></RequireRole></RequireAuth>
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
  )
}

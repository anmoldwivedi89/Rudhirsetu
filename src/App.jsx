import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import FindBlood from './pages/FindBlood'
import About from './pages/About'
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/find-blood" element={<FindBlood />} />
        <Route path="/about" element={<About />} />
        <Route path="/donor/dashboard" element={<DonorDashboard />} />
        <Route path="/donor/profile" element={<DonorProfile />} />
        <Route path="/donor/requests" element={<DonorRequests />} />
        <Route path="/donor/history" element={<DonorHistory />} />
        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        <Route path="/hospital/create-request" element={<CreateRequest />} />
        <Route path="/hospital/tracking" element={<RequestTracking />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/developer" element={<DeveloperProfile />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getDashboardPath } from '../lib/roles'

export function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return null
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

export function RequireRole({ allow, children }) {
  const { role, loading } = useAuth()

  if (loading) return null
  if (!role) return <Navigate to="/" replace />
  if (!allow.includes(role)) return <Navigate to={getDashboardPath(role)} replace />
  return children
}


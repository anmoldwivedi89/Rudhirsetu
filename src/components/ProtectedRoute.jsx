import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getDashboardPath } from '../lib/roles'
import FullScreenLoader from './FullScreenLoader'

export function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <FullScreenLoader label="Signing you in…" />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

export function RequireRole({ allow, children }) {
  const { role, loading } = useAuth()

  if (loading) return <FullScreenLoader label="Loading your dashboard…" />
  if (!role) return <Navigate to="/" replace />
  if (!allow.includes(role)) return <Navigate to={getDashboardPath(role)} replace />
  return children
}


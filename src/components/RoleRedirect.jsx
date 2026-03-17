import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getDashboardPath } from '../lib/roles'

export default function RoleRedirect({ fallback = '/' }) {
  const { user, role, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to={fallback} replace />
  return <Navigate to={getDashboardPath(role)} replace />
}


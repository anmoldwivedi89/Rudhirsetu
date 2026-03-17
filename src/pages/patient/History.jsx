import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, Droplets, Calendar, AlertCircle } from 'lucide-react'
import { Navigate, useLocation } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { PageEnter, GlassCard, SectionTitle, BloodBadge, UrgencyTag } from '../../components/UI'
import { useAuth } from '../../contexts/AuthContext'
import { listRequestsByCreator } from '../../lib/firestoreRequests'
import FullScreenLoader from '../../components/FullScreenLoader'

function HistoryCard({ request, index }) {
  const isCompleted = request.status === 'fulfilled' || request.status === 'completed'
  const isPending = request.status === 'pending' || request.status === 'open'
  const isAccepted = request.status === 'accepted'
  const createdAt = request.createdAt?.toDate
    ? request.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'

  const statusConfig = isCompleted
    ? { icon: CheckCircle, label: 'Completed', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' }
    : isAccepted
    ? { icon: Clock, label: 'Accepted', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' }
    : { icon: AlertCircle, label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' }

  const StatusIcon = statusConfig.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -2, boxShadow: '0 0 18px rgba(248,113,113,0.2)' }}
      className="glass rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <BloodBadge type={request.bloodGroup || '—'} glow />
          <div>
            <p className="text-white font-medium text-sm">
              {request.bloodGroup || '—'} · {request.units || 1} unit{(request.units || 1) > 1 ? 's' : ''}
            </p>
            <p className="text-white/30 text-xs flex items-center gap-1 mt-0.5">
              <Calendar size={10} /> {createdAt}
            </p>
          </div>
        </div>
        <UrgencyTag level={request.urgency || 'medium'} />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xs text-blood-400 bg-blood-500/10 border border-blood-500/20 px-2 py-0.5 rounded-md">
            🩸 {request.units || 1} unit{(request.units || 1) > 1 ? 's' : ''}
          </span>
          {request.createdByLocation && (
            <span className="text-xs text-white/30">📍 {request.createdByLocation}</span>
          )}
        </div>
        <span className={`text-xs flex items-center gap-1 px-2 py-0.5 rounded-full border ${statusConfig.bg} ${statusConfig.color}`}>
          <StatusIcon size={12} /> {statusConfig.label}
        </span>
      </div>

      {/* Accepted by info */}
      {isAccepted && request.acceptedByName && (
        <div className="mt-2 pt-2 border-t border-white/5">
          <p className="text-xs text-white/40">
            Accepted by <span className="text-white/70 font-medium">{request.acceptedByName}</span>
            {request.acceptedByLocation ? ` · ${request.acceptedByLocation}` : ''}
          </p>
        </div>
      )}
    </motion.div>
  )
}

export default function PatientHistory() {
  const { user, loading: authLoading } = useAuth()
  const location = useLocation()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    let active = true
    ;(async () => {
      try {
        const res = await listRequestsByCreator(user.uid)
        if (active) setRequests(res)
      } catch {
        // ignore
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [user])

  if (authLoading) return <FullScreenLoader label="Loading history…" />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />

  return (
    <PageEnter>
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar role="patient" />
        <main className="flex-1 pt-14 md:pt-0">
          <div className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-4xl px-4 md:px-6 py-4 md:py-6">
            <SectionTitle sub={loading ? 'Loading…' : `${requests.length} blood request${requests.length !== 1 ? 's' : ''}`}>
              Request History
            </SectionTitle>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="glass rounded-2xl p-5 border border-white/5 animate-pulse">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-6 bg-white/10 rounded-lg" />
                      <div className="flex-1">
                        <div className="h-3 w-32 bg-white/10 rounded mb-1.5" />
                        <div className="h-2 w-20 bg-white/5 rounded" />
                      </div>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded" />
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && requests.length === 0 && (
              <GlassCard className="p-8 text-center border border-white/10" hover={false}>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4">
                    <Droplets size={24} className="text-red-400" />
                  </div>
                  <p className="text-white font-medium">No request history yet</p>
                  <p className="text-white/30 text-sm mt-1 max-w-xs">
                    Your blood requests will appear here once you create them from the dashboard.
                  </p>
                </div>
              </GlassCard>
            )}

            {/* Request List */}
            {!loading && requests.length > 0 && (
              <div className="flex flex-col gap-3">
                {requests.map((req, i) => (
                  <HistoryCard key={req.id} request={req} index={i} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </PageEnter>
  )
}

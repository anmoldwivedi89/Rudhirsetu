import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Search, Sparkles } from 'lucide-react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { PageEnter, RequestCard, GlassCard, PrimaryBtn, BloodBadge } from '../../components/UI'
import { useAuth } from '../../contexts/AuthContext'
import { acceptRequest, listOpenRequestsForDonor } from '../../lib/firestoreRequests'
import FullScreenLoader from '../../components/FullScreenLoader'

export default function DonorRequests() {
  const { user, profile, loading: authLoading } = useAuth()
  const location = useLocation()
  const [requests, setRequests] = useState([])
  const [accepted, setAccepted] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('active') // 'active' | 'accepted'

  const donorBloodGroup = profile?.bloodGroup || null
  const fetchKey = useMemo(() => donorBloodGroup || 'all', [donorBloodGroup])

  useEffect(() => {
    if (authLoading || !user) return
    let active = true
    setLoading(true)
    ;(async () => {
      try {
        const res = await listOpenRequestsForDonor({ bloodGroup: donorBloodGroup || undefined })
        if (!active) return
        setRequests(res)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [authLoading, user, fetchKey, donorBloodGroup])

  // Never render a blank screen on auth transitions.
  if (authLoading) return <FullScreenLoader label="Loading requests…" />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />

  const toCard = (r) => ({
    id: r.id,
    bloodType: r.bloodGroup,
    distance: r.createdByLocation || '—',
    urgency: r.urgency,
    hospital: r.createdByName || (r.createdByRole === 'hospital' ? 'Hospital' : 'Patient'),
    time: 'just now',
  })

  const activeCount = requests.length
  const acceptedCount = accepted.length

  return (
    <PageEnter>
      <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden md:flex">
        <Sidebar role="donor" />
        <main className="w-full flex-1 pt-16 md:pt-6">
          <div className="max-w-md mx-auto px-4 pb-24 md:max-w-2xl md:px-6 md:pb-8">
            {/* Header */}
            <div className="mb-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl font-semibold text-white">Requests</h1>
                  <p className="text-sm text-gray-400 mt-1">Matching your blood group and location</p>
                </div>
                {donorBloodGroup && (
                  <div className="shrink-0 pt-0.5">
                    <div className="px-3 py-1 text-sm rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                      {donorBloodGroup}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-4">
              <div className="flex bg-white/5 p-1 rounded-xl mb-4">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTab('active')}
                  className={`
                    flex-1 py-2 text-sm rounded-lg transition min-h-[44px]
                    ${tab === 'active' ? 'bg-red-500 text-white' : 'text-gray-400'}
                  `}
                >
                  Active ({activeCount})
                </motion.button>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTab('accepted')}
                  className={`
                    flex-1 py-2 text-sm rounded-lg transition min-h-[44px]
                    ${tab === 'accepted' ? 'bg-red-500 text-white' : 'text-gray-400'}
                  `}
                >
                  Accepted ({acceptedCount})
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-3">
              {tab === 'active' && (
                <>
                  {requests.map((req, idx) => {
                    const card = toCard(req)
                    const critical = String(card.urgency || '').toLowerCase() === 'critical'
                    return (
                      <motion.div
                        key={req.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.2) }}
                        className={critical ? 'drop-shadow-[0_0_18px_rgba(239,68,68,0.18)]' : ''}
                      >
                        <RequestCard
                          {...card}
                          onAccept={async () => {
                            if (!user) return
                            await acceptRequest({ requestId: req.id, donorUid: user.uid })
                            setAccepted(prev => [...prev, req])
                            setRequests(p => p.filter(r => r.id !== req.id))
                            setTab('accepted')
                          }}
                          onIgnore={() => setRequests(p => p.filter(r => r.id !== req.id))}
                        />
                      </motion.div>
                    )
                  })}

                  {(loading || requests.length === 0) && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                      <div className="mx-auto w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                        {loading ? (
                          <Search className="text-red-400" size={26} />
                        ) : (
                          <span className="text-3xl">🔍</span>
                        )}
                      </div>
                      <p className="text-white font-semibold text-base">
                        {loading ? 'Finding requests…' : 'No requests right now'}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        {loading
                          ? 'Hang tight — we’re checking for nearby matches.'
                          : 'Check back later or explore nearby donors'}
                      </p>

                      {!loading && (
                        <Link to="/find-blood" className="block">
                          <button
                            type="button"
                            className="mt-4 w-full py-3 rounded-xl bg-red-500 text-white font-medium active:scale-95 transition min-h-[44px]"
                          >
                            Find Blood
                          </button>
                        </Link>
                      )}
                    </div>
                  )}
                </>
              )}

              {tab === 'accepted' && (
                <>
                  {accepted.length > 0 ? (
                    accepted.map((r, idx) => {
                      const card = toCard(r)
                      return (
                        <motion.div
                          key={r.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.2) }}
                          className="flex items-center gap-3 p-4 glass rounded-2xl border border-green-500/20"
                        >
                          <BloodBadge type={card.bloodType} />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{card.hospital}</p>
                            <p className="text-white/30 text-xs truncate">{card.distance} · {card.time}</p>
                          </div>
                          <span className="text-green-400 text-xs font-medium shrink-0">✓ Accepted</span>
                        </motion.div>
                      )
                    })
                  ) : (
                    <GlassCard hover={false} className="p-8 text-center border border-white/10">
                      <div className="mx-auto w-14 h-14 rounded-2xl glass border border-white/10 flex items-center justify-center mb-4">
                        <span className="text-2xl">🩸</span>
                      </div>
                      <p className="text-white font-semibold text-base">No accepted requests yet</p>
                      <p className="text-white/30 text-sm mt-1">When you accept a request, it will show up here.</p>
                      <div className="mt-5">
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setTab('active')}
                          className="w-full min-h-[44px] rounded-xl glass border border-white/10 text-white/80 font-semibold"
                        >
                          View Active Requests
                        </motion.button>
                      </div>
                    </GlassCard>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </PageEnter>
  )
}

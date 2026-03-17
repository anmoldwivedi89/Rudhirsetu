import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../../components/Sidebar'
import { PageEnter, RequestCard, GlassCard, SectionTitle, BloodBadge, UrgencyTag } from '../../components/UI'
import { useAuth } from '../../contexts/AuthContext'
import { acceptRequest, listOpenRequestsForDonor } from '../../lib/firestoreRequests'

export default function DonorRequests() {
  const { user, profile } = useAuth()
  const [requests, setRequests] = useState([])
  const [accepted, setAccepted] = useState([])
  const [loading, setLoading] = useState(true)

  const donorBloodGroup = profile?.bloodGroup || null
  const fetchKey = useMemo(() => donorBloodGroup || 'all', [donorBloodGroup])

  useEffect(() => {
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
  }, [fetchKey, donorBloodGroup])

  const toCard = (r) => ({
    id: r.id,
    bloodType: r.bloodGroup,
    distance: r.createdByLocation || '—',
    urgency: r.urgency,
    hospital: r.createdByName || (r.createdByRole === 'hospital' ? 'Hospital' : 'Patient'),
    time: 'just now',
  })

  return (
    <PageEnter>
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar role="donor" />
        <main className="flex-1 p-4 md:p-6 pt-18 md:pt-6">
          <div className="max-w-2xl">
            <SectionTitle sub="Blood requests matching your group and location">Nearby Requests</SectionTitle>

            <div className="flex gap-2 mb-4 text-sm">
              <span className="glass-red text-blood-400 border border-blood-500/20 px-3 py-1.5 rounded-lg">{requests.length} Active</span>
              <span className="glass text-white/40 border border-white/10 px-3 py-1.5 rounded-lg">{accepted.length} Accepted</span>
            </div>

            <div className="flex flex-col gap-3">
              {requests.map(req => (
                <RequestCard
                  key={req.id}
                  {...toCard(req)}
                  onAccept={async () => {
                    if (!user) return
                    await acceptRequest({ requestId: req.id, donorUid: user.uid })
                    setAccepted(prev => [...prev, req])
                    setRequests(p => p.filter(r => r.id !== req.id))
                  }}
                  onIgnore={() => setRequests(p => p.filter(r => r.id !== req.id))}
                />
              ))}

              {accepted.length > 0 && (
                <div className="mt-4">
                  <p className="text-white/40 text-sm mb-3">Accepted Requests</p>
                  {accepted.map(r => (
                    <div key={r.id} className="flex items-center gap-3 p-4 glass rounded-2xl mb-2 border border-green-500/20">
                      <BloodBadge type={r.bloodType} />
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{r.hospital}</p>
                        <p className="text-white/30 text-xs">{r.distance} · {r.time}</p>
                      </div>
                      <span className="text-green-400 text-xs">✓ Accepted</span>
                    </div>
                  ))}
                </div>
              )}

              {(loading || (requests.length === 0 && accepted.length === 0)) && (
                <GlassCard className="p-10 text-center">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="text-white/60">{loading ? 'Loading requests…' : 'No requests right now'}</p>
                  <p className="text-white/30 text-sm mt-1">Check back soon!</p>
                </GlassCard>
              )}
            </div>
          </div>
        </main>
      </div>
    </PageEnter>
  )
}

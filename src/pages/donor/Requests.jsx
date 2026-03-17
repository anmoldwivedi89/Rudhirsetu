import { useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../../components/Sidebar'
import { PageEnter, RequestCard, GlassCard, SectionTitle, BloodBadge, UrgencyTag } from '../../components/UI'

const allRequests = [
  { id: 1, bloodType: 'B+', distance: '0.8 km', urgency: 'critical', hospital: 'Apollo Mumbai', time: '2 min ago' },
  { id: 2, bloodType: 'O-', distance: '1.4 km', urgency: 'high', hospital: 'AIIMS Delhi', time: '8 min ago' },
  { id: 3, bloodType: 'B+', distance: '2.2 km', urgency: 'medium', hospital: 'Fortis Hospital', time: '20 min ago' },
  { id: 4, bloodType: 'AB+', distance: '3.0 km', urgency: 'low', hospital: 'City Hospital', time: '1 hr ago' },
  { id: 5, bloodType: 'A+', distance: '4.5 km', urgency: 'medium', hospital: 'Max Healthcare', time: '2 hr ago' },
]

export default function DonorRequests() {
  const [requests, setRequests] = useState(allRequests)
  const [accepted, setAccepted] = useState([])

  return (
    <PageEnter>
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar role="donor" />
        <main className="flex-1 p-6">
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
                  {...req}
                  onAccept={() => { setAccepted(prev => [...prev, req]); setRequests(p => p.filter(r => r.id !== req.id)) }}
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

              {requests.length === 0 && accepted.length === 0 && (
                <GlassCard className="p-10 text-center">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="text-white/60">No requests right now</p>
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

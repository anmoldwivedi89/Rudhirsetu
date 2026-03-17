import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Droplets, Heart, Award, Bell, CheckCircle, TrendingUp, Users, Clock } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import EmergencyModal from '../../components/EmergencyModal'
import {
  PageEnter, BloodBadge, StatCard, GlassCard, Toggle, SectionTitle,
  RequestCard, NotifItem, AchievementBadge, UrgencyTag
} from '../../components/UI'
import { useAuth } from '../../contexts/AuthContext'

const nearbyRequests = [
  { id: 1, bloodType: 'B+', distance: '0.8 km', urgency: 'critical', hospital: 'Apollo Mumbai', time: '2 min ago' },
  { id: 2, bloodType: 'O-', distance: '1.4 km', urgency: 'high', hospital: 'AIIMS Delhi', time: '8 min ago' },
  { id: 3, bloodType: 'B+', distance: '2.2 km', urgency: 'medium', hospital: 'Fortis Hospital', time: '20 min ago' },
]

const notifications = [
  { type: 'alert', message: 'Critical B+ request 0.8km from you — Apollo Mumbai', time: '2 min ago' },
  { type: 'success', message: 'You donated on Feb 14. Next eligibility: May 14', time: 'Yesterday' },
  { type: 'info', message: 'You earned the "Life Saver" badge! 🏅', time: '3 days ago' },
  { type: 'warning', message: 'Eligibility check due in 7 days', time: '1 week ago' },
]

const badges = [
  { emoji: '🩸', label: 'First Drop', earned: true },
  { emoji: '❤️', label: 'Life Saver', earned: true },
  { emoji: '⭐', label: '5 Donations', earned: true },
  { emoji: '🏅', label: 'Hero Donor', earned: false },
  { emoji: '🔥', label: 'Streak x3', earned: true },
  { emoji: '🌟', label: 'Legend', earned: false },
]

export default function DonorDashboard() {
  const [available, setAvailable] = useState(true)
  const [requests, setRequests] = useState(nearbyRequests)
  const [accepted, setAccepted] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const { profile } = useAuth()

  const displayName = profile?.name || 'Donor'
  const displayLocation = profile?.location || '—'
  const displayBloodGroup = profile?.bloodGroup || '—'
  const initials = useMemo(() => {
    const parts = (profile?.name || '').trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return 'RS'
    return parts.slice(0, 2).map(p => p[0].toUpperCase()).join('')
  }, [profile?.name])

  const handleAccept = (id) => {
    const req = requests.find(r => r.id === id)
    setAccepted(prev => [...prev, req])
    setRequests(prev => prev.filter(r => r.id !== id))
  }
  const handleIgnore = (id) => setRequests(prev => prev.filter(r => r.id !== id))

  return (
    <PageEnter>
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar role="donor" />

        <main className="flex-1 overflow-auto pt-14 md:pt-0">
          {/* Top Bar */}
          <div className="sticky top-0 z-30 glass border-b border-white/5 px-4 md:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-syne font-bold text-white text-xl">Donor Dashboard</h1>
              <p className="text-white/40 text-xs">Mumbai, Maharashtra · {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
            </div>
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <Toggle checked={available} onChange={setAvailable} label={available ? 'Available' : 'Unavailable'} />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setModalOpen(true)}
                className="bg-blood-500/20 border border-blood-500/30 text-blood-400 text-sm px-4 py-2 rounded-xl hover:bg-blood-500/30 transition-all"
              >
                🚨 Emergency
              </motion.button>
              <div className="relative">
                <div className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-white/60 cursor-pointer hover:text-white transition-colors">
                  <Bell size={16} />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blood-500 text-white text-[9px] flex items-center justify-center font-bold">
                  {notifications.length}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6 max-w-6xl">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-red rounded-3xl p-6 mb-6 border border-blood-500/20 flex flex-col md:flex-row items-start md:items-center gap-6"
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blood-500 to-blood-700 flex items-center justify-center font-syne font-black text-2xl text-white">
                  {initials}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-black ${available ? 'bg-green-400' : 'bg-white/30'}`} />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h2 className="font-syne text-xl font-bold text-white">{displayName}</h2>
                  <BloodBadge type={displayBloodGroup} glow />
                  <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">
                    <CheckCircle size={10} /> Verified
                  </span>
                </div>
                <p className="text-white/40 text-sm">📍 {displayLocation}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 md:gap-6 text-center">
                {[
                  { label: 'Donations', value: '8' },
                  { label: 'Lives Saved', value: '8' },
                  { label: 'Streak', value: '3🔥' },
                ].map(s => (
                  <div key={s.label}>
                    <p className="font-syne text-2xl font-black text-white">{s.value}</p>
                    <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard icon={Droplets} label="Total Donations" value="8" sub="+1 this month" color="red" />
              <StatCard icon={Heart} label="Lives Saved" value="8" sub="Est. impact" color="red" />
              <StatCard icon={Clock} label="Days Till Eligible" value="42" sub="Next: May 14" color="blue" />
              <StatCard icon={Award} label="Badges Earned" value="4" sub="2 more available" color="purple" />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Nearby Requests */}
              <div className="lg:col-span-2">
                <SectionTitle sub={`${requests.length} active · sorted by distance`}>Nearby Requests</SectionTitle>

                {available ? (
                  <div className="flex flex-col gap-3">
                    {requests.length > 0 ? requests.map(req => (
                      <RequestCard
                        key={req.id}
                        {...req}
                        onAccept={() => handleAccept(req.id)}
                        onIgnore={() => handleIgnore(req.id)}
                      />
                    )) : (
                      <GlassCard className="p-8 text-center">
                        <p className="text-4xl mb-3">✅</p>
                        <p className="text-white/60 font-medium">All requests handled!</p>
                        <p className="text-white/30 text-sm mt-1">You're amazing 🎉</p>
                      </GlassCard>
                    )}

                    {accepted.length > 0 && (
                      <div>
                        <p className="text-white/40 text-sm font-medium mb-2 mt-2">Accepted ({accepted.length})</p>
                        {accepted.map(req => (
                          <div key={req.id} className="flex items-center gap-3 p-3 glass rounded-xl mb-2 border border-green-500/20">
                            <BloodBadge type={req.bloodType} />
                            <div className="flex-1">
                              <p className="text-white text-sm">{req.hospital}</p>
                              <p className="text-white/30 text-xs">{req.distance}</p>
                            </div>
                            <span className="text-green-400 text-xs flex items-center gap-1"><CheckCircle size={12} /> Accepted</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <GlassCard className="p-8 text-center">
                    <p className="text-4xl mb-3">💤</p>
                    <p className="text-white/60 font-medium">You're currently unavailable</p>
                    <p className="text-white/30 text-sm mt-1">Toggle availability to see requests</p>
                  </GlassCard>
                )}

                {/* Gamification */}
                <div className="mt-6">
                  <SectionTitle sub="Collect all 8 badges">Achievements</SectionTitle>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {badges.map(b => (
                      <AchievementBadge key={b.label} {...b} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Panel */}
              <div className="flex flex-col gap-4">
                {/* Eligibility Card */}
                <GlassCard className="p-5">
                  <h3 className="font-syne font-bold text-white mb-4">Eligibility Status</h3>
                  <div className="flex flex-col items-center py-4">
                    <div className="w-24 h-24 rounded-full border-4 border-white/10 relative flex items-center justify-center mb-4">
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="48" cy="48" r="44" stroke="rgba(239,68,68,0.2)" strokeWidth="6" fill="none" />
                        <circle cx="48" cy="48" r="44" stroke="#ef4444" strokeWidth="6" fill="none"
                          strokeDasharray={276} strokeDashoffset={276 * (1 - 42/90)} strokeLinecap="round" />
                      </svg>
                      <div className="text-center">
                        <p className="font-syne font-black text-xl text-white">42</p>
                        <p className="text-white/40 text-[9px]">days</p>
                      </div>
                    </div>
                    <p className="text-blood-400 font-medium text-sm">Next Eligible: May 14</p>
                    <p className="text-white/30 text-xs mt-1">Last donated: Feb 14</p>
                  </div>
                </GlassCard>

                {/* Notifications */}
                <GlassCard className="p-5">
                  <h3 className="font-syne font-bold text-white mb-3">Notifications</h3>
                  <div>
                    {notifications.slice(0, 4).map((n, i) => (
                      <NotifItem key={i} {...n} />
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </main>
      </div>
      <EmergencyModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </PageEnter>
  )
}

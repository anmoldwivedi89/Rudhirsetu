import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Bell, Droplets, MapPin, Search, Users } from 'lucide-react'
import { PageEnter, GlassCard, StatCard, SectionTitle, NotifItem, BloodBadge, UrgencyTag } from '../../components/UI'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../contexts/AuthContext'
import { listDonors } from '../../lib/firestoreUsers'
import { createBloodRequest, listRequestsByCreator } from '../../lib/firestoreRequests'
import { formatKm, haversineKm } from '../../lib/geo'

export default function PatientDashboard() {
  const { user, profile } = useAuth()
  const [donors, setDonors] = useState([])
  const [myRequests, setMyRequests] = useState([])
  const [reqOpen, setReqOpen] = useState(false)
  const [reqForm, setReqForm] = useState({ blood: '', units: '1', urgency: 'critical', notes: '', locationText: '' })
  const [reqGeo, setReqGeo] = useState(null)
  const [reqLoading, setReqLoading] = useState(false)
  const [geoLoading, setGeoLoading] = useState(false)
  const [detailReq, setDetailReq] = useState(null)

  const displayName = profile?.name || 'Patient'
  const displayLocation = profile?.location || 'Kanpur'
  const initials = useMemo(() => {
    const parts = (profile?.name || '').trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return 'RS'
    return parts.slice(0, 2).map(p => p[0].toUpperCase()).join('')
  }, [profile?.name])

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await listDonors()
        if (active) setDonors(res)
      } catch {
        // ignore
      }
    })()
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!user) return
    let active = true
    ;(async () => {
      const res = await listRequestsByCreator(user.uid)
      if (active) setMyRequests(res)
    })()
    return () => { active = false }
  }, [user])

  const notifications = [
    { id: 1, type: 'success', message: 'Your blood request was accepted by 2 donors.', time: '1 hr ago' },
    { id: 2, type: 'info', message: 'New update on your request status.', time: '3 hrs ago' },
  ]

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

  const submitRequest = async () => {
    if (!user?.uid || !reqForm.blood) return
    setReqLoading(true)
    try {
      await createBloodRequest({
        createdBy: user.uid,
        createdByRole: 'patient',
        createdByName: profile?.name || null,
        createdByLocation: (reqForm.locationText || '').trim() || profile?.location || null,
        createdByGeo: reqGeo || null,
        bloodGroup: reqForm.blood,
        units: reqForm.units,
        urgency: reqForm.urgency,
        notes: reqForm.notes,
      })
      const res = await listRequestsByCreator(user.uid)
      setMyRequests(res)
      setReqOpen(false)
      setReqForm({ blood: '', units: '1', urgency: 'critical', notes: '', locationText: '' })
      setReqGeo(null)
    } finally {
      setReqLoading(false)
    }
  }

  const captureLiveLocation = () => {
    if (!navigator.geolocation) return
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const lat = p.coords.latitude
        const lng = p.coords.longitude
        setReqGeo({ lat, lng })
        setReqForm(f => ({
          ...f,
          locationText: f.locationText?.trim() ? f.locationText : `Live: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        }))
        setGeoLoading(false)
      },
      () => setGeoLoading(false),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const activeCount = myRequests.filter(r => r.status !== 'fulfilled').length

  return (
    <PageEnter>
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar role="patient" />

        <main className="flex-1 overflow-auto pt-14 md:pt-0">
          {/* Sticky Top Bar */}
          <div className="sticky top-0 z-30 glass border-b border-white/5 px-4 md:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blood-500 to-blood-700 flex items-center justify-center font-syne font-bold text-sm text-white">
                  {initials}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-[#0a0a0a]" />
              </div>
              <div>
                <h1 className="font-syne font-bold text-white text-xl">Patient Dashboard</h1>
                <p className="text-white/40 text-xs">
                  {displayLocation} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setReqOpen(true)}
                className="bg-blood-500/20 border border-blood-500/30 text-blood-400 text-sm px-4 py-2 rounded-xl hover:bg-blood-500/30 transition-all min-h-[44px]"
              >
                🚨 Emergency
              </motion.button>
              <div className="relative">
                <div className="w-11 h-11 rounded-xl glass border border-white/10 flex items-center justify-center text-white/60 cursor-pointer hover:text-white transition-colors">
                  <Bell size={16} />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blood-500 text-white text-[9px] flex items-center justify-center font-bold">
                  {notifications.length}
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-6xl px-4 md:px-6 py-4 md:py-6">
            {/* Primary CTA */}
            <div className="space-y-2 mb-6">
              <motion.button
                whileHover={{ scale: 1.01, boxShadow: '0 0 30px rgba(239,68,68,0.5)' }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-xl bg-blood-500 text-white font-medium transition shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:bg-blood-600"
                onClick={() => setReqOpen(true)}
              >
                🚨 Request Blood Now
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 rounded-xl glass text-gray-200 font-medium border border-white/10 flex items-center justify-center gap-2 hover:bg-white/10 transition"
              >
                <Search size={18} /> Find Donors Nearby
              </motion.button>
            </div>

            {/* Request Sheet */}
            <AnimatePresence>
              {reqOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden mb-6"
                >
                  <GlassCard className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur" hover={false}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-syne font-bold text-white text-base">Create Blood Request</h3>
                        <p className="text-xs text-gray-400">This will be visible to nearby donors.</p>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="text-xs text-gray-400 hover:text-gray-200 transition"
                        onClick={() => setReqOpen(false)}
                      >
                        Close
                      </motion.button>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="text-[11px] font-medium text-gray-400 block mb-1">Blood Group *</label>
                        <select
                          value={reqForm.blood}
                          onChange={(e) => setReqForm(f => ({ ...f, blood: e.target.value }))}
                          className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2.5 text-sm outline-none text-white placeholder:text-gray-500"
                        >
                          <option value="">Select</option>
                          {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-gray-400 block mb-1">Units</label>
                        <select
                          value={reqForm.units}
                          onChange={(e) => setReqForm(f => ({ ...f, units: e.target.value }))}
                          className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2.5 text-sm outline-none text-white"
                        >
                          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-gray-400 block mb-1">Urgency</label>
                        <select
                          value={reqForm.urgency}
                          onChange={(e) => setReqForm(f => ({ ...f, urgency: e.target.value }))}
                          className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2.5 text-sm outline-none text-white"
                        >
                          <option value="critical">Critical</option>
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-gray-400 block mb-1">Notes</label>
                        <input
                          value={reqForm.notes}
                          onChange={(e) => setReqForm(f => ({ ...f, notes: e.target.value }))}
                          placeholder="Any details…"
                          className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2.5 text-sm outline-none text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-gray-400 block mb-1">Location (optional)</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            value={reqForm.locationText}
                            onChange={(e) => setReqForm(f => ({ ...f, locationText: e.target.value }))}
                            placeholder="Type address / area (or use live location)"
                            className="flex-1 rounded-xl border border-white/15 bg-black/60 px-3 py-2.5 text-sm outline-none text-white placeholder:text-gray-500"
                          />
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.95 }}
                            onClick={captureLiveLocation}
                            className="px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 text-xs text-gray-200 hover:bg-white/10 transition"
                          >
                            {geoLoading ? 'Locating…' : 'Share live location'}
                          </motion.button>
                        </div>
                        {reqGeo && (
                          <p className="text-[11px] text-emerald-400 mt-1">
                            Live location attached: {reqGeo.lat.toFixed(4)}, {reqGeo.lng.toFixed(4)}
                          </p>
                        )}
                        {!reqGeo && (
                          <p className="text-[11px] text-gray-500 mt-1">
                            If you don't know address, use "Share live location".
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <motion.button
                        whileHover={{ boxShadow: '0 0 20px rgba(239,68,68,0.4)' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={submitRequest}
                        disabled={!reqForm.blood || reqLoading}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_16px_rgba(239,68,68,0.4)] hover:bg-red-600"
                      >
                        {reqLoading ? 'Creating…' : 'Create Request'}
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        className="px-4 py-2.5 rounded-xl border border-white/15 text-sm text-gray-200 hover:bg-white/5 transition"
                        onClick={() => setReqOpen(false)}
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard icon={Activity} label="Active Requests" value={String(activeCount)} sub="Currently open" color="red" />
              <StatCard icon={Droplets} label="Units Received" value="2" sub="Total units" color="blue" />
              <StatCard icon={Users} label="Donors Reached" value={String(donors.length)} sub="In your area" color="green" />
              <StatCard icon={Bell} label="Alerts Sent" value="3" sub="Notifications" color="purple" />
            </div>

            {/* Active Requests */}
            <SectionTitle sub={`${myRequests.length} total · last 4 shown`}>Active Requests</SectionTitle>
            <GlassCard className="p-4 border border-white/10 mb-6" hover={false}>
              {myRequests.slice(0, 4).map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -2, boxShadow: '0 0 18px rgba(248,113,113,0.25)' }}
                  className="mb-2 last:mb-0 rounded-xl border border-white/5 bg-white/5 px-3 py-3 flex items-start justify-between gap-3 cursor-pointer transition-all"
                >
                  <div className="flex items-start gap-3">
                    <BloodBadge type={r.bloodGroup} glow />
                    <div>
                      <p className="text-sm font-medium text-white">
                        {r.status}
                        {r.status === 'accepted' && r.acceptedByRole === 'hospital' && r.acceptedByName ? ` · ${r.acceptedByName}` : ''}
                      </p>
                      <p className="text-[11px] text-gray-400">{r.createdByLocation || '—'}</p>
                    </div>
                  </div>
                  <UrgencyTag level={r.urgency} />
                </motion.div>
              ))}
              {myRequests.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-3">
                    <Droplets size={20} className="text-red-400" />
                  </div>
                  <p className="text-sm font-medium text-white">No active requests yet</p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Tap "Request Blood Now" to create your first request.
                  </p>
                </div>
              )}
            </GlassCard>

            {/* Recent Updates */}
            <SectionTitle sub={`${notifications.length} updates`}>Recent Updates</SectionTitle>
            <div className="space-y-2 mb-6">
              {notifications.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -2, boxShadow: '0 0 14px rgba(248,113,113,0.2)' }}
                  className="bg-white/5 border border-white/10 rounded-xl p-3 transition-all"
                >
                  <NotifItem {...n} tone="dark" />
                </motion.div>
              ))}
            </div>

            {/* Nearby Donors */}
            <SectionTitle sub={`${donors.length} donors found`}>Nearby Donors</SectionTitle>
            <div className="space-y-2 mb-6">
              {donors.length === 0 ? (
                <GlassCard className="p-6 border border-white/10" hover={false}>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                      <MapPin size={20} className="text-gray-300" />
                    </div>
                    <p className="text-sm font-medium text-white">No donors around yet</p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Once donors join from your area, they will appear here automatically.
                    </p>
                  </div>
                </GlassCard>
              ) : (
                donors.slice(0, 6).map((d, i) => (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ y: -2, boxShadow: '0 0 14px rgba(248,113,113,0.25)' }}
                    className="flex justify-between items-center bg-white/5 border border-white/10 rounded-xl p-3 cursor-pointer transition-all"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{d.name || 'Unnamed Donor'}</p>
                      <p className="text-[11px] text-gray-400">{d.location || '—'}</p>
                      <p className="text-[11px] text-gray-500">{d.phone || '—'}</p>
                    </div>
                    <BloodBadge type={d.bloodGroup || '—'} glow />
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Hospital details popup */}
      <AnimatePresence>
        {detailReq && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center px-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDetailReq(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md bg-neutral-950 rounded-2xl border border-white/10 p-5 shadow-[0_0_32px_rgba(0,0,0,0.8)]"
            >
              <h3 className="font-syne font-black text-white text-lg mb-1">Hospital Accepted Your Request</h3>
              <p className="text-sm text-gray-300 mb-4">
                {detailReq.acceptedByName || 'Hospital'} accepted {detailReq.acceptedUnits || detailReq.units || 1} unit(s)
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-gray-400">Hospital</span>
                  <span className="text-gray-100 font-medium text-right">{detailReq.acceptedByName || '—'}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-gray-400">Location</span>
                  <span className="text-gray-100 text-right">{detailReq.acceptedByLocation || '—'}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-gray-400">Contact</span>
                  <span className="text-gray-100 text-right">{detailReq.acceptedByPhone || '—'}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-gray-400">Distance</span>
                  <span className="text-gray-100 text-right">
                    {(() => {
                      const a = detailReq.createdByGeo
                      const b = detailReq.acceptedByGeo
                      const ag = a && typeof a.lat === 'number' && typeof a.lng === 'number' ? { lat: a.lat, lng: a.lng } : null
                      const bg = b && typeof b.lat === 'number' && typeof b.lng === 'number' ? { lat: b.lat, lng: b.lng } : null
                      return ag && bg ? formatKm(haversineKm(ag, bg)) : '—'
                    })()}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ boxShadow: '0 0 15px rgba(239,68,68,0.4)' }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition"
                  onClick={() => setDetailReq(null)}
                >
                  OK
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageEnter>
  )
}

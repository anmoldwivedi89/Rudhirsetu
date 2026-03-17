import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PlusCircle, Users, CheckCircle, Clock, Activity, TrendingUp, Droplets, Bell } from 'lucide-react'
import { Link } from 'react-router-dom'
import EmergencyModal from '../../components/EmergencyModal'
import { PageEnter, GlassCard, StatCard, SectionTitle, BloodBadge, UrgencyTag } from '../../components/UI'
import { useAuth } from '../../contexts/AuthContext'
import { listDonors } from '../../lib/firestoreUsers'
import { acceptPatientRequestByHospital, listOpenPatientRequests } from '../../lib/firestoreRequests'
import { formatKm, haversineKm } from '../../lib/geo'

const activeRequests = [
  { id: 1, blood: 'O-', patient: 'Emergency Surgery', units: 3, urgency: 'critical', donors: 2, stage: 3 },
  { id: 2, blood: 'B+', patient: 'Scheduled Transfusion', units: 1, urgency: 'medium', donors: 1, stage: 4 },
  { id: 3, blood: 'AB+', patient: 'Post-Op Recovery', units: 2, urgency: 'high', donors: 0, stage: 2 },
]

const stages = ['Created', 'Broadcasted', 'Accepted', 'Fulfilled']

function RequestLifecycle({ stage }) {
  return (
    <div className="flex items-center gap-1 mt-3">
      {stages.map((s, i) => (
        <div key={s} className="flex items-center gap-1 flex-1 last:flex-none">
          <div className={`flex flex-col items-center gap-1`}>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px] font-bold transition-all ${
              i + 1 <= stage ? 'bg-blood-500 border-blood-500 text-white' : 'bg-transparent border-white/20 text-white/20'
            }`}>
              {i + 1 <= stage ? '✓' : i + 1}
            </div>
            <span className={`text-[9px] whitespace-nowrap ${i + 1 <= stage ? 'text-white/60' : 'text-white/20'}`}>{s}</span>
          </div>
          {i < stages.length - 1 && (
            <div className={`flex-1 h-px mb-3 ${i + 1 < stage ? 'bg-blood-500' : 'bg-white/10'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function HospitalDashboard() {
  const [modalOpen, setModalOpen] = useState(false)
  const { user, profile } = useAuth()
  const [donors, setDonors] = useState([])
  const [patientRequests, setPatientRequests] = useState([])
  const [accepting, setAccepting] = useState(null) // request
  const [acceptUnits, setAcceptUnits] = useState('1')
  const [acceptLoading, setAcceptLoading] = useState(false)

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
    let active = true
    ;(async () => {
      try {
        const res = await listOpenPatientRequests()
        if (active) setPatientRequests(res)
      } catch {
        // ignore (may require index)
      }
    })()
    return () => { active = false }
  }, [])

  const hospitalGeo = profile?.geo && typeof profile.geo.lat === 'number' && typeof profile.geo.lng === 'number'
    ? { lat: profile.geo.lat, lng: profile.geo.lng }
    : null

  const hospitalAvailable = Array.isArray(profile?.availableBloodGroups) ? profile.availableBloodGroups : null

  const nearbyPatientRequests = patientRequests
    .map(r => {
      const pg = r.createdByGeo && typeof r.createdByGeo.lat === 'number' && typeof r.createdByGeo.lng === 'number'
        ? { lat: r.createdByGeo.lat, lng: r.createdByGeo.lng }
        : null
      const km = hospitalGeo && pg ? haversineKm(hospitalGeo, pg) : null
      return { ...r, _km: km }
    })
    .filter(r => !hospitalAvailable || (r.bloodGroup && hospitalAvailable.includes(r.bloodGroup)))
    .sort((a, b) => (a._km ?? 1e9) - (b._km ?? 1e9))

  return (
    <PageEnter>
      <div className="w-full">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 glass border-b border-white/5 px-4 md:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="px-0 md:px-0">
            <h1 className="font-syne font-bold text-white text-xl">Hospital Command Center</h1>
            <p className="text-white/40 text-xs">
              {profile?.name || 'Hospital'}{profile?.location ? ` · ${profile.location}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <Link to="/hospital/create-request">
              <motion.button
                whileHover={{ boxShadow: '0 0 20px rgba(239,68,68,0.4)' }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-blood-500 text-white font-medium px-4 py-2 rounded-xl text-sm hover:bg-blood-600 transition-colors min-h-[44px]"
              >
                <PlusCircle size={16} /> New Request
              </motion.button>
            </Link>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setModalOpen(true)}
              className="glass-red border border-blood-500/30 text-blood-400 text-sm px-4 py-2 rounded-xl min-h-[44px]"
            >
              🚨 Emergency
            </motion.button>
          </div>
        </div>

        <div className="pt-4">
          {/* Hospital Profile */}
          <GlassCard className="p-5 mb-6 border border-white/10">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-white/40 text-xs mb-1">HOSPITAL</p>
                <h2 className="font-syne font-black text-white text-xl">
                  {profile?.name || 'Your Hospital'}
                </h2>
                <p className="text-white/50 text-sm mt-1">
                  {profile?.location || 'Add hospital address/location in profile'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {(profile?.availableBloodGroups || []).slice(0, 6).map(bg => (
                  <BloodBadge key={bg} type={bg} size="sm" />
                ))}
                {!profile?.availableBloodGroups && (
                  <span className="text-white/30 text-xs">Set available blood groups in profile</span>
                )}
              </div>
            </div>
          </GlassCard>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard icon={Activity} label="Active Requests" value="3" sub="2 critical" color="red" />
              <StatCard icon={CheckCircle} label="Fulfilled (Month)" value="28" sub="+12% vs last" color="green" />
              <StatCard icon={Users} label="Donors Matched" value="47" sub="This month" color="blue" />
              <StatCard icon={Clock} label="Avg Response" value="6m" sub="Industry best" color="purple" />
            </div>

            {/* Active Requests */}
            <SectionTitle sub="Tap to manage each request">Active Blood Requests</SectionTitle>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {activeRequests.map((req, i) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="glass rounded-2xl p-5 border border-white/5 hover:border-white/10 cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <BloodBadge type={req.blood} glow />
                    <UrgencyTag level={req.urgency} />
                  </div>
                  <p className="text-white font-medium text-sm">{req.patient}</p>
                  <div className="flex gap-3 mt-2">
                    <span className="text-white/40 text-xs">🩸 {req.units} units</span>
                    <span className="text-white/40 text-xs">👥 {req.donors} donors</span>
                  </div>
                  <RequestLifecycle stage={req.stage} />
                </motion.div>
              ))}
            </div>

            {/* Nearby Patient Requests */}
            <SectionTitle sub={hospitalGeo ? 'Sorted by distance (live location)' : 'Add hospital geo to compute distance'}>Nearby Patient Requests</SectionTitle>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {nearbyPatientRequests.slice(0, 6).map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <BloodBadge type={r.bloodGroup || '—'} glow />
                    <UrgencyTag level={r.urgency || 'medium'} />
                  </div>
                  <p className="text-white font-medium text-sm">{r.createdByName || 'Patient'}</p>
                  <p className="text-white/40 text-xs mt-1">{r.createdByLocation || '—'}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-white/50 text-xs">
                      {hospitalGeo ? `📍 ${formatKm(r._km)} away` : '📍 Distance unavailable'}
                    </span>
                    <span className="text-white/40 text-xs">{r.units ? `${r.units} unit(s)` : ''}</span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { setAccepting(r); setAcceptUnits(String(r.units || 1)) }}
                      className="flex-1 text-xs px-3 py-2 rounded-xl bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30 transition-all"
                    >
                      Accept (Hospital)
                    </motion.button>
                  </div>
                </motion.div>
              ))}
              {nearbyPatientRequests.length === 0 && (
                <GlassCard className="p-6 border border-white/10 md:col-span-2 lg:col-span-3">
                  <p className="text-white/40 text-sm">No open patient requests nearby yet.</p>
                </GlassCard>
              )}
            </div>

            {/* Accept popup */}
            {accepting && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                <div className="absolute inset-0 bg-black/70" onClick={() => !acceptLoading && setAccepting(null)} />
                <div className="relative w-full max-w-md glass rounded-2xl border border-white/10 p-5">
                  <h3 className="font-syne font-black text-white text-lg mb-1">Accept Request</h3>
                  <p className="text-white/50 text-sm mb-4">
                    {accepting.createdByName || 'Patient'} · {accepting.bloodGroup} · Requested {accepting.units || 1} unit(s)
                  </p>

                  <label className="text-white/50 text-xs block mb-1">UNITS YOU CAN PROVIDE</label>
                  <input
                    value={acceptUnits}
                    onChange={(e) => setAcceptUnits(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-green-500/40 rounded-xl px-3 py-2.5 text-white text-sm outline-none"
                    inputMode="numeric"
                  />
                  <p className="text-white/30 text-xs mt-1">You can accept partially if you have fewer units.</p>

                  <div className="mt-4 flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      disabled={acceptLoading}
                      onClick={() => setAccepting(null)}
                      className="flex-1 text-sm px-4 py-2.5 rounded-xl glass border border-white/10 text-white/60 hover:text-white transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      disabled={acceptLoading || !user}
                      onClick={async () => {
                        if (!user) return
                        setAcceptLoading(true)
                        try {
                          await acceptPatientRequestByHospital({
                            requestId: accepting.id,
                            hospitalUid: user.uid,
                            hospitalName: profile?.name || null,
                            hospitalLocation: profile?.location || null,
                            hospitalGeo: hospitalGeo || null,
                            hospitalPhone: profile?.phone || null,
                            acceptedUnits: acceptUnits,
                          })
                          // remove from local list
                          setPatientRequests(prev => prev.filter(x => x.id !== accepting.id))
                          setAccepting(null)
                        } finally {
                          setAcceptLoading(false)
                        }
                      }}
                      className="flex-1 text-sm px-4 py-2.5 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      {acceptLoading ? 'Accepting…' : 'Confirm Accept'}
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            {/* Donor Approval */}
            <SectionTitle sub="Confirm or reject incoming donors">Donor Approvals</SectionTitle>
            <div className="flex flex-col gap-3">
              {donors.slice(0, 2).map((d, i) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-xl p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-blood-500/20 border border-blood-500/30 flex items-center justify-center font-syne font-bold text-blood-400 text-sm">
                    {(d.name || 'Donor').split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{d.name || 'Unnamed Donor'}</p>
                    <p className="text-white/40 text-xs">{d.bloodGroup || '—'} · {d.location || '—'}</p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button whileTap={{ scale: 0.95 }} className="text-xs px-3 py-1.5 rounded-lg glass text-white/40 hover:text-red-400 transition-colors">
                      Reject
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ boxShadow: '0 0 12px rgba(34,197,94,0.3)' }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-all"
                    >
                      Approve
                    </motion.button>
                  </div>
                </motion.div>
              ))}
              {donors.length === 0 && (
                <GlassCard className="p-5 border border-white/10">
                  <p className="text-white/40 text-sm">No donors available yet.</p>
                </GlassCard>
              )}
            </div>

            {/* Available Donors */}
            <div className="mt-10">
              <SectionTitle sub="From Firebase users collection (role=donor)">Available Donors</SectionTitle>
              <GlassCard className="p-4 border border-white/10">
                {donors.length === 0 ? (
                  <p className="text-white/40 text-sm">No donors found yet. Create a few donor accounts to see them here.</p>
                ) : (
                  <div className="grid md:grid-cols-2 gap-3">
                    {donors.slice(0, 10).map(d => (
                      <div key={d.id} className="glass rounded-xl p-4 border border-white/10">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-white font-medium text-sm">{d.name || 'Unnamed Donor'}</p>
                            <p className="text-white/40 text-xs mt-0.5">{d.location || '—'}</p>
                            <p className="text-white/40 text-xs mt-0.5">{d.phone || '—'}</p>
                          </div>
                          <BloodBadge type={d.bloodGroup || '—'} size="sm" glow />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
      </div>
      <EmergencyModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </PageEnter>
  )
}

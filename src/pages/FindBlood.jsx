import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Phone, MessageCircle, Filter, SlidersHorizontal } from 'lucide-react'
import Navbar from '../components/Navbar'
import { PageEnter, BloodBadge, UrgencyTag, GlassCard } from '../components/UI'
import EmergencyModal from '../components/EmergencyModal'
import { listHospitals } from '../lib/firestoreUsers'
import { formatKm, haversineKm } from '../lib/geo'
import { listCommunityPosts } from '../lib/firestoreCommunity'

const bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

// Simple map simulation
function MapSimulation({ results }) {
  const pins = [
    { x: 35, y: 45, type: 'hospital', label: 'Apollo' },
    { x: 55, y: 30, type: 'donor', label: 'Rahul M.' },
    { x: 70, y: 60, type: 'hospital', label: 'AIIMS' },
    { x: 25, y: 65, type: 'donor', label: 'Priya S.' },
    { x: 80, y: 35, type: 'donor', label: 'Ankit K.' },
    { x: 50, y: 75, type: 'hospital', label: 'City Hospital' },
    { x: 45, y: 50, type: 'you', label: 'You' },
  ]
  const [hoveredPin, setHoveredPin] = useState(null)

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl bg-[#0f1218]">
      {/* Map grid */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: 'linear-gradient(rgba(239,68,68,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.8) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
      {/* Glow at center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-blood-500/10 blur-[50px]" />

      {/* Road lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.5)" strokeWidth="0.3" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.5)" strokeWidth="0.3" />
        <line x1="0" y1="25" x2="100" y2="75" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2" />
        <line x1="20" y1="0" x2="80" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="0.2" />
      </svg>

      {/* Pins */}
      {pins.map((pin, i) => (
        <div
          key={i}
          className="absolute"
          style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: 'translate(-50%, -50%)' }}
          onMouseEnter={() => setHoveredPin(i)}
          onMouseLeave={() => setHoveredPin(null)}
        >
          {pin.type === 'you' ? (
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-lg shadow-blue-500/50 cursor-pointer"
            />
          ) : (
            <motion.div
              whileHover={{ scale: 1.3 }}
              className={`w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer flex items-center justify-center text-xs font-bold ${
                pin.type === 'hospital' ? 'bg-blood-500 shadow-blood-500/50' : 'bg-green-500 shadow-green-500/50'
              }`}
            >
              {pin.type === 'hospital' ? '🏥' : '🩸'}
            </motion.div>
          )}

          <AnimatePresence>
            {hoveredPin === i && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.9 }}
                animate={{ opacity: 1, y: -5, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.9 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 glass rounded-xl px-3 py-2 whitespace-nowrap text-xs text-white border border-white/10 z-10"
              >
                {pin.label}
              </motion.div>
            )}
          </AnimatePresence>

          {pin.type !== 'you' && (
            <motion.div
              animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`absolute inset-0 rounded-full ${pin.type === 'hospital' ? 'bg-blood-500/30' : 'bg-green-500/30'}`}
            />
          )}
        </div>
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 glass rounded-lg px-3 py-1.5">
          <div className="w-3 h-3 rounded-full bg-blood-500" />
          <span className="text-xs text-white/60">Hospital</span>
        </div>
        <div className="flex items-center gap-2 glass rounded-lg px-3 py-1.5">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs text-white/60">Donor</span>
        </div>
        <div className="flex items-center gap-2 glass rounded-lg px-3 py-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-xs text-white/60">You</span>
        </div>
      </div>
    </div>
  )
}

export default function FindBlood() {
  const [tab, setTab] = useState('hospitals') // hospitals | donors
  const [search, setSearch] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [contacted, setContacted] = useState(new Set())
  const [pos, setPos] = useState(null) // { lat, lng }
  const [posError, setPosError] = useState('')
  const [watching, setWatching] = useState(false)
  const [hospitals, setHospitals] = useState([])
  const [loadingHospitals, setLoadingHospitals] = useState(true)
  const [donorPosts, setDonorPosts] = useState([])
  const [loadingDonors, setLoadingDonors] = useState(true)
  const [detail, setDetail] = useState(null) // selected row for modal

  useEffect(() => {
    if (!navigator.geolocation) {
      setPosError('Geolocation not supported on this device.')
      return
    }
    setWatching(true)
    const id = navigator.geolocation.watchPosition(
      (p) => {
        setPosError('')
        setPos({ lat: p.coords.latitude, lng: p.coords.longitude })
      },
      (err) => {
        setPosError(err.message || 'Location permission denied.')
        setWatching(false)
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 },
    )
    return () => {
      navigator.geolocation.clearWatch(id)
      setWatching(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    setLoadingHospitals(true)
    ;(async () => {
      try {
        const blood = selectedGroup === 'All' ? undefined : selectedGroup
        const res = await listHospitals({ bloodGroup: blood })
        if (!active) return
        setHospitals(res)
      } finally {
        if (active) setLoadingHospitals(false)
      }
    })()
    return () => { active = false }
  }, [selectedGroup])

  useEffect(() => {
    let active = true
    setLoadingDonors(true)
    ;(async () => {
      try {
        const res = await listCommunityPosts({ type: 'donor_offer', bloodGroup: selectedGroup })
        if (!active) return
        setDonorPosts(res)
      } finally {
        if (active) setLoadingDonors(false)
      }
    })()
    return () => { active = false }
  }, [selectedGroup])

  const hospitalRows = useMemo(() => {
    const blood = selectedGroup === 'All' ? null : selectedGroup
    const filtered = hospitals
      .filter(h => !blood || (Array.isArray(h.availableBloodGroups) ? h.availableBloodGroups.includes(blood) : true))
      .filter(h => search === '' || (h.name || '').toLowerCase().includes(search.toLowerCase()))
      .map(h => {
        const geo = h.geo && typeof h.geo.lat === 'number' && typeof h.geo.lng === 'number'
          ? { lat: h.geo.lat, lng: h.geo.lng }
          : null
        const km = pos && geo ? haversineKm(pos, geo) : null
        return {
          id: h.id,
          name: h.name || 'Unnamed Hospital',
          blood: blood || (Array.isArray(h.availableBloodGroups) ? h.availableBloodGroups[0] : '—'),
          contact: h.phone || '—',
          location: h.location || '—',
          km,
        }
      })
      .sort((a, b) => (a.km ?? 1e9) - (b.km ?? 1e9))

    return filtered
  }, [hospitals, selectedGroup, search, pos])

  const donorRows = useMemo(() => {
    return donorPosts
      .filter(d => search === '' || (d.name || '').toLowerCase().includes(search.toLowerCase()))
      .map(d => {
        const geo = d.geo && typeof d.geo.lat === 'number' && typeof d.geo.lng === 'number'
          ? { lat: d.geo.lat, lng: d.geo.lng }
          : null
        const km = pos && geo ? haversineKm(pos, geo) : null
        return {
          id: d.id,
          type: 'Donor',
          name: d.name || 'Donor',
          blood: d.bloodGroup || '—',
          contact: d.phone || '—',
          location: d.locationText || '—',
          km,
          message: d.message || null,
        }
      })
      .sort((a, b) => (a.km ?? 1e9) - (b.km ?? 1e9))
  }, [donorPosts, search, pos])

  const nearestHospital = hospitalRows[0] || null
  const nearestDonor = donorRows[0] || null

  return (
    <PageEnter>
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-12 sm:pb-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-syne text-2xl sm:text-4xl font-black text-white mb-2">Find Blood</h1>
            <p className="text-white/40 text-sm sm:text-base">Real-time blood availability near your location</p>
          </motion.div>

          {/* Search + Filter bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row gap-3 mb-6"
          >
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-3.5 text-white/30" />
              <input
                type="text"
                placeholder={tab === 'donors' ? 'Search donor name...' : 'Search hospital name...'}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full glass border border-white/10 focus:border-blood-500/50 rounded-xl pl-11 pr-4 py-3 text-white text-sm outline-none placeholder:text-white/20 transition-colors"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-blood-500 text-white font-medium px-4 sm:px-5 py-3 rounded-xl hover:bg-blood-600 transition-colors glow-red-sm text-sm sm:text-base w-full md:w-auto"
            >
              🚨 Emergency Request
            </motion.button>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setTab('hospitals')}
              className={`px-4 py-2 rounded-xl border text-sm ${
                tab === 'hospitals' ? 'bg-blood-500/20 border-blood-500 text-blood-300' : 'glass border-white/10 text-white/60'
              }`}
            >
              Hospitals
            </button>
            <button
              onClick={() => setTab('donors')}
              className={`px-4 py-2 rounded-xl border text-sm ${
                tab === 'donors' ? 'bg-green-500/20 border-green-500 text-green-300' : 'glass border-white/10 text-white/60'
              }`}
            >
              Donors
            </button>
          </div>

          {/* Blood group filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6"
          >
            {bloodGroups.map(bg => (
              <motion.button
                key={bg}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedGroup(bg)}
                className={`shrink-0 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                  selectedGroup === bg
                    ? 'bg-blood-500/20 border-blood-500 text-blood-400'
                    : 'glass border-white/10 text-white/50 hover:border-white/20'
                }`}
              >
                {bg}
              </motion.button>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Results */}
            <div className="lg:col-span-3 flex flex-col gap-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-white/40 text-sm">
                  {tab === 'donors' ? `${donorRows.length} donors found` : `${hospitalRows.length} hospitals found`}
                </p>
                <div className="flex items-center gap-2 text-white/30 text-xs">
                  <MapPin size={12} />
                  <span>
                    {pos ? `${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}` : (posError || 'Fetching location…')}
                  </span>
                  {watching && (
                    <span className="ml-1 inline-flex items-center gap-1 text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Live
                    </span>
                  )}
                </div>
              </div>

              {tab === 'hospitals' && loadingHospitals && (
                <div className="glass rounded-2xl p-6 border border-white/10 text-white/50">
                  Loading hospitals…
                </div>
              )}

              {tab === 'donors' && loadingDonors && (
                <div className="glass rounded-2xl p-6 border border-white/10 text-white/50">
                  Loading donors…
                </div>
              )}

              {tab === 'hospitals' && !loadingHospitals && hospitalRows.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass rounded-2xl p-3 sm:p-5 border border-white/5 hover:border-white/10 transition-all"
                  onClick={() => setDetail({ ...r, type: 'Hospital' })}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <BloodBadge type={r.blood} glow />
                      <div>
                        <p className="text-white font-medium">{r.name}</p>
                        <p className="text-white/30 text-xs mt-0.5">{r.location}</p>
                      </div>
                    </div>
                    <UrgencyTag level="medium" />
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                      <MapPin size={14} className="text-blood-400" />
                      <span>{formatKm(r.km)} away</span>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setContacted(prev => new Set(prev).add(r.id))}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all ${
                          contacted.has(r.id) ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'glass text-white/60 hover:text-white'
                        }`}
                      >
                        <Phone size={12} />
                        {contacted.has(r.id) ? 'Contacted' : 'Call'}
                      </motion.button>
                      <motion.button
                        whileHover={{ boxShadow: '0 0 15px rgba(239,68,68,0.3)' }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blood-500/20 text-blood-400 border border-blood-500/30 hover:bg-blood-500/30 transition-all"
                      >
                        <MessageCircle size={12} />
                        Message
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {tab === 'donors' && !loadingDonors && donorRows.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass rounded-2xl p-3 sm:p-5 border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                  onClick={() => setDetail(r)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <BloodBadge type={r.blood} glow />
                      <div>
                        <p className="text-white font-medium">{r.name}</p>
                        <p className="text-white/30 text-xs mt-0.5">{r.location}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-lg border border-green-500/30 bg-green-500/15 text-green-300">
                      Donor
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                      <MapPin size={14} className="text-blood-400" />
                      <span>{formatKm(r.km)} away</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg glass text-white/70">
                      <Phone size={12} />
                      {r.contact === '—' ? 'No phone' : 'Call'}
                    </div>
                  </div>
                  {r.message && <p className="text-white/60 text-sm mt-3">{r.message}</p>}
                </motion.div>
              ))}
            </div>

            {/* Map */}
            <div className="lg:col-span-2">
              {/* Right side: real location + nearest hospital */}
              <div className="mb-3 glass rounded-2xl p-4 border border-white/10">
                <p className="text-white/40 text-xs mb-1">YOUR LOCATION</p>
                <p className="text-white text-sm">
                  {pos ? `${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}` : (posError || 'Fetching…')}
                </p>
                {watching && (
                  <p className="text-green-400 text-xs mt-1">Live tracking ON</p>
                )}
                <div className="h-px bg-white/10 my-3" />
                <p className="text-white/40 text-xs mb-1">
                  {tab === 'donors' ? 'NEAREST DONOR' : 'NEAREST HOSPITAL'} {selectedGroup !== 'All' ? `(${selectedGroup})` : ''}
                </p>
                {(tab === 'donors' ? nearestDonor : nearestHospital) ? (
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-white font-medium text-sm">{(tab === 'donors' ? nearestDonor : nearestHospital).name}</p>
                      <p className="text-white/40 text-xs">{(tab === 'donors' ? nearestDonor : nearestHospital).location}</p>
                      <p className="text-white/40 text-xs mt-0.5">📞 {(tab === 'donors' ? nearestDonor : nearestHospital).contact}</p>
                    </div>
                    <div className="text-right">
                      <BloodBadge type={(tab === 'donors' ? nearestDonor : nearestHospital).blood} size="sm" glow />
                      <p className="text-white/60 text-xs mt-1">{formatKm((tab === 'donors' ? nearestDonor : nearestHospital).km)}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-white/40 text-sm">
                    {tab === 'donors'
                      ? 'No donor posts yet. Ask donors to post in Community.'
                      : 'No hospital data yet. Add hospital users with `geo` (lat/lng).'}
                  </p>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="sticky top-24 h-[300px] sm:h-[500px] rounded-2xl overflow-hidden border border-white/10"
              >
                <MapSimulation results={[]} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {detail && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setDetail(null)} />
          <div className="relative w-full max-w-md glass rounded-2xl border border-white/10 p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-white font-medium">{detail.name}</p>
                <p className="text-white/40 text-sm">{detail.location}</p>
              </div>
              <div className="text-right">
                <BloodBadge type={detail.blood} glow />
                <p className="text-white/50 text-xs mt-1">{detail.type}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-white/50 mb-4">
              <span className="flex items-center gap-1"><MapPin size={12} className="text-blood-400" /> {formatKm(detail.km)} away</span>
              <span>📞 {detail.contact}</span>
            </div>
            {detail.message && <p className="text-white/70 text-sm mb-4">{detail.message}</p>}
            <div className="flex gap-2">
              <a
                href={detail.contact && detail.contact !== '—' ? `tel:${detail.contact}` : undefined}
                className={`flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-medium ${
                  detail.contact && detail.contact !== '—'
                    ? 'bg-blood-500 text-white hover:bg-blood-600'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <Phone size={16} /> Call
                </span>
              </a>
              <button
                className="flex-1 px-4 py-2.5 rounded-xl text-sm glass border border-white/10 text-white/70 hover:text-white"
                onClick={() => setDetail(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <EmergencyModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </PageEnter>
  )
}

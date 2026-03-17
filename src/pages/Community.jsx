import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone } from 'lucide-react'
import Navbar from '../components/Navbar'
import { PageEnter, BloodBadge, GlassCard, PrimaryBtn, UrgencyTag } from '../components/UI'
import { useAuth } from '../contexts/AuthContext'
import { createCommunityPost, listCommunityPosts } from '../lib/firestoreCommunity'
import { formatKm, haversineKm } from '../lib/geo'

const bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export default function Community() {
  const { user, profile } = useAuth()
  const [tab, setTab] = useState('donors') // donors | patients
  const [selectedGroup, setSelectedGroup] = useState('All')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [pos, setPos] = useState(null)

  const [creating, setCreating] = useState(false)
  const [err, setErr] = useState('')

  const [form, setForm] = useState({
    bloodGroup: '',
    units: '1',
    urgency: 'critical',
    message: '',
    locationText: '',
    consent: false,
  })
  const [formGeo, setFormGeo] = useState(null)
  const [geoLoading, setGeoLoading] = useState(false)

  useEffect(() => {
    if (!navigator.geolocation) return
    const id = navigator.geolocation.watchPosition(
      (p) => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => {},
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 },
    )
    return () => navigator.geolocation.clearWatch(id)
  }, [])

  const refresh = async () => {
    setLoading(true)
    try {
      const type = tab === 'donors' ? 'donor_offer' : 'patient_request'
      const res = await listCommunityPosts({ type, bloodGroup: selectedGroup })
      setPosts(res)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, selectedGroup])

  const rows = useMemo(() => {
    return posts
      .map(p => {
        const pg = p.geo && typeof p.geo.lat === 'number' && typeof p.geo.lng === 'number'
          ? { lat: p.geo.lat, lng: p.geo.lng }
          : null
        const km = pos && pg ? haversineKm(pos, pg) : null
        return { ...p, _km: km }
      })
      .sort((a, b) => (a._km ?? 1e9) - (b._km ?? 1e9))
  }, [posts, pos])

  const captureLive = () => {
    if (!navigator.geolocation) return
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const lat = p.coords.latitude
        const lng = p.coords.longitude
        setFormGeo({ lat, lng })
        setForm(f => ({
          ...f,
          locationText: f.locationText?.trim() ? f.locationText : `Live: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        }))
        setGeoLoading(false)
      },
      () => setGeoLoading(false),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const [detail, setDetail] = useState(null)

  const createPost = async () => {
    if (!user?.uid) return
    setErr('')
    const type = tab === 'donors' ? 'donor_offer' : 'patient_request'
    if (!form.bloodGroup) { setErr('Please select blood group'); return }
    if (type === 'donor_offer' && !form.consent) { setErr('Consent required to post as donor'); return }

    setCreating(true)
    try {
      await createCommunityPost({
        type,
        createdBy: user.uid,
        role: profile?.role || null,
        name: profile?.name || null,
        phone: profile?.phone || null,
        bloodGroup: form.bloodGroup,
        units: type === 'patient_request' ? form.units : null,
        urgency: type === 'patient_request' ? form.urgency : null,
        locationText: (form.locationText || '').trim() || profile?.location || null,
        geo: formGeo || profile?.geo || null,
        message: form.message || null,
        consent: type === 'donor_offer' ? true : null,
      })
      setForm({ bloodGroup: '', units: '1', urgency: 'critical', message: '', locationText: '', consent: false })
      setFormGeo(null)
      await refresh()
    } catch (e) {
      setErr(e?.message || 'Failed to create post')
    } finally {
      setCreating(false)
    }
  }

  return (
    <PageEnter>
      <div className="min-h-screen bg-[#07070a]">
        <Navbar />

        {/* Hero / distinct header */}
        <div className="relative overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 opacity-60" style={{
            backgroundImage: 'radial-gradient(600px 200px at 20% 30%, rgba(239,68,68,0.25), transparent 60%), radial-gradient(500px 200px at 80% 20%, rgba(34,197,94,0.18), transparent 55%)'
          }} />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="font-syne text-2xl sm:text-4xl font-black text-white">Community Hub</h1>
                <p className="text-white/40 text-sm sm:text-base">Direct donor ↔ patient connection (no hospital required).</p>
              </div>
              {pos && <p className="text-white/30 text-xs">Live: {pos.lat.toFixed(4)}, {pos.lng.toFixed(4)}</p>}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

          {/* Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-xl border text-sm ${tab === 'donors' ? 'bg-blood-500/20 border-blood-500 text-blood-300' : 'glass border-white/10 text-white/60'}`}
              onClick={() => setTab('donors')}
            >
              Donor Declarations
            </button>
            <button
              className={`px-4 py-2 rounded-xl border text-sm ${tab === 'patients' ? 'bg-blood-500/20 border-blood-500 text-blood-300' : 'glass border-white/10 text-white/60'}`}
              onClick={() => setTab('patients')}
            >
              Patient Requests
            </button>
            </div>
            <p className="text-white/30 text-xs">
              Click any post to view contact + location details.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Feed */}
            <div className="lg:col-span-3">
              {/* Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4">
                {bloodGroups.map(bg => (
                  <button
                    key={bg}
                    onClick={() => setSelectedGroup(bg)}
                    className={`shrink-0 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                      selectedGroup === bg
                        ? 'bg-blood-500/20 border-blood-500 text-blood-400'
                        : 'glass border-white/10 text-white/50 hover:border-white/20'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>

              {/* List */}
              {loading ? (
                <div className="glass rounded-2xl p-6 border border-white/10 text-white/50">Loading…</div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {rows.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="glass rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                      onClick={() => setDetail(p)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <BloodBadge type={p.bloodGroup || '—'} glow />
                          <div>
                            <p className="text-white font-medium text-sm">{p.name || (p.type === 'donor_offer' ? 'Donor' : 'Patient')}</p>
                            <p className="text-white/40 text-xs">{p.locationText || '—'}</p>
                          </div>
                        </div>
                        {p.urgency && <UrgencyTag level={p.urgency} />}
                      </div>
                      <div className="flex items-center justify-between mt-4 text-xs text-white/50">
                        <span className="flex items-center gap-1"><MapPin size={12} className="text-blood-400" /> {formatKm(p._km)} away</span>
                        {p.units != null && <span>{p.units} unit(s)</span>}
                      </div>
                      {p.message && <p className="text-white/60 text-sm mt-3">{p.message}</p>}
                    </motion.div>
                  ))}
                  {rows.length === 0 && (
                    <GlassCard className="p-8 border border-white/10 md:col-span-2">
                      <p className="text-white/50">No posts yet. Create the first one.</p>
                    </GlassCard>
                  )}
                </div>
              )}
            </div>

            {/* Composer (sticky on desktop) */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-24">
                <GlassCard className="p-5 border border-white/10">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-white font-medium">
                        {tab === 'donors' ? 'Post donor availability' : 'Post blood request'}
                      </p>
                      <p className="text-white/40 text-sm">
                        Share your details with nearby people.
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-3">
                    <div>
                      <label className="text-white/50 text-xs block mb-1">Blood Group *</label>
                      <select
                        value={form.bloodGroup}
                        onChange={(e) => setForm(f => ({ ...f, bloodGroup: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none"
                      >
                        <option value="" className="bg-gray-900">Select</option>
                        {bloodGroups.slice(1).map(bg => <option key={bg} value={bg} className="bg-gray-900">{bg}</option>)}
                      </select>
                    </div>

                    {tab === 'patients' && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-white/50 text-xs block mb-1">Units</label>
                          <select
                            value={form.units}
                            onChange={(e) => setForm(f => ({ ...f, units: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none"
                          >
                            {[1,2,3,4,5].map(n => <option key={n} value={n} className="bg-gray-900">{n}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-white/50 text-xs block mb-1">Urgency</label>
                          <select
                            value={form.urgency}
                            onChange={(e) => setForm(f => ({ ...f, urgency: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none"
                          >
                            <option value="critical" className="bg-gray-900">Critical</option>
                            <option value="high" className="bg-gray-900">High</option>
                            <option value="medium" className="bg-gray-900">Medium</option>
                            <option value="low" className="bg-gray-900">Low</option>
                          </select>
                        </div>
                      </div>
                    )}

                    <div className="sm:col-span-2 lg:col-span-1">
                      <label className="text-white/50 text-xs block mb-1">Location (optional)</label>
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                        <input
                          value={form.locationText}
                          onChange={(e) => setForm(f => ({ ...f, locationText: e.target.value }))}
                          placeholder="Type address / area (or share live location)"
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none placeholder:text-white/20"
                        />
                        <button
                          type="button"
                          onClick={captureLive}
                          className="px-4 py-2.5 rounded-xl border border-white/10 glass text-white/70 hover:text-white"
                        >
                          {geoLoading ? 'Locating…' : 'Share live'}
                        </button>
                      </div>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-1">
                      <label className="text-white/50 text-xs block mb-1">Message (optional)</label>
                      <input
                        value={form.message}
                        onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                        placeholder={tab === 'donors' ? 'e.g. Available today 6-9 PM' : 'e.g. Need urgently for surgery'}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none placeholder:text-white/20"
                      />
                    </div>

                    {tab === 'donors' && (
                      <label className="sm:col-span-2 lg:col-span-1 flex items-start gap-2 text-white/60 text-xs">
                        <input
                          type="checkbox"
                          checked={form.consent}
                          onChange={(e) => setForm(f => ({ ...f, consent: e.target.checked }))}
                          className="mt-0.5"
                        />
                        I declare I’m eligible to donate and I consent to share my contact/location with patients who reach out.
                      </label>
                    )}
                  </div>

                  {err && <p className="text-blood-400 text-xs mt-3">{err}</p>}

                  <div className="mt-4">
                    <PrimaryBtn onClick={createPost} loading={creating} className="w-full px-6 py-3">
                      Post to Community
                    </PrimaryBtn>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail popup */}
      {detail && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setDetail(null)} />
          <div className="relative w-full max-w-md glass rounded-2xl border border-white/10 p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-white font-medium">{detail.name || '—'}</p>
                <p className="text-white/40 text-sm">{detail.locationText || '—'}</p>
              </div>
              <BloodBadge type={detail.bloodGroup || '—'} glow />
            </div>
            {detail.urgency && <div className="mb-2"><UrgencyTag level={detail.urgency} /></div>}
            {detail.message && <p className="text-white/70 text-sm mb-3">{detail.message}</p>}
            <div className="flex items-center justify-between text-xs text-white/50 mb-4">
              <span className="flex items-center gap-1"><MapPin size={12} className="text-blood-400" /> {formatKm(detail._km)} away</span>
              {detail.units != null && <span>{detail.units} unit(s)</span>}
            </div>
            <div className="flex gap-2">
              <a
                href={detail.phone ? `tel:${detail.phone}` : undefined}
                className={`flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-medium ${
                  detail.phone ? 'bg-blood-500 text-white hover:bg-blood-600' : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <Phone size={16} /> {detail.phone ? 'Call' : 'No phone'}
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
    </PageEnter>
  )
}


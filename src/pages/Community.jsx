import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, HeartHandshake, MapPin, MessageCircle, Phone, Plus, Users, Waves } from 'lucide-react'
import Navbar from '../components/Navbar'
import { PageEnter, BloodBadge, GlassCard, PrimaryBtn, UrgencyTag } from '../components/UI'
import { useAuth } from '../contexts/AuthContext'
import { createCommunityPost, listCommunityPosts } from '../lib/firestoreCommunity'
import { formatKm, haversineKm } from '../lib/geo'

const bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

function timeAgo(ts) {
  const d = ts?.toDate?.() || (ts instanceof Date ? ts : null)
  if (!d) return null
  const s = Math.max(0, Math.floor((Date.now() - d.getTime()) / 1000))
  if (s < 45) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} hr ago`
  const days = Math.floor(h / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export default function Community() {
  const { user, profile } = useAuth()
  const [tab, setTab] = useState('donors') // donors | patients
  const [selectedGroup, setSelectedGroup] = useState('All')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [pos, setPos] = useState(null)
  const formRef = useRef(null)
  const [detail, setDetail] = useState(null)

  const [creating, setCreating] = useState(false)
  const [err, setErr] = useState('')

  const [form, setForm] = useState({
    name: '',
    phone: '',
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

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const type = tab === 'donors' ? 'donor_offer' : 'patient_request'
      const res = await listCommunityPosts({ type, bloodGroup: selectedGroup })
      setPosts(res)
    } finally {
      setLoading(false)
    }
  }, [tab, selectedGroup])

  useEffect(() => {
    refresh()
  }, [refresh])

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

  const createPost = async () => {
    setErr('')
    const type = tab === 'donors' ? 'donor_offer' : 'patient_request'
    if (!form.bloodGroup) { setErr('Please select blood group'); return }
    if (type === 'donor_offer' && !form.consent) { setErr('Consent required to post as donor'); return }

    setCreating(true)
    const payload = {
      type,
      createdBy: user?.uid || `anon-${Date.now()}`,
      role: profile?.role || null,
      // Use only explicit form values; don't leak profile defaults
      name: (form.name || '').trim() || null,
      phone: (form.phone || '').trim() || null,
      bloodGroup: form.bloodGroup,
      units: type === 'patient_request' ? form.units : null,
      urgency: type === 'patient_request' ? form.urgency : null,
      locationText: (form.locationText || '').trim() || profile?.location || null,
      geo: formGeo || profile?.geo || null,
      message: form.message || null,
      consent: type === 'donor_offer' ? true : null,
    }
    try {
      await createCommunityPost(payload)
      setForm({ name: '', phone: '', bloodGroup: '', units: '1', urgency: 'critical', message: '', locationText: '', consent: false })
      setFormGeo(null)
      await refresh()
    } catch (e) {
      // Frontend-only fallback: even if Firestore blocks (rules / index),
      // still show the post immediately in the UI for demo.
      console.error('Community post failed, showing locally only:', e)
      const msg = e?.message || ''
      if (msg.includes('Missing or insufficient permissions') || msg.includes('requires an index')) {
        const localPost = {
          id: `local-${Date.now()}`,
          status: 'open',
          createdAt: new Date(),
          updatedAt: new Date(),
          ...payload,
        }
        setPosts(prev => [localPost, ...prev])
        setForm({ name: '', phone: '', bloodGroup: '', units: '1', urgency: 'critical', message: '', locationText: '', consent: false })
        setFormGeo(null)
        setErr('Posted locally (backend locked) – visible on this device.')
      } else {
        setErr(msg || 'Failed to create post')
      }
    } finally {
      setCreating(false)
    }
  }

  return (
    <PageEnter>
      <div className="min-h-screen bg-[#07070a] pb-20">
        <Navbar />

        {/* Hero / distinct header */}
        <div className="relative overflow-hidden border-b border-white/5">
          <div
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                'radial-gradient(700px 240px at 18% 30%, rgba(239,68,68,0.32), transparent 62%), radial-gradient(520px 220px at 78% 18%, rgba(239,68,68,0.18), transparent 58%), radial-gradient(520px 240px at 50% 0%, rgba(255,255,255,0.06), transparent 60%)',
            }}
          />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[38rem] -translate-x-1/2 rounded-full bg-blood-500/20 blur-3xl" />
          <div className="relative max-w-md sm:max-w-2xl lg:max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2.5 mb-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
                    <Users size={18} className="text-blood-400" />
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                    <HeartHandshake size={14} className="text-blood-400" />
                    Connect faster. Help sooner.
                  </span>
                </div>
                <h1 className="font-syne text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
                  <span className="bg-gradient-to-r from-white via-white to-blood-400 bg-clip-text text-transparent">
                    Community Hub
                  </span>
                </h1>
                <p className="mt-2 mb-4 text-gray-300 text-xs sm:text-sm md:text-base max-w-2xl">
                  Direct donor ↔ patient connection, with a clean feed, quick filters, and one-tap contact.
                </p>
              </div>
              {pos && (
                <div className="pointer-events-none inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300 backdrop-blur">
                  <MapPin size={14} className="text-blood-400" />
                  Live: {pos.lat.toFixed(4)}, {pos.lng.toFixed(4)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-md sm:max-w-2xl lg:max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-8">

          {/* Tabs */}
          <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-3 mb-4">
            <div className="inline-flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur">
              <button
                className={`relative flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold min-h-[44px] transition-all duration-300 ${
                  tab === 'donors'
                    ? 'text-white bg-gradient-to-r from-blood-500 to-blood-700 shadow-[0_0_28px_rgba(239,68,68,0.35)]'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => setTab('donors')}
              >
                <span className="inline-flex items-center gap-2">
                  <Waves size={16} className={tab === 'donors' ? 'text-white' : 'text-blood-400'} />
                  Donor Declarations
                </span>
              </button>
              <button
                className={`relative flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold min-h-[44px] transition-all duration-300 ${
                  tab === 'patients'
                    ? 'text-white bg-gradient-to-r from-blood-500 to-blood-700 shadow-[0_0_28px_rgba(239,68,68,0.35)]'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => setTab('patients')}
              >
                <span className="inline-flex items-center gap-2">
                  <MessageCircle size={16} className={tab === 'patients' ? 'text-white' : 'text-blood-400'} />
                  Patient Requests
                </span>
              </button>
            </div>
            <p className="text-gray-400 text-xs">
              Tap a post to view contact + location details.
            </p>
          </div>

          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6">
            {/* Feed */}
            <div className="lg:col-span-2 space-y-6">
              {/* Filter */}
              <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {bloodGroups.map(bg => (
                  <button
                    key={bg}
                    onClick={() => setSelectedGroup(bg)}
                    className={`shrink-0 px-4 py-2 rounded-full border text-sm font-semibold min-h-[44px] transition-all duration-300 hover:scale-[1.02] ${
                      selectedGroup === bg
                        ? 'bg-blood-500 border-blood-500 text-white shadow-[0_0_22px_rgba(239,68,68,0.35)]'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:border-blood-500/50 hover:shadow-[0_0_18px_rgba(239,68,68,0.18)]'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>

              {/* List */}
              {loading ? (
                <div className="glass rounded-2xl p-6 border border-white/10 text-gray-300">Loading…</div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {rows.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      whileHover={{ y: -4 }}
                      className="relative overflow-hidden rounded-2xl p-4 sm:p-5 border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 cursor-pointer hover:border-blood-500/40 hover:shadow-[0_18px_60px_rgba(0,0,0,0.55)]"
                      onClick={() => setDetail(p)}
                    >
                      <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-blood-500/10 blur-3xl" />
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <BloodBadge type={p.bloodGroup || '—'} glow />
                          <div>
                            <p className="text-white font-semibold text-sm">
                              {p.name || (p.type === 'donor_offer' ? 'Donor' : 'Patient')}
                            </p>
                            <p className="text-gray-400 text-xs flex items-center gap-1.5">
                              <MapPin size={12} className="text-blood-400" />
                              {p.locationText || '—'}
                            </p>
                          </div>
                        </div>
                        {p.urgency && <UrgencyTag level={p.urgency} />}
                      </div>
                      <div className="flex items-center justify-between mt-4 text-xs text-gray-300/90">
                        <span className="inline-flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
                            <MapPin size={12} className="text-blood-400" /> {formatKm(p._km)} away
                          </span>
                          {timeAgo(p.createdAt) && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-gray-300">
                              <Clock size={12} className="text-blood-400" /> {timeAgo(p.createdAt)}
                            </span>
                          )}
                        </span>
                        {p.units != null && <span>{p.units} unit(s)</span>}
                      </div>
                      {p.message && (
                        <p className="text-gray-300 text-sm mt-3 line-clamp-3">
                          {p.message}
                        </p>
                      )}
                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setDetail(p) }}
                          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white min-h-[44px] transition-all duration-300 hover:bg-white/10 hover:border-blood-500/40 hover:shadow-[0_0_22px_rgba(239,68,68,0.18)]"
                        >
                          View details
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  {rows.length === 0 && (
                    <GlassCard className="p-5 border border-white/10 md:col-span-2" hover={false}>
                      <div className="flex flex-col items-center text-center">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                          <HeartHandshake size={22} className="text-blood-400" />
                        </span>
                        <p className="mt-3 text-white font-semibold text-base">No posts yet</p>
                        <p className="mt-1 text-gray-300 text-sm max-w-md">
                          Be the first to help someone. Post your availability or request blood in seconds.
                        </p>
                        <div className="mt-4 w-full">
                          <PrimaryBtn
                            onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                            className="w-full h-12 rounded-xl"
                          >
                            <Plus size={18} />
                            Create First Post
                          </PrimaryBtn>
                        </div>
                      </div>
                    </GlassCard>
                  )}
                </div>
              )}
            </div>

            {/* Composer (sticky on desktop) */}
            <div className="lg:col-span-1" ref={formRef}>
              <div className="lg:sticky lg:top-24">
                <GlassCard className="p-4 sm:p-6 border border-white/10 bg-white/5 backdrop-blur-xl">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-white font-semibold">
                        {tab === 'donors' ? 'Post donor availability' : 'Post blood request'}
                      </p>
                      <p className="text-gray-300 text-sm mt-1">
                        Share your details with nearby people.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-gray-400 text-xs block mb-1">Name</label>
                      <div className="relative">
                        <input
                          value={form.name}
                          onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="Enter your name"
                          className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm outline-none placeholder:text-gray-400 focus:border-blood-500/50 focus:ring-2 focus:ring-blood-500/25 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs block mb-1">Phone (optional)</label>
                      <div className="relative">
                        <input
                          value={form.phone}
                          onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                          placeholder="Enter phone number"
                          className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm outline-none placeholder:text-gray-400 focus:border-blood-500/50 focus:ring-2 focus:ring-blood-500/25 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs block mb-1">Blood Group *</label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blood-400">
                          <Waves size={16} />
                        </span>
                        <select
                          value={form.bloodGroup}
                          onChange={(e) => setForm(f => ({ ...f, bloodGroup: e.target.value }))}
                          className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-white text-sm outline-none placeholder:text-gray-400 focus:border-blood-500/50 focus:ring-2 focus:ring-blood-500/25 transition-all"
                        >
                          <option value="" className="bg-gray-900">Select</option>
                          {bloodGroups.slice(1).map(bg => <option key={bg} value={bg} className="bg-gray-900">{bg}</option>)}
                        </select>
                      </div>
                    </div>

                    {tab === 'patients' && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-gray-400 text-xs block mb-1">Units</label>
                          <select
                            value={form.units}
                            onChange={(e) => setForm(f => ({ ...f, units: e.target.value }))}
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:border-blood-500/50 focus:ring-2 focus:ring-blood-500/25 transition-all"
                          >
                            {[1,2,3,4,5].map(n => <option key={n} value={n} className="bg-gray-900">{n}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-gray-400 text-xs block mb-1">Urgency</label>
                          <select
                            value={form.urgency}
                            onChange={(e) => setForm(f => ({ ...f, urgency: e.target.value }))}
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:border-blood-500/50 focus:ring-2 focus:ring-blood-500/25 transition-all"
                          >
                            <option value="critical" className="bg-gray-900">Critical</option>
                            <option value="high" className="bg-gray-900">High</option>
                            <option value="medium" className="bg-gray-900">Medium</option>
                            <option value="low" className="bg-gray-900">Low</option>
                          </select>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-gray-400 text-xs block mb-1">Location (optional)</label>
                      <div className="flex flex-col gap-2">
                        <div className="relative flex-1">
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blood-400">
                            <MapPin size={16} />
                          </span>
                          <input
                            value={form.locationText}
                            onChange={(e) => setForm(f => ({ ...f, locationText: e.target.value }))}
                            placeholder="Type address / area (or share live location)"
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-white text-sm outline-none placeholder:text-gray-400 focus:border-blood-500/50 focus:ring-2 focus:ring-blood-500/25 transition-all"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={captureLive}
                          className="w-full h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-gray-200 hover:text-white hover:border-blood-500/40 hover:shadow-[0_0_22px_rgba(239,68,68,0.18)] transition-all duration-300"
                        >
                          {geoLoading ? 'Locating…' : 'Share live'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-400 text-xs block mb-1">Message (optional)</label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-3 text-blood-400">
                          <MessageCircle size={16} />
                        </span>
                        <textarea
                          value={form.message}
                          onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                          placeholder={tab === 'donors' ? 'e.g. Available today 6-9 PM' : 'e.g. Need urgently for surgery'}
                          rows={3}
                          className="w-full min-h-[96px] resize-none bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm outline-none placeholder:text-gray-400 focus:border-blood-500/50 focus:ring-2 focus:ring-blood-500/25 transition-all"
                        />
                      </div>
                    </div>

                    {tab === 'donors' && (
                      <label className="flex items-start gap-2 text-gray-300 text-xs">
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
                    <PrimaryBtn
                      onClick={createPost}
                      loading={creating}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-blood-500 to-blood-700 hover:from-blood-600 hover:to-blood-800"
                    >
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
          <div className="absolute inset-0 bg-black/75" onClick={() => setDetail(null)} />
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-[0_20px_80px_rgba(0,0,0,0.7)]">
            <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-blood-500/20 blur-3xl" />
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-white font-semibold text-lg">{detail.name || '—'}</p>
                <p className="mt-1 text-gray-300 text-sm flex items-center gap-1.5">
                  <MapPin size={14} className="text-blood-400" /> {detail.locationText || '—'}
                </p>
              </div>
              <BloodBadge type={detail.bloodGroup || '—'} glow />
            </div>
            {detail.urgency && <div className="mb-2"><UrgencyTag level={detail.urgency} /></div>}
            {detail.message && <p className="text-gray-200 text-sm mb-3">{detail.message}</p>}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-300 mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
                <MapPin size={12} className="text-blood-400" /> {formatKm(detail._km)} away
              </span>
              {timeAgo(detail.createdAt) && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
                  <Clock size={12} className="text-blood-400" /> {timeAgo(detail.createdAt)}
                </span>
              )}
              {detail.units != null && <span>{detail.units} unit(s)</span>}
            </div>
            <div className="flex gap-2">
              <a
                href={detail.phone ? `tel:${detail.phone}` : undefined}
                className={`flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-medium ${
                  detail.phone
                    ? 'bg-gradient-to-r from-blood-500 to-blood-700 text-white hover:from-blood-600 hover:to-blood-800 shadow-[0_0_30px_rgba(239,68,68,0.35)]'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <Phone size={16} /> {detail.phone ? 'Call' : 'No phone'}
                </span>
              </a>
              <button
                className="flex-1 px-4 py-2.5 rounded-xl text-sm border border-white/10 bg-white/5 text-gray-200 hover:text-white hover:border-blood-500/40 hover:shadow-[0_0_22px_rgba(239,68,68,0.18)] transition-all duration-300"
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


import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Bell, Droplets, MapPin, Search } from 'lucide-react'
import { PageEnter, PageHeader, GlassCard, StatCard, RequestCard, NotifItem, PrimaryBtn } from '../../components/UI'
import { useAuth } from '../../contexts/AuthContext'
import { listDonors } from '../../lib/firestoreUsers'
import { createBloodRequest, listRequestsByCreator } from '../../lib/firestoreRequests'
import { formatKm, haversineKm } from '../../lib/geo'

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const { user, profile } = useAuth()
  const [donors, setDonors] = useState([])
  const [myRequests, setMyRequests] = useState([])
  const [reqOpen, setReqOpen] = useState(false)
  const [reqForm, setReqForm] = useState({ blood: '', units: '1', urgency: 'critical', notes: '', locationText: '' })
  const [reqGeo, setReqGeo] = useState(null) // {lat,lng}
  const [reqLoading, setReqLoading] = useState(false)
  const [geoLoading, setGeoLoading] = useState(false)
  const [detailReq, setDetailReq] = useState(null)

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

  return (
    <PageEnter>
      <div className="min-h-screen bg-[#f5f5f7] flex flex-col md:flex-row">
        {/* Main Content */}
        <main className="flex-1 overflow-auto pt-14 md:pt-0">
          <div className="max-w-6xl mx-auto p-4 md:p-8">
            <PageHeader
              title={`Patient Dashboard${profile?.name ? ` · ${profile.name}` : ''}`}
              sub={profile?.location ? `Location: ${profile.location}` : 'Manage your blood requests and find donors'}
              badge="Active Patient"
            />

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <PrimaryBtn className="flex-1 py-4 text-base" onClick={() => setReqOpen(true)}>
                🚨 Request Blood Now
              </PrimaryBtn>
              <PrimaryBtn className="flex-1 py-4 text-base bg-white text-gray-900 border border-gray-200 shadow-sm hover:bg-gray-50">
                <Search size={18} /> Find Donors Nearby
              </PrimaryBtn>
            </div>

            {reqOpen && (
              <div className="mb-8">
                <GlassCard className="p-5 bg-white border border-gray-100">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-syne font-bold text-gray-900 text-lg">Create Blood Request</h3>
                      <p className="text-sm text-gray-500">This will be visible to donors.</p>
                    </div>
                    <button className="text-sm text-gray-500 hover:text-gray-800" onClick={() => setReqOpen(false)}>Close</button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">Blood Group *</label>
                      <select
                        value={reqForm.blood}
                        onChange={(e) => setReqForm(f => ({ ...f, blood: e.target.value }))}
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none"
                      >
                        <option value="">Select</option>
                        {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">Units</label>
                      <select
                        value={reqForm.units}
                        onChange={(e) => setReqForm(f => ({ ...f, units: e.target.value }))}
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none"
                      >
                        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">Urgency</label>
                      <select
                        value={reqForm.urgency}
                        onChange={(e) => setReqForm(f => ({ ...f, urgency: e.target.value }))}
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none"
                      >
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-gray-600 block mb-1">Notes</label>
                      <input
                        value={reqForm.notes}
                        onChange={(e) => setReqForm(f => ({ ...f, notes: e.target.value }))}
                        placeholder="Any details…"
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-gray-600 block mb-1">Location (optional)</label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          value={reqForm.locationText}
                          onChange={(e) => setReqForm(f => ({ ...f, locationText: e.target.value }))}
                          placeholder="Type address / area (or use live location)"
                          className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none"
                        />
                        <button
                          type="button"
                          onClick={captureLiveLocation}
                          className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50"
                        >
                          {geoLoading ? 'Locating…' : 'Share live location'}
                        </button>
                      </div>
                      {reqGeo && (
                        <p className="text-xs text-green-600 mt-1">Live location attached: {reqGeo.lat.toFixed(4)}, {reqGeo.lng.toFixed(4)}</p>
                      )}
                      {!reqGeo && (
                        <p className="text-xs text-gray-500 mt-1">If you don’t know address, use “Share live location”.</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <PrimaryBtn onClick={submitRequest} loading={reqLoading} disabled={!reqForm.blood} className="px-6 py-3">
                      Create Request
                    </PrimaryBtn>
                    <button className="px-5 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setReqOpen(false)}>
                      Cancel
                    </button>
                  </div>
                </GlassCard>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard icon={Activity} label="Active Requests" value="1" color="red" />
              <StatCard icon={Droplets} label="Units Received" value="2" color="blue" />
              <StatCard icon={MapPin} label="Donors Reached" value="15" color="purple" />
              <StatCard icon={Bell} label="Alerts Sent" value="3" color="green" />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Active Requests */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-syne text-xl font-bold text-gray-900">Active Requests</h2>
                  <button className="text-sm text-blood-500 font-medium tracking-wide hover:text-blood-600 transition-colors">View All</button>
                </div>
                {myRequests.slice(0, 4).map(r => (
                  <GlassCard key={r.id} className="p-4 bg-white border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                         <span className="font-syne font-bold text-blood-500 bg-red-50 px-3 py-1 rounded-lg">{r.bloodGroup}</span>
                         <div>
                            <p className="font-medium text-gray-900 leading-tight">
                              {r.status}
                              {r.status === 'accepted' && r.acceptedByRole === 'hospital' && r.acceptedByName ? ` · ${r.acceptedByName}` : ''}
                            </p>
                            <p className="text-xs text-gray-500">{r.createdByLocation || '—'}</p>
                         </div>
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 rounded-md bg-red-100 text-red-600 uppercase tracking-wide">
                        {r.urgency}
                      </span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      {r.status === 'accepted' && r.acceptedByRole === 'hospital' ? (
                        <button
                          className="flex-1 py-2 text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
                          onClick={() => setDetailReq(r)}
                        >
                          View Hospital Details
                        </button>
                      ) : (
                        <button className="flex-1 py-2 text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors">Update Status</button>
                      )}
                      <button className="flex-1 py-2 text-sm font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">Cancel</button>
                    </div>
                  </GlassCard>
                ))}
                {myRequests.length === 0 && (
                  <GlassCard className="p-6 bg-white border border-gray-100">
                    <p className="text-sm text-gray-600">No requests yet. Tap “Request Blood Now” to create one.</p>
                  </GlassCard>
                )}
              </div>

              {/* Feed */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-syne text-xl font-bold text-gray-900">Recent Updates</h2>
                </div>
                <GlassCard className="p-2 bg-white border border-gray-100">
                  {notifications.map(n => (
                    <NotifItem key={n.id} {...n} tone="light" />
                  ))}
                </GlassCard>

                <div className="mt-6">
                  <h2 className="font-syne text-xl font-bold text-gray-900 mb-2">Nearby Donors</h2>
                  <GlassCard className="p-4 bg-white border border-gray-100">
                    {donors.length === 0 ? (
                      <p className="text-sm text-gray-500">No donors found yet. Create donor accounts to see them here.</p>
                    ) : (
                      <div className="space-y-3">
                        {donors.slice(0, 6).map(d => (
                          <div key={d.id} className="flex items-start justify-between gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{d.name || 'Unnamed Donor'}</p>
                              <p className="text-xs text-gray-500">{d.location || '—'}</p>
                              <p className="text-xs text-gray-500">{d.phone || '—'}</p>
                            </div>
                            <span className="font-syne font-bold text-blood-600 bg-red-50 px-3 py-1 rounded-lg">
                              {d.bloodGroup || '—'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </GlassCard>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Hospital details popup */}
      {detailReq && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDetailReq(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-gray-200 p-5 shadow-xl">
            <h3 className="font-syne font-black text-gray-900 text-lg mb-1">Hospital Accepted Your Request</h3>
            <p className="text-sm text-gray-600 mb-4">
              {detailReq.acceptedByName || 'Hospital'} accepted {detailReq.acceptedUnits || detailReq.units || 1} unit(s)
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-start justify-between gap-4">
                <span className="text-gray-500">Hospital</span>
                <span className="text-gray-900 font-medium text-right">{detailReq.acceptedByName || '—'}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-gray-500">Location</span>
                <span className="text-gray-900 text-right">{detailReq.acceptedByLocation || '—'}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-gray-500">Contact</span>
                <span className="text-gray-900 text-right">{detailReq.acceptedByPhone || '—'}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-gray-500">Distance</span>
                <span className="text-gray-900 text-right">
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
              <button
                className="flex-1 px-4 py-2.5 rounded-xl bg-blood-500 text-white font-medium hover:bg-blood-600 transition-colors"
                onClick={() => setDetailReq(null)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </PageEnter>
  )
}

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Bell, Droplets, MapPin, Search } from 'lucide-react'
import { PageEnter, PageHeader, GlassCard, StatCard, RequestCard, NotifItem, PrimaryBtn } from '../../components/UI'
import { useAuth } from '../../contexts/AuthContext'
import { listDonors } from '../../lib/firestoreUsers'
import { createBloodRequest, listRequestsByCreator } from '../../lib/firestoreRequests'

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const { user, profile } = useAuth()
  const [donors, setDonors] = useState([])
  const [myRequests, setMyRequests] = useState([])
  const [reqOpen, setReqOpen] = useState(false)
  const [reqForm, setReqForm] = useState({ blood: '', units: '1', urgency: 'critical', notes: '' })
  const [reqLoading, setReqLoading] = useState(false)

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
        createdByLocation: profile?.location || null,
        bloodGroup: reqForm.blood,
        units: reqForm.units,
        urgency: reqForm.urgency,
        notes: reqForm.notes,
      })
      const res = await listRequestsByCreator(user.uid)
      setMyRequests(res)
      setReqOpen(false)
      setReqForm({ blood: '', units: '1', urgency: 'critical', notes: '' })
    } finally {
      setReqLoading(false)
    }
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
                            <p className="font-medium text-gray-900 leading-tight">{r.status}</p>
                            <p className="text-xs text-gray-500">{r.createdByLocation || '—'}</p>
                         </div>
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 rounded-md bg-red-100 text-red-600 uppercase tracking-wide">
                        {r.urgency}
                      </span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 py-2 text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors">Update Status</button>
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
    </PageEnter>
  )
}

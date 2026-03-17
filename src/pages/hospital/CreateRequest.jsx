import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertTriangle, MapPin } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import { PageEnter, SectionTitle, PrimaryBtn, GlassCard } from '../../components/UI'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { createBloodRequest } from '../../lib/firestoreRequests'

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export default function CreateRequest() {
  const [form, setForm] = useState({ blood: '', units: '1', urgency: 'critical', notes: '', patientName: '', ward: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const { user, profile } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.blood) return
    setLoading(true)
    try {
      await createBloodRequest({
        createdBy: user?.uid,
        createdByRole: 'hospital',
        createdByName: profile?.name || null,
        createdByLocation: profile?.location || null,
        bloodGroup: form.blood,
        units: form.units,
        urgency: form.urgency,
        notes: [form.patientName, form.ward, form.notes].filter(Boolean).join(' · ') || null,
      })
      setSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <PageEnter>
        <div className="flex min-h-screen bg-[#0a0a0a]">
          <Sidebar role="hospital" />
          <main className="flex-1 flex items-center justify-center p-4 md:p-6 pt-18 md:pt-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center max-w-sm"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.5 }}
                className="w-24 h-24 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle size={44} className="text-green-400" />
              </motion.div>
              <h2 className="font-syne text-2xl font-black text-white mb-2">Request Broadcast!</h2>
              <p className="text-white/50 mb-2">Notifying <strong className="text-white">47 nearby donors</strong> for <strong className="text-blood-400">{form.blood}</strong></p>
              <p className="text-white/30 text-sm mb-8">Average response time: 6 minutes</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setSuccess(false); setForm({ blood: '', units: '1', urgency: 'critical', notes: '', patientName: '', ward: '' }) }}
                  className="glass border border-white/10 text-white px-6 py-3 rounded-xl text-sm"
                >
                  New Request
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/hospital/tracking')}
                  className="bg-blood-500 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-blood-600 transition-colors"
                >
                  Track Request
                </motion.button>
              </div>
            </motion.div>
          </main>
        </div>
      </PageEnter>
    )
  }

  return (
    <PageEnter>
      <div className="flex min-h-screen bg-[#0a0a0a] overflow-x-hidden">
        <Sidebar role="hospital" />
        <main className="flex-1 p-4 md:p-6 pt-18 md:pt-6">
          <div className="max-w-xl">
            <SectionTitle sub="Broadcast to nearby verified donors">Create Blood Request</SectionTitle>

            <GlassCard className="p-7">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Blood Group */}
                <div>
                  <label className="text-white/50 text-xs font-medium mb-2 block">BLOOD GROUP NEEDED *</label>
                  <div className="grid grid-cols-4 gap-2">
                    {bloodGroups.map(bg => (
                      <motion.button
                        key={bg}
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setForm(f => ({ ...f, blood: bg }))}
                        className={`py-2.5 rounded-xl border font-syne font-bold text-sm transition-all ${
                          form.blood === bg
                            ? 'bg-blood-500/30 border-blood-500 text-blood-300 glow-red-sm'
                            : 'glass border-white/10 text-white/60 hover:border-white/20'
                        }`}
                      >
                        {bg}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Patient name + Ward */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/50 text-xs mb-1.5 block">PATIENT / CASE</label>
                    <input
                      type="text"
                      placeholder="e.g. Emergency Surgery"
                      value={form.patientName}
                      onChange={e => setForm(f => ({ ...f, patientName: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 focus:border-blood-500/50 rounded-xl px-3 py-3 text-white text-sm outline-none placeholder:text-white/20 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-white/50 text-xs mb-1.5 block">WARD / DEPT</label>
                    <input
                      type="text"
                      placeholder="e.g. ICU, Ward 4"
                      value={form.ward}
                      onChange={e => setForm(f => ({ ...f, ward: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 focus:border-blood-500/50 rounded-xl px-3 py-3 text-white text-sm outline-none placeholder:text-white/20 transition-colors"
                    />
                  </div>
                </div>

                {/* Units + Urgency */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/50 text-xs mb-1.5 block">UNITS NEEDED</label>
                    <select
                      value={form.units}
                      onChange={e => setForm(f => ({ ...f, units: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 focus:border-blood-500/50 rounded-xl px-3 py-3 text-white text-sm outline-none appearance-none"
                    >
                      {[1,2,3,4,5].map(n => <option key={n} value={n} className="bg-gray-900">{n} unit{n>1?'s':''}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-white/50 text-xs mb-1.5 block">URGENCY</label>
                    <select
                      value={form.urgency}
                      onChange={e => setForm(f => ({ ...f, urgency: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 focus:border-blood-500/50 rounded-xl px-3 py-3 text-white text-sm outline-none appearance-none"
                    >
                      <option value="critical" className="bg-gray-900">🔴 Critical</option>
                      <option value="high" className="bg-gray-900">🟠 High</option>
                      <option value="medium" className="bg-gray-900">🟡 Medium</option>
                      <option value="low" className="bg-gray-900">🟢 Low</option>
                    </select>
                  </div>
                </div>

                {/* Location (auto) */}
                <div>
                  <label className="text-white/50 text-xs mb-1.5 block">HOSPITAL LOCATION</label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3.5 top-3.5 text-blood-400" />
                    <input
                      type="text"
                      value={profile?.location || 'Add location in your hospital profile'}
                      readOnly
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white/60 text-sm outline-none"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-white/50 text-xs mb-1.5 block">ADDITIONAL NOTES</label>
                  <textarea
                    rows={3}
                    placeholder="Any special requirements or instructions..."
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 focus:border-blood-500/50 rounded-xl px-3 py-3 text-white text-sm outline-none placeholder:text-white/20 resize-none transition-colors"
                  />
                </div>

                {/* Compatibility hint */}
                {form.blood && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 p-3 glass-red rounded-xl border border-blood-500/20 text-sm"
                  >
                    <AlertTriangle size={14} className="text-blood-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-blood-300 font-medium">Compatible donors: </span>
                      <span className="text-white/60">
                        {form.blood === 'O-' ? 'O- only (universal for others)' :
                         form.blood === 'O+' ? 'O+, O-' :
                         form.blood === 'A+' ? 'A+, A-, O+, O-' :
                         form.blood === 'A-' ? 'A-, O-' :
                         form.blood === 'B+' ? 'B+, B-, O+, O-' :
                         form.blood === 'B-' ? 'B-, O-' :
                         form.blood === 'AB+' ? 'All blood groups' : 'AB-, A-, B-, O-'}
                      </span>
                    </div>
                  </motion.div>
                )}

                <PrimaryBtn type="submit" loading={loading} disabled={!form.blood} className="w-full py-4 text-base">
                  📡 Broadcast Request to Donors
                </PrimaryBtn>
              </form>
            </GlassCard>
          </div>
        </main>
      </div>
    </PageEnter>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Droplets, CheckCircle, AlertTriangle } from 'lucide-react'
import { PrimaryBtn } from './UI'

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export default function EmergencyModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ bloodGroup: '', units: '1', urgency: 'critical', location: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!form.bloodGroup) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    setLoading(false)
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      setStep(1)
      setForm({ bloodGroup: '', units: '1', urgency: 'critical', location: '' })
      onClose()
    }, 2500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md glass rounded-3xl border border-white/10 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blood-700/40 to-blood-500/20 px-6 py-5 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-10 h-10 rounded-xl bg-blood-500 flex items-center justify-center glow-red"
                  >
                    <AlertTriangle size={18} className="text-white" />
                  </motion.div>
                  <div>
                    <h2 className="font-syne font-bold text-white text-lg">Emergency Request</h2>
                    <p className="text-white/40 text-xs">Broadcast to nearby donors instantly</p>
                  </div>
                </div>
                <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                  <X size={20} />
                </motion.button>
              </div>

              {/* Body */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div
                      key="success"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center py-8 gap-4"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6 }}
                        className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center"
                      >
                        <CheckCircle size={40} className="text-green-400" />
                      </motion.div>
                      <h3 className="font-syne text-xl font-bold text-white">Request Sent!</h3>
                      <p className="text-white/50 text-sm text-center">
                        Notifying {Math.floor(Math.random() * 30) + 15} nearby donors...
                      </p>
                      <div className="flex gap-2">
                        {[1,2,3,4,5].map(i => (
                          <motion.div
                            key={i}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                            className="w-2 h-2 rounded-full bg-green-400"
                          />
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="form" className="flex flex-col gap-5">
                      {/* Location */}
                      <div>
                        <label className="text-white/50 text-xs font-medium mb-2 block">LOCATION</label>
                        <div className="relative">
                          <MapPin size={16} className="absolute left-3 top-3.5 text-blood-400" />
                          <input
                            type="text"
                            placeholder="Auto-detecting your location..."
                            defaultValue="GSMC Hospital, Mumbai — 19.0760° N, 72.8777° E"
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white text-sm focus:outline-none focus:border-blood-500/50 transition-colors"
                          />
                        </div>
                      </div>

                      {/* Blood Group */}
                      <div>
                        <label className="text-white/50 text-xs font-medium mb-2 block">BLOOD GROUP REQUIRED</label>
                        <div className="grid grid-cols-4 gap-2">
                          {bloodGroups.map(bg => (
                            <motion.button
                              key={bg}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setForm(f => ({ ...f, bloodGroup: bg }))}
                              className={`py-2 rounded-xl border font-syne font-bold text-sm transition-all ${
                                form.bloodGroup === bg
                                  ? 'bg-blood-500/30 border-blood-500 text-blood-300 glow-red-sm'
                                  : 'glass border-white/10 text-white/60 hover:border-white/20'
                              }`}
                            >
                              {bg}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Units + Urgency */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-white/50 text-xs font-medium mb-2 block">UNITS NEEDED</label>
                          <select
                            value={form.units}
                            onChange={e => setForm(f => ({ ...f, units: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-blood-500/50 appearance-none"
                          >
                            {[1,2,3,4,5].map(n => <option key={n} value={n} className="bg-gray-900">{n} unit{n>1?'s':''}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-white/50 text-xs font-medium mb-2 block">URGENCY</label>
                          <select
                            value={form.urgency}
                            onChange={e => setForm(f => ({ ...f, urgency: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-blood-500/50 appearance-none"
                          >
                            <option value="critical" className="bg-gray-900">🔴 Critical</option>
                            <option value="high" className="bg-gray-900">🟠 High</option>
                            <option value="medium" className="bg-gray-900">🟡 Medium</option>
                          </select>
                        </div>
                      </div>

                      <PrimaryBtn
                        onClick={handleSubmit}
                        loading={loading}
                        disabled={!form.bloodGroup}
                        className="w-full py-4 text-base glow-red"
                      >
                        🚨 Broadcast Emergency Request
                      </PrimaryBtn>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Droplets, User, Mail, Lock, Phone, MapPin, ChevronRight, CheckCircle } from 'lucide-react'
import { PageEnter, PrimaryBtn, BloodBadge } from '../components/UI'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export default function Register() {
  const [role, setRole] = useState('donor')
  const [step, setStep] = useState(1)
  const [bloodGroup, setBloodGroup] = useState('')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleNext = async () => {
    if (step < 2) { setStep(2); return }
    setLoading(true)
    setError('')
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      window.location.href = role === 'donor' ? '/donor/dashboard' : role === 'hospital' ? '/hospital/dashboard' : '/patient/dashboard'
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageEnter>
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 py-12 relative overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-blood-500/6 blur-[100px] pointer-events-none" />

        <div className="w-full max-w-lg relative">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blood-500 flex items-center justify-center glow-red-sm">
                <Droplets size={20} className="text-white" />
              </div>
              <span className="font-syne font-black text-2xl">Rudhir<span className="text-blood-500">Setu</span></span>
            </Link>
            <h1 className="font-syne text-2xl font-bold text-white">Create Account</h1>
            <p className="text-white/40 text-sm mt-1">Join the network and start saving lives</p>
          </motion.div>

          {/* Steps */}
          <div className="flex items-center gap-2 mb-6 px-2">
            {[1, 2].map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s ? 'bg-blood-500 text-white' : 'glass text-white/30'
                }`}>
                  {step > s ? <CheckCircle size={16} /> : s}
                </div>
                <span className={`text-xs ${step >= s ? 'text-white/60' : 'text-white/20'}`}>
                  {s === 1 ? 'Basic Info' : 'Details'}
                </span>
                {i < 1 && <div className={`flex-1 h-0.5 rounded-full ${step > s ? 'bg-blood-500' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-3xl p-8 border border-white/8"
          >
            {/* Role Select */}
            <div className="flex gap-3 mb-6">
              {[
                { id: 'donor', label: '🩸 Donor', desc: 'I want to donate' },
                { id: 'hospital', label: '🏥 Hospital', desc: 'We need blood' },
                { id: 'patient', label: '🚑 Patient', desc: 'I need blood' },
              ].map(r => (
                <motion.button
                  key={r.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setRole(r.id)}
                  className={`flex-1 p-3 rounded-xl border text-left transition-all ${
                    role === r.id ? 'glass-red border-blood-500/40' : 'glass border-white/10'
                  }`}
                >
                  <p className={`font-medium text-sm ${role === r.id ? 'text-blood-400' : 'text-white/60'}`}>{r.label}</p>
                  <p className="text-white/30 text-xs">{r.desc}</p>
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-4"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-white/50 text-xs mb-1.5 block">FIRST NAME</label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-3.5 text-white/30" />
                        <input type="text" placeholder="Rahul" className="w-full bg-white/5 border border-white/10 focus:border-blood-500/50 rounded-xl pl-9 pr-3 py-3 text-white text-sm outline-none placeholder:text-white/20 transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="text-white/50 text-xs mb-1.5 block">LAST NAME</label>
                      <input type="text" placeholder="Sharma" className="w-full bg-white/5 border border-white/10 focus:border-blood-500/50 rounded-xl px-3 py-3 text-white text-sm outline-none placeholder:text-white/20 transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label className="text-white/50 text-xs mb-1.5 block">EMAIL</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-3.5 text-white/30" />
                      <input type="email" placeholder="rahul@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 focus:border-blood-500/50 rounded-xl pl-9 pr-3 py-3 text-white text-sm outline-none placeholder:text-white/20 transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label className="text-white/50 text-xs mb-1.5 block">PHONE</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-3.5 text-white/30" />
                      <input type="tel" placeholder="+91 98765 43210" className="w-full bg-white/5 border border-white/10 focus:border-blood-500/50 rounded-xl pl-9 pr-3 py-3 text-white text-sm outline-none placeholder:text-white/20 transition-colors" />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-4"
                >
                  {role === 'donor' && (
                    <div>
                      <label className="text-white/50 text-xs mb-2 block">BLOOD GROUP</label>
                      <div className="grid grid-cols-4 gap-2">
                        {bloodGroups.map(bg => (
                          <motion.button
                            key={bg}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setBloodGroup(bg)}
                            className={`py-2 rounded-xl border font-syne font-bold text-sm transition-all ${
                              bloodGroup === bg
                                ? 'bg-blood-500/30 border-blood-500 text-blood-300 glow-red-sm'
                                : 'glass border-white/10 text-white/60 hover:border-white/20'
                            }`}
                          >
                            {bg}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-white/50 text-xs mb-1.5 block">CITY / LOCATION</label>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-3 top-3.5 text-white/30" />
                      <input type="text" placeholder="Mumbai, Maharashtra" className="w-full bg-white/5 border border-white/10 focus:border-blood-500/50 rounded-xl pl-9 pr-3 py-3 text-white text-sm outline-none placeholder:text-white/20 transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label className="text-white/50 text-xs mb-1.5 block">PASSWORD</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-3.5 text-white/30" />
                      <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 focus:border-blood-500/50 rounded-xl pl-9 pr-3 py-3 text-white text-sm outline-none placeholder:text-white/20 transition-colors" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && <p className="text-blood-500 text-xs text-center mt-4">{error}</p>}

            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep(1)}
                  className="glass rounded-xl px-5 py-3 text-white/60 hover:text-white text-sm transition-colors"
                >
                  Back
                </motion.button>
              )}
              <PrimaryBtn onClick={handleNext} loading={loading} className="flex-1">
                {step < 2 ? 'Continue' : 'Create Account'} <ChevronRight size={16} />
              </PrimaryBtn>
            </div>

            <p className="text-center text-white/40 text-sm mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-blood-400 hover:text-blood-300 transition-colors font-medium">Sign in</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </PageEnter>
  )
}

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Lock, Phone, MapPin, ChevronRight, CheckCircle } from 'lucide-react'
import { PageEnter, PrimaryBtn } from '../components/UI'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { cacheUserRole, getDashboardPath, ROLES } from '../lib/roles'
import { useNavigate } from 'react-router-dom'
import LogoMark from '../components/LogoMark'

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export default function Register() {
  const [role, setRole] = useState('donor')
  const [step, setStep] = useState(1)
  const [bloodGroup, setBloodGroup] = useState('')
  const [donorMedical, setDonorMedical] = useState({ diabetes: null, alcohol: null, smoking: null })
  const [availableBloodGroups, setAvailableBloodGroups] = useState([])
  const [geo, setGeo] = useState(null) // {lat, lng}
  const [loading, setLoading] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [hospitalName, setHospitalName] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const fullName = useMemo(() => {
    if (role === ROLES.hospital) return hospitalName.trim()
    return `${firstName} ${lastName}`.trim()
  }, [firstName, lastName, hospitalName, role])

  const toggleAvailBg = (bg) => {
    setAvailableBloodGroups(prev => prev.includes(bg) ? prev.filter(x => x !== bg) : [...prev, bg])
  }

  const captureGeo = async () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (p) => setGeo({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => {},
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const handleNext = async () => {
    if (step < 2) { setStep(2); return }
    if (role === ROLES.donor) {
      const missingMedical =
        donorMedical.diabetes === null ||
        donorMedical.alcohol === null ||
        donorMedical.smoking === null
      if (!bloodGroup || missingMedical) {
        setError(!bloodGroup ? 'Please select your blood group.' : 'Please answer all health & safety questions.')
        return
      }
    }
    setLoading(true)
    setError('')
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)

      const safeRole = role === 'hospital'
        ? ROLES.hospital
        : role === 'patient'
          ? ROLES.patient
          : ROLES.donor

      await setDoc(doc(db, 'users', cred.user.uid), {
        role: safeRole,
        name: fullName || null,
        email: email || cred.user.email || null,
        phone: phone || null,
        location: location || null,
        bloodGroup: safeRole === ROLES.donor ? (bloodGroup || null) : null,
        medical: safeRole === ROLES.donor ? {
          diabetes: donorMedical.diabetes,
          alcohol: donorMedical.alcohol,
          smoking: donorMedical.smoking,
        } : null,
        availableBloodGroups: safeRole === ROLES.hospital ? (availableBloodGroups.length ? availableBloodGroups : null) : null,
        geo: safeRole === ROLES.hospital ? (geo || null) : null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true })

      cacheUserRole(cred.user.uid, safeRole)
      navigate(getDashboardPath(safeRole), { replace: true })
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
                <LogoMark className="w-7 h-7" />
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
                  {role === ROLES.hospital ? (
                    <div>
                      <label className="text-white/50 text-xs mb-1.5 block">HOSPITAL NAME</label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-3.5 text-white/30" />
                        <input
                          type="text"
                          placeholder="Apollo Hospitals"
                          value={hospitalName}
                          onChange={(e) => setHospitalName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 focus:border-blood-500/50 rounded-xl pl-9 pr-3 py-3 text-white text-sm outline-none placeholder:text-white/20 transition-colors"
                        />
                      </div>
                      <p className="text-white/30 text-xs mt-1">For hospitals, a single name is enough.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-white/50 text-xs mb-1.5 block">FIRST NAME</label>
                        <div className="relative">
                          <User size={14} className="absolute left-3 top-3.5 text-white/30" />
                          <input
                            type="text"
                            placeholder="Rahul"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 focus:border-blood-500/50 rounded-xl pl-9 pr-3 py-3 text-white text-sm outline-none placeholder:text-white/20 transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-white/50 text-xs mb-1.5 block">LAST NAME</label>
                        <input
                          type="text"
                          placeholder="Sharma"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 focus:border-blood-500/50 rounded-xl px-3 py-3 text-white text-sm outline-none placeholder:text-white/20 transition-colors"
                        />
                      </div>
                    </div>
                  )}

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
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 focus:border-blood-500/50 rounded-xl pl-9 pr-3 py-3 text-white text-sm outline-none placeholder:text-white/20 transition-colors"
                      />
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

                  {role === ROLES.donor && (
                    <div className="glass rounded-2xl p-4 border border-white/10">
                      <p className="text-white font-medium text-sm mb-3">Health & Safety (required)</p>

                      {[
                        { key: 'diabetes', label: 'Do you have diabetes?' },
                        { key: 'alcohol', label: 'Do you consume alcohol regularly?' },
                        { key: 'smoking', label: 'Do you smoke or use tobacco?' },
                      ].map(q => (
                        <div key={q.key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2 border-b border-white/5 last:border-0">
                          <span className="text-white/60 text-sm">{q.label}</span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setDonorMedical(m => ({ ...m, [q.key]: false }))}
                              className={`px-3 py-1.5 rounded-xl text-xs border transition-colors ${
                                donorMedical[q.key] === false
                                  ? 'bg-green-500/20 border-green-500/30 text-green-300'
                                  : 'glass border-white/10 text-white/50 hover:text-white'
                              }`}
                            >
                              No
                            </button>
                            <button
                              type="button"
                              onClick={() => setDonorMedical(m => ({ ...m, [q.key]: true }))}
                              className={`px-3 py-1.5 rounded-xl text-xs border transition-colors ${
                                donorMedical[q.key] === true
                                  ? 'bg-blood-500/20 border-blood-500/30 text-blood-300'
                                  : 'glass border-white/10 text-white/50 hover:text-white'
                              }`}
                            >
                              Yes
                            </button>
                          </div>
                        </div>
                      ))}

                      {(donorMedical.diabetes === null || donorMedical.alcohol === null || donorMedical.smoking === null) && (
                        <p className="text-white/30 text-xs mt-3">Please answer all questions to continue.</p>
                      )}
                    </div>
                  )}

                  {role === ROLES.hospital && (
                    <div>
                      <label className="text-white/50 text-xs mb-2 block">AVAILABLE BLOOD GROUPS</label>
                      <div className="grid grid-cols-4 gap-2">
                        {bloodGroups.map(bg => (
                          <motion.button
                            key={bg}
                            type="button"
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleAvailBg(bg)}
                            className={`py-2 rounded-xl border font-syne font-bold text-sm transition-all ${
                              availableBloodGroups.includes(bg)
                                ? 'bg-blood-500/30 border-blood-500 text-blood-300 glow-red-sm'
                                : 'glass border-white/10 text-white/60 hover:border-white/20'
                            }`}
                          >
                            {bg}
                          </motion.button>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <p className="text-white/30 text-xs">
                          {geo ? `📍 Geo saved: ${geo.lat.toFixed(4)}, ${geo.lng.toFixed(4)}` : '📍 Geo not set (optional)'}
                        </p>
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.97 }}
                          onClick={captureGeo}
                          className="text-xs px-3 py-2 rounded-xl glass border border-white/10 text-white/60 hover:text-white transition-colors"
                        >
                          Use my location
                        </motion.button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-white/50 text-xs mb-1.5 block">CITY / LOCATION</label>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-3 top-3.5 text-white/30" />
                      <input
                        type="text"
                        name="rs_location"
                        autoComplete="off"
                        placeholder="Mumbai, Maharashtra"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 focus:border-blood-500/50 rounded-xl pl-9 pr-3 py-3 text-white text-sm outline-none placeholder:text-white/20 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white/50 text-xs mb-1.5 block">PASSWORD</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-3.5 text-white/30" />
                      <input
                        type="password"
                        name="rs_new_password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 focus:border-blood-500/50 rounded-xl pl-9 pr-3 py-3 text-white text-sm outline-none placeholder:text-white/20 transition-colors"
                      />
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

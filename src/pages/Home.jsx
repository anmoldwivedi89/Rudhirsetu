import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  Heart,
  MapPin,
  Zap,
  Shield,
  Users,
  Droplets,
  ArrowRight,
  Star,
  Activity,
  Clock,
  Building2,
  HeartPulse,
  BadgeCheck,
  Plus,
  Minus,
  Github,
  Linkedin,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import EmergencyModal from '../components/EmergencyModal'
import { PageEnter } from '../components/UI'
import LogoMark from '../components/LogoMark'

function AnimatedCounter({ end, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = end / 60
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 20)
    return () => clearInterval(timer)
  }, [inView, end])
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

const features = [
  { icon: Zap, title: 'Real-Time Matching', desc: 'Smart donor discovery in under 60 seconds for urgent needs.', color: 'yellow' },
  { icon: MapPin, title: 'Location-Based', desc: 'Find compatible donors near you with precise radius filtering.', color: 'blue' },
  { icon: BadgeCheck, title: 'Verified Donors', desc: 'Donor profiles are screened and verified for safer matches.', color: 'green' },
  { icon: Activity, title: 'Live Tracking', desc: 'Track every request from broadcast to fulfillment in real time.', color: 'purple' },
  { icon: Clock, title: '24/7 Emergency', desc: 'Round-the-clock emergency broadcast system when seconds matter.', color: 'red' },
  { icon: Heart, title: 'Community Driven', desc: 'Built for donors, hospitals, and patients to save lives together.', color: 'pink' },
]

const stats = [
  { label: 'Registered Donors', value: 48750, suffix: '+', Icon: Users },
  { label: 'Lives Saved', value: 12480, suffix: '+', Icon: HeartPulse },
  { label: 'Partner Hospitals', value: 340, suffix: '+', Icon: Building2 },
  { label: 'Active Requests', value: 980, suffix: '+', Icon: Activity },
]

const testimonials = [
  { name: 'Dr. Priya Sharma', role: 'Emergency Physician, AIIMS', text: 'RudhirSetu helped us find a rare AB- donor in 12 minutes during a critical surgery.', avatar: 'PS' },
  { name: 'Rahul Mehta', role: 'Regular Donor', text: 'The gamification makes donating feel rewarding. I\'ve saved 8 lives now.', avatar: 'RM' },
  { name: 'City Hospital Mumbai', role: 'Partner Hospital', text: 'Our blood shortage cases dropped by 73% after integrating with RudhirSetu.', avatar: 'CH' },
]

const howItWorks = [
  { step: '01', title: 'Register', desc: 'Create your profile as a donor or hospital in minutes.', Icon: Users },
  { step: '02', title: 'Find / Request Blood', desc: 'Broadcast urgent needs or discover verified donors nearby.', Icon: Droplets },
  { step: '03', title: 'Save Lives', desc: 'Coordinate quickly and track fulfillment with confidence.', Icon: HeartPulse },
]

const liveRequests = [
  { hospital: 'AIIMS Delhi', group: 'O-', distance: '0.8 km', urgency: 'Critical', note: 'Surgery in 45 mins' },
  { hospital: 'City Hospital', group: 'B+', distance: '2.1 km', urgency: 'Medium', note: 'Thalassemia' },
  { hospital: 'Apollo Mumbai', group: 'AB+', distance: '3.4 km', urgency: 'Critical', note: 'Accident ER' },
]

const faqs = [
  { q: 'How to donate blood?', a: 'Register as a donor, complete your profile, and respond to nearby requests when you’re available.' },
  { q: 'Is it safe?', a: 'Yes. Donations follow standard medical screening and hygiene protocols. RudhirSetu also promotes verified donor profiles for safer matching.' },
  { q: 'How fast can I get help?', a: 'Requests are broadcast instantly. Response time depends on availability, distance, and blood group rarity, but the platform is built for speed.' },
  { q: 'Who can use this platform?', a: 'Donors, hospitals, and patients can use RudhirSetu to coordinate urgent blood needs and responses.' },
]

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)
  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 8,
      delay: Math.random() * 5,
    }))
  )

  return (
    <PageEnter>
      <div className="min-h-screen bg-[#0a0a0a] pb-24 md:pb-0">
        <Navbar />

        {/* Hero */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {/* Gradient bg */}
          <div className="absolute inset-0">
            <motion.div
              aria-hidden="true"
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-blood-500/14 blur-[150px]"
              animate={{ opacity: [0.55, 0.85, 0.55] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              aria-hidden="true"
              className="absolute bottom-[-140px] right-[-140px] w-[520px] h-[520px] rounded-full bg-purple-500/12 blur-[130px]"
              animate={{ opacity: [0.35, 0.6, 0.35] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Grid */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'linear-gradient(rgba(239,68,68,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.5) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.10),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.04),transparent_55%)]" />
          </div>

          {/* Floating particles */}
          {particles.map(p => (
            <motion.div
              key={p.id}
              animate={{ y: [-20, 20, -20], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
              className="absolute rounded-full bg-blood-500/30"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            />
          ))}

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-16 sm:pb-20">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 glass-red rounded-full px-4 py-2 mb-6 border border-blood-500/20 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_0_40px_rgba(239,68,68,0.12)]"
                >
                  <span className="w-2 h-2 rounded-full bg-blood-500 animate-pulse" />
                  <span className="text-gray-200 text-sm font-semibold">
                    Live Network <span className="text-blood-400">— 48K+</span> Active Donors
                  </span>
                </motion.div>

                <motion.h1
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
                  }}
                  className="font-syne text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.05] tracking-[-0.02em] mb-4 sm:mb-6"
                >
                  {['Saving Lives', 'Through Real-Time', 'Blood Connection'].map((line, idx) => (
                    <motion.span
                      key={line}
                      variants={{
                        hidden: { opacity: 0, y: 10, filter: 'blur(6px)' },
                        show: { opacity: 1, y: 0, filter: 'blur(0px)' },
                      }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="block"
                    >
                      {idx === 1 ? (
                        <span className="text-glow bg-clip-text text-transparent bg-[linear-gradient(90deg,#ffffff_0%,#fecaca_18%,#ef4444_60%,#ffffff_100%)]">
                          {line}
                        </span>
                      ) : (
                        line
                      )}
                    </motion.span>
                  ))}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.5 }}
                  className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-xl font-medium"
                >
                  The fastest, verified network to connect emergency blood requests with nearby donors. Every second counts.
                </motion.p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: '0 0 55px rgba(239,68,68,0.55)' }}
                      whileTap={{ scale: 0.97 }}
                      className="group relative flex items-center justify-center gap-2 text-white font-bold px-5 sm:px-7 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base transition-all duration-300 w-full sm:w-auto shadow-[0_12px_35px_rgba(239,68,68,0.22)]"
                      style={{
                        backgroundImage:
                          'linear-gradient(135deg, rgba(239,68,68,1) 0%, rgba(190,18,60,1) 55%, rgba(239,68,68,0.95) 100%)',
                      }}
                    >
                      <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_55%)]" />
                      <Droplets size={18} />
                      Become a Donor
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                    </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 45px rgba(239,68,68,0.28)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setModalOpen(true)}
                    className="group relative flex items-center justify-center gap-2 border border-blood-500/30 text-white font-bold px-5 sm:px-7 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base transition-all duration-300 w-full sm:w-auto shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_12px_30px_rgba(0,0,0,0.30)]"
                    style={{
                      backgroundImage:
                        'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(239,68,68,0.10) 50%, rgba(255,255,255,0.04) 100%)',
                      backdropFilter: 'blur(14px)',
                    }}
                  >
                    <span className="pointer-events-none absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.22),transparent_60%)]" />
                    Request Blood
                  </motion.button>
                </div>

                {/* Trust indicators */}
                <div className="flex items-center gap-4 sm:gap-6 mt-8 sm:mt-10">
                  <div className="flex -space-x-2">
                    {['A', 'B', 'C', 'D'].map((l, i) => (
                      <div key={l} className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blood-500/40 to-blood-700/40 border-2 border-black flex items-center justify-center text-[10px] sm:text-xs font-bold text-white">
                        {l}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-0.5">
                      {[1,2,3,4,5].map(i => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />)}
                    </div>
                    <p className="text-gray-300 text-xs font-medium">Trusted by 12,000+ lives saved</p>
                  </div>
                </div>
              </motion.div>

              {/* Right — Visual */}
              <motion.div
                initial={{ opacity: 0, x: 40, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative hidden lg:block"
              >
                <div className="pointer-events-none absolute -inset-10 rounded-[48px] bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.22),transparent_60%)] blur-2xl" />
                {/* Main card */}
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="glass-red rounded-3xl p-6 border border-blood-500/20 glow-red shadow-[0_30px_80px_rgba(0,0,0,0.55),0_0_60px_rgba(239,68,68,0.18)]"
                >
                  {/* Live indicator */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-gray-300 text-sm font-semibold">Active Requests</span>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-green-400 text-xs">LIVE</span>
                    </div>
                  </div>

                  {/* Mini request cards */}
                  {[
                    { blood: 'O-', dist: '0.8 km', urgency: 'critical', hospital: 'AIIMS Delhi' },
                    { blood: 'B+', dist: '2.1 km', urgency: 'high', hospital: 'City Hospital' },
                    { blood: 'AB+', dist: '3.4 km', urgency: 'medium', hospital: 'Apollo Mumbai' },
                  ].map((req, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.15 }}
                      className="flex items-center justify-between p-3 glass rounded-2xl mb-3 last:mb-0 border border-white/10 hover:border-blood-500/20 transition-colors duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-syne font-black text-blood-400 text-lg w-10">{req.blood}</span>
                        <div>
                          <p className="text-white text-sm font-medium">{req.hospital}</p>
                          <p className="text-gray-300 text-xs font-medium">📍 {req.dist}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-lg border font-medium ${
                        req.urgency === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse' :
                        req.urgency === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }`}>{req.urgency}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Floating cards */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -top-6 -right-6 glass rounded-2xl px-4 py-3 border border-white/10"
                >
                  <p className="text-gray-300 text-xs font-medium">Match Found</p>
                  <p className="text-white font-syne font-bold text-sm">Donor: 0.8 km 🎯</p>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                  className="absolute -bottom-4 -left-6 glass-red rounded-2xl px-4 py-3 border border-blood-500/30"
                >
                  <p className="text-blood-400 text-xs font-medium">⚡ Response Time</p>
                  <p className="text-white font-syne font-bold text-xl">4.2 min</p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Quick Actions (mobile-first) */}
        <section className="relative -mt-10 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-md mx-auto lg:max-w-none">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.45)] overflow-hidden">
                <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                  <p className="text-white font-syne font-black text-lg">Quick Actions</p>
                  <p className="text-gray-300 text-xs font-semibold">Swipe</p>
                </div>
                <div className="px-4 pb-5">
                  <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {[
                      { label: 'Request Blood', Icon: Droplets, onClick: () => setModalOpen(true), tone: 'from-blood-500/25 to-white/5', border: 'border-blood-500/25' },
                      { label: 'Become Donor', Icon: Users, to: '/register', tone: 'from-white/10 to-white/5', border: 'border-white/10' },
                      { label: 'Find Nearby', Icon: MapPin, to: '/find-blood', tone: 'from-purple-500/15 to-white/5', border: 'border-white/10' },
                      { label: 'Emergency', Icon: HeartPulse, onClick: () => setModalOpen(true), tone: 'from-red-500/20 to-white/5', border: 'border-blood-500/20' },
                    ].map((a) => {
                      const Card = (
                        <motion.button
                          key={a.label}
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={a.onClick}
                          className={[
                            'snap-start shrink-0 w-[160px] rounded-2xl border',
                            a.border,
                            'bg-gradient-to-br',
                            a.tone,
                            'px-4 py-4 text-left transition-colors duration-300',
                          ].join(' ')}
                        >
                          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/20">
                            <a.Icon size={20} className="text-white" />
                          </div>
                          <div className="mt-3">
                            <p className="text-white font-semibold leading-tight">{a.label}</p>
                            <p className="text-gray-300 text-xs font-medium mt-1">Tap to open</p>
                          </div>
                        </motion.button>
                      )

                      if (a.to) {
                        return (
                          <Link key={a.label} to={a.to} className="shrink-0">
                            {Card}
                          </Link>
                        )
                      }
                      return Card
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Blood Requests */}
        <section className="py-10 border-y border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-md mx-auto lg:max-w-none">
              <div className="flex items-end justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-syne text-2xl sm:text-3xl font-black text-white">
                    Live Blood <span className="text-blood-500">Requests</span>
                  </h2>
                  <p className="text-gray-300 text-sm sm:text-base font-medium mt-1">
                    Sample feed (real results appear after login).
                  </p>
                </div>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setModalOpen(true)}
                  className="hidden sm:inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold text-white border border-blood-500/25 bg-white/[0.04] hover:bg-white/[0.06] transition-all duration-300"
                >
                  <Droplets size={16} className="text-blood-300" />
                  Request
                </motion.button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {liveRequests.map((r, idx) => {
                  const urgencyStyle =
                    r.urgency === 'Critical'
                      ? 'bg-red-500/15 text-red-200 border-red-500/30'
                      : 'bg-yellow-500/15 text-yellow-200 border-yellow-500/30'
                  return (
                    <motion.div
                      key={r.hospital + idx}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08 }}
                      className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_12px_35px_rgba(0,0,0,0.30)] overflow-hidden"
                    >
                      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.10),transparent)] animate-[shimmer_2.5s_ease-in-out_infinite]" />
                      <div className="relative">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-white font-semibold">{r.hospital}</p>
                            <p className="text-gray-300 text-sm font-medium mt-1">📍 {r.distance} • {r.note}</p>
                          </div>
                          <span className={`shrink-0 text-xs px-2.5 py-1 rounded-xl border font-black ${urgencyStyle} ${r.urgency === 'Critical' ? 'animate-pulse' : ''}`}>
                            {r.urgency}
                          </span>
                        </div>
                        <div className="mt-5 flex items-center justify-between">
                          <div className="inline-flex items-center gap-2 rounded-xl border border-blood-500/20 bg-blood-500/10 px-3 py-2">
                            <Droplets size={16} className="text-blood-300" />
                            <span className="font-syne font-black text-white">{r.group}</span>
                          </div>
                          <span className="text-gray-300 text-sm font-semibold">Urgent match</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <div className="mt-5 sm:hidden">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setModalOpen(true)}
                  className="w-full rounded-2xl px-5 py-3 text-sm font-black text-white border border-blood-500/25 bg-white/[0.04] hover:bg-white/[0.06] transition-all duration-300"
                >
                  Request Blood
                </motion.button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 border-y border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="mx-auto mb-3 inline-flex items-center justify-center rounded-2xl border border-blood-500/20 bg-blood-500/10 p-3 shadow-[0_0_30px_rgba(239,68,68,0.12)]">
                    <s.Icon size={20} className="text-blood-300" />
                  </div>
                  <p className="font-syne text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                    <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#ffffff_0%,#fecaca_25%,#ef4444_70%)]">
                      <AnimatedCounter end={s.value} suffix={s.suffix} />
                    </span>
                  </p>
                  <p className="text-gray-300 text-sm mt-2 font-medium">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-md mx-auto lg:max-w-none">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10"
              >
                <h2 className="font-syne text-2xl sm:text-3xl md:text-4xl font-black text-white">
                  How it <span className="text-blood-500">works</span>
                </h2>
                <p className="text-gray-300 text-sm sm:text-base font-medium mt-2 max-w-2xl">
                  A simple, app-first flow optimized for urgent needs—register, connect, and save lives.
                </p>
              </motion.div>

              {/* Mobile timeline */}
              <div className="lg:hidden space-y-3">
                {howItWorks.map((s, i) => (
                  <motion.div
                    key={s.step}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_12px_35px_rgba(0,0,0,0.30)]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-11 w-11 rounded-2xl border border-blood-500/20 bg-blood-500/10 flex items-center justify-center">
                          <s.Icon size={18} className="text-blood-300" />
                        </div>
                        {i !== howItWorks.length - 1 && <div className="mt-2 h-8 w-px bg-white/10" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-syne font-black text-white">{s.title}</p>
                          <p className="font-syne text-white/15 font-black">{s.step}</p>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed font-medium mt-1">{s.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Desktop cards */}
              <div className="hidden lg:grid grid-cols-3 gap-5">
                {howItWorks.map((s, i) => (
                  <motion.div
                    key={s.step}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -6 }}
                    className="group relative rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_12px_35px_rgba(0,0,0,0.30)] transition-all duration-300 hover:border-blood-500/25"
                  >
                    <span className="pointer-events-none absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.18),transparent_55%)]" />
                    <div className="relative flex items-start justify-between gap-4">
                      <div className="inline-flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl border border-blood-500/20 bg-blood-500/10 flex items-center justify-center">
                          <s.Icon size={20} className="text-blood-300" />
                        </div>
                        <div>
                          <p className="text-gray-300 text-xs font-semibold tracking-widest">STEP</p>
                          <p className="font-syne text-xl font-black text-white">{s.title}</p>
                        </div>
                      </div>
                      <p className="font-syne text-2xl font-black text-white/15">{s.step}</p>
                    </div>
                    <p className="relative mt-4 text-gray-300 text-sm leading-relaxed font-medium">{s.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why us */}
        <section className="py-16 sm:py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-md mx-auto lg:max-w-none">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-left mb-10"
              >
                <h2 className="font-syne text-2xl sm:text-3xl md:text-4xl font-black text-white">
                  Why <span className="text-blood-500">RudhirSetu</span>
                </h2>
                <p className="text-gray-300 text-sm sm:text-base font-medium mt-2 max-w-2xl">
                  Premium, glassy UI with mission-critical clarity—built for speed, trust, and reliability.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((f, i) => {
                  const colorMap = {
                    yellow: 'text-yellow-300 bg-yellow-500/10 border-yellow-500/20',
                    blue: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
                    green: 'text-green-300 bg-green-500/10 border-green-500/20',
                    purple: 'text-purple-300 bg-purple-500/10 border-purple-500/20',
                    red: 'text-blood-300 bg-blood-500/10 border-blood-500/20',
                    pink: 'text-pink-300 bg-pink-500/10 border-pink-500/20',
                  }
                  return (
                    <motion.div
                      key={f.title}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      whileHover={{ y: -6 }}
                      className="group relative rounded-2xl p-5 border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_12px_35px_rgba(0,0,0,0.30)] transition-all duration-300 hover:border-blood-500/25"
                    >
                      <span className="pointer-events-none absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.18),transparent_55%)]" />
                      <div className={`relative inline-flex p-3 rounded-2xl border mb-4 ${colorMap[f.color]}`}>
                        <f.icon size={20} />
                      </div>
                      <h3 className="relative font-syne font-black text-white text-lg mb-2">{f.title}</h3>
                      <p className="relative text-gray-300 text-sm leading-relaxed font-medium">{f.desc}</p>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 sm:py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-md mx-auto lg:max-w-none">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-syne text-2xl sm:text-3xl md:text-4xl font-black text-white mb-6"
              >
                Testimonials <span className="text-blood-500">that matter</span>
              </motion.h2>

              {/* Mobile: snap scroll carousel */}
              <div className="md:hidden -mx-4 px-4 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {testimonials.map((t, i) => (
                  <motion.div
                    key={t.name}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="snap-start min-w-[85%]"
                  >
                    <div className="rounded-2xl p-6 border border-white/10 bg-white/[0.05] backdrop-blur-xl shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blood-500/25 to-white/5 border border-blood-500/20 flex items-center justify-center font-syne font-black text-blood-200">
                          {t.avatar}
                        </div>
                        <div>
                          <p className="text-white font-semibold">{t.name}</p>
                          <p className="text-gray-300 text-xs font-medium">{t.role}</p>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed font-medium">"{t.text}"</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Desktop: grid */}
              <div className="hidden md:grid md:grid-cols-3 gap-5">
                {testimonials.map((t, i) => (
                  <motion.div
                    key={t.name}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -6 }}
                    className="group relative rounded-2xl p-6 border border-white/10 bg-white/[0.05] backdrop-blur-xl shadow-[0_14px_40px_rgba(0,0,0,0.35)] transition-all duration-300 hover:border-blood-500/25"
                  >
                    <span className="pointer-events-none absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.16),transparent_55%)]" />
                    <div className="relative">
                      <p className="text-gray-300 text-sm leading-relaxed mb-5 font-medium">"{t.text}"</p>
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blood-500/25 to-white/5 border border-blood-500/20 flex items-center justify-center font-syne font-black text-blood-200 text-sm">
                          {t.avatar}
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{t.name}</p>
                          <p className="text-gray-300 text-xs font-medium">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 sm:py-20 border-t border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="max-w-md mx-auto lg:max-w-none">
              <div className="text-left mb-8">
                <h2 className="font-syne text-2xl sm:text-3xl md:text-4xl font-black text-white">
                  FAQ <span className="text-blood-500">for quick clarity</span>
                </h2>
                <p className="text-gray-300 mt-2 font-medium">
                  Tap to expand—touch friendly, smooth, and readable.
                </p>
              </div>

              <div className="space-y-3">
                {faqs.map((item, idx) => {
                  const open = openFaq === idx
                  return (
                    <motion.div
                      key={item.q}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(open ? -1 : idx)}
                        className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 text-left transition-colors duration-300 hover:bg-white/[0.06]"
                        aria-expanded={open}
                      >
                        <span className="text-white font-semibold">{item.q}</span>
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-blood-500/20 bg-blood-500/10 text-blood-200">
                          {open ? <Minus size={18} /> : <Plus size={18} />}
                        </span>
                      </button>
                      <motion.div
                        initial={false}
                        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-5 sm:px-6"
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="pb-5 text-gray-300 text-sm leading-relaxed font-medium">
                          {item.a}
                        </div>
                      </motion.div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="py-16 sm:py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-md mx-auto lg:max-w-none">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div>
                  <h2 className="font-syne text-2xl sm:text-3xl md:text-4xl font-black text-white">
                    Built on <span className="text-blood-500">trust</span>
                  </h2>
                  <p className="text-gray-300 mt-2 font-medium max-w-xl">
                    Verified profiles, secure flows, and real-time updates—designed for critical moments.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {[
                      { Icon: BadgeCheck, label: 'Verified' },
                      { Icon: Shield, label: 'Secure' },
                      { Icon: Activity, label: 'Real-time' },
                    ].map((b) => (
                      <div key={b.label} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2">
                        <b.Icon size={16} className="text-blood-300" />
                        <span className="text-white font-semibold text-sm">{b.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 w-full lg:max-w-md">
                  {['AIIMS', 'Apollo', 'CityCare', 'LifeLine', 'MedPlus', 'HospX'].map((name) => (
                    <div
                      key={name}
                      className="h-14 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-gray-300 text-sm font-semibold"
                    >
                      {name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative glass-red rounded-3xl p-7 sm:p-12 border border-blood-500/20 glow-red overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.55),0_0_70px_rgba(239,68,68,0.20)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.18),transparent_55%)]" />
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                className="relative text-4xl sm:text-6xl mb-4 sm:mb-6"
              >
                🩸
              </motion.div>
              <h2 className="relative font-syne text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
                One drop can save<br /><span className="text-blood-500">three lives.</span>
              </h2>
              <p className="relative text-gray-300 text-lg mb-8 font-medium">Join the network. Be the reason someone’s heart keeps beating.</p>
              <div className="relative flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/register" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 55px rgba(239,68,68,0.65)' }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full sm:w-auto text-white font-black px-8 py-4 rounded-2xl text-base shadow-[0_16px_45px_rgba(239,68,68,0.25)]"
                    style={{
                      backgroundImage:
                        'linear-gradient(135deg, rgba(239,68,68,1) 0%, rgba(190,18,60,1) 55%, rgba(239,68,68,0.95) 100%)',
                    }}
                  >
                    Register as Donor
                  </motion.button>
                </Link>
                <Link to="/register?role=hospital" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full sm:w-auto text-white font-bold px-8 py-4 rounded-2xl text-base border border-white/10 bg-white/[0.04] hover:bg-white/[0.06] transition-colors duration-300"
                  >
                    Register Hospital
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-md mx-auto lg:max-w-none flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blood-500 flex items-center justify-center">
                  <LogoMark className="w-5 h-5" />
                </div>
                <span className="font-syne font-bold text-white">Rudhir<span className="text-blood-500">Setu</span></span>
              </div>
              <p className="text-gray-300 text-sm font-medium">© 2025 RudhirSetu. Built to save lives.</p>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                {['Privacy', 'Terms', 'Contact'].map(l => (
                  <a key={l} href="#" className="text-gray-300 hover:text-white text-sm font-semibold transition-colors duration-300">{l}</a>
                ))}
                <span className="hidden md:inline h-4 w-px bg-white/10" />
                <div className="flex items-center gap-3">
                  <a
                    href="#"
                    aria-label="LinkedIn"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.06] transition-colors duration-300"
                  >
                    <Linkedin size={18} className="text-gray-200" />
                  </a>
                  <a
                    href="#"
                    aria-label="GitHub"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.06] transition-colors duration-300"
                  >
                    <Github size={18} className="text-gray-200" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <EmergencyModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-60%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(60%); }
        }
      `}</style>
    </PageEnter>
  )
}

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Heart, MapPin, Zap, Shield, Users, Droplets, ArrowRight, Star, Activity, Clock } from 'lucide-react'
import Navbar from '../components/Navbar'
import EmergencyModal from '../components/EmergencyModal'
import { PageEnter } from '../components/UI'

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
  { icon: Zap, title: 'Real-Time Matching', desc: 'AI-powered donor discovery in under 60 seconds', color: 'yellow' },
  { icon: MapPin, title: 'Location-Based', desc: 'Find compatible donors within your proximity instantly', color: 'blue' },
  { icon: Shield, title: 'Verified Donors', desc: 'Every donor is medically screened and verified', color: 'green' },
  { icon: Activity, title: 'Live Tracking', desc: 'Track every request from broadcast to fulfillment', color: 'purple' },
  { icon: Clock, title: '24/7 Emergency', desc: 'Round-the-clock emergency broadcast system', color: 'red' },
  { icon: Heart, title: 'Gamified Giving', desc: 'Earn badges and rewards for every life you save', color: 'pink' },
]

const stats = [
  { label: 'Registered Donors', value: 48750, suffix: '+' },
  { label: 'Lives Saved', value: 12480, suffix: '+' },
  { label: 'Partner Hospitals', value: 340, suffix: '+' },
  { label: 'Cities Covered', value: 85, suffix: '' },
]

const testimonials = [
  { name: 'Dr. Priya Sharma', role: 'Emergency Physician, AIIMS', text: 'RudhirSetu helped us find a rare AB- donor in 12 minutes during a critical surgery.', avatar: 'PS' },
  { name: 'Rahul Mehta', role: 'Regular Donor', text: 'The gamification makes donating feel rewarding. I\'ve saved 8 lives now.', avatar: 'RM' },
  { name: 'City Hospital Mumbai', role: 'Partner Hospital', text: 'Our blood shortage cases dropped by 73% after integrating with RudhirSetu.', avatar: 'CH' },
]

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)
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
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />

        {/* Hero */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {/* Gradient bg */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-blood-500/10 blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/8 blur-[100px]" />
            {/* Grid */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'linear-gradient(rgba(239,68,68,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.5) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }} />
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
                  className="inline-flex items-center gap-2 glass-red rounded-full px-4 py-2 mb-6"
                >
                  <span className="w-2 h-2 rounded-full bg-blood-500 animate-pulse" />
                  <span className="text-blood-400 text-sm font-medium">Live Network — 48K+ Active Donors</span>
                </motion.div>

                <h1 className="font-syne text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-4 sm:mb-6">
                  Saving Lives
                  <br />
                  <span className="text-glow text-blood-500">Through Real-Time</span>
                  <br />
                  Blood Connection
                </h1>
                <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-lg">
                  The fastest, smartest platform to connect emergency blood requests with verified donors. Every second counts.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(239,68,68,0.5)' }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center justify-center gap-2 bg-blood-500 hover:bg-blood-600 text-white font-semibold px-5 sm:px-7 py-3 sm:py-4 rounded-2xl text-sm sm:text-base transition-all w-full sm:w-auto"
                    >
                      <Droplets size={18} />
                      Become a Donor
                      <ArrowRight size={16} />
                    </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(239,68,68,0.3)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setModalOpen(true)}
                    className="flex items-center justify-center gap-2 glass-red border border-blood-500/40 text-blood-400 font-semibold px-5 sm:px-7 py-3 sm:py-4 rounded-2xl text-sm sm:text-base transition-all animate-pulse-glow w-full sm:w-auto"
                  >
                    🚨 Request Blood Now
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
                    <p className="text-white/60 text-xs">Trusted by 12,000+ lives saved</p>
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
                {/* Main card */}
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="glass-red rounded-3xl p-6 border border-blood-500/20 glow-red"
                >
                  {/* Live indicator */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-white/60 text-sm font-medium">Active Requests</span>
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
                      className="flex items-center justify-between p-3 glass rounded-2xl mb-3 last:mb-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-syne font-black text-blood-400 text-lg w-10">{req.blood}</span>
                        <div>
                          <p className="text-white text-sm font-medium">{req.hospital}</p>
                          <p className="text-white/60 text-xs">📍 {req.dist}</p>
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
                  <p className="text-white/60 text-xs">Match Found</p>
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
                  <p className="font-syne text-3xl sm:text-4xl md:text-5xl font-black text-blood-500 text-glow">
                    <AnimatedCounter end={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-white/60 text-sm mt-2">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
                Why <span className="text-blood-500">RudhirSetu</span>?
              </h2>
              <p className="text-white/60 text-lg max-w-2xl mx-auto">
                We've rebuilt blood donation from the ground up — faster, smarter, and more reliable than anything before.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f, i) => {
                const colorMap = {
                  yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
                  blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                  green: 'text-green-400 bg-green-500/10 border-green-500/20',
                  purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
                  red: 'text-blood-400 bg-blood-500/10 border-blood-500/20',
                  pink: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
                }
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="glass rounded-2xl p-6 border border-white/10 hover:border-white/15 transition-all"
                  >
                    <div className={`inline-flex p-3 rounded-xl border mb-4 ${colorMap[f.color]}`}>
                      <f.icon size={22} />
                    </div>
                    <h3 className="font-syne font-bold text-white text-lg mb-2">{f.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-syne text-3xl font-black text-center text-white mb-12"
            >
              Trusted by <span className="text-blood-500">Thousands</span>
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-5">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-6"
                >
                  <p className="text-white/60 text-sm leading-relaxed mb-4">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blood-500/20 border border-blood-500/30 flex items-center justify-center font-syne font-bold text-blood-400 text-sm">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{t.name}</p>
                      <p className="text-white/60 text-xs">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-red rounded-3xl p-6 sm:p-12 border border-blood-500/20 glow-red"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-4xl sm:text-6xl mb-4 sm:mb-6"
              >
                🩸
              </motion.div>
              <h2 className="font-syne text-2xl sm:text-4xl md:text-5xl font-black text-white mb-4">
                One drop can save<br /><span className="text-blood-500">three lives.</span>
              </h2>
              <p className="text-white/60 text-lg mb-8">Join the network. Be the reason someone's heart keeps beating.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(239,68,68,0.6)' }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-blood-500 text-white font-bold px-8 py-4 rounded-2xl text-base"
                  >
                    Register as Donor
                  </motion.button>
                </Link>
                <Link to="/register?role=hospital">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="glass text-white font-semibold px-8 py-4 rounded-2xl text-base border border-white/10"
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blood-500 flex items-center justify-center">
                <Droplets size={14} className="text-white" />
              </div>
              <span className="font-syne font-bold text-white">Rudhir<span className="text-blood-500">Setu</span></span>
            </div>
            <p className="text-gray-400 text-sm">© 2025 RudhirSetu. Built to save lives.</p>
            <div className="flex gap-6">
              {['Privacy', 'Terms', 'Contact'].map(l => (
                <a key={l} href="#" className="text-gray-400 hover:text-white/60 text-sm transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>

      <EmergencyModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </PageEnter>
  )
}

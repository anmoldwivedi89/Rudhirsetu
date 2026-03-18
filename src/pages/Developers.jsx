import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Phone, Code2, Users, Sparkles } from 'lucide-react'
import Navbar from '../components/Navbar'
import { PageEnter } from '../components/UI'

const developers = [
  { name: 'Shobhit Asthana', phone: '+91 6388095158', roleTag: 'UI / UX Designer' },
  { name: 'Anmol', phone: '+91 751 881 2885', roleTag: 'Full Stack Developer' },
  { name: 'Amber', phone: '+91 83039 95618', roleTag: 'AI & Blockchain' },
]

function initials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const a = parts[0]?.[0] || ''
  const b = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (a + b).toUpperCase()
}

function telHref(phone) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

function DeveloperCard({ dev, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ scale: 1.05 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-black/40 backdrop-blur-xl p-6 transition-all duration-300 hover:shadow-[0_0_40px_rgba(239,68,68,0.22)]"
    >
      {/* subtle glow */}
      <div className="pointer-events-none absolute -top-16 -right-20 h-56 w-56 rounded-full bg-blood-500/10 blur-[70px]" />

      <div className="relative flex items-start gap-4">
        <div className="shrink-0">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blood-500/35 via-blood-600/20 to-white/5 border border-blood-500/25 flex items-center justify-center font-syne font-black text-blood-300 tracking-wide">
            {initials(dev.name)}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-syne font-extrabold text-white text-lg leading-tight">{dev.name}</p>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blood-500/15 text-blood-300 border border-blood-500/25">
              Team RudhirSetu
            </span>
          </div>

          <p className="text-white/50 text-sm mt-1">MCA 1st Year Student</p>

          <div className="mt-4 flex items-center justify-between gap-3">
            <a
              href={telHref(dev.phone)}
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl glass border border-white/10">
                <Phone size={16} className="text-blood-400" />
              </span>
              <span className="truncate">{dev.phone}</span>
            </a>

            <span className="text-xs px-3 py-1.5 rounded-xl bg-white/5 text-white/70 border border-white/10">
              {dev.roleTag || 'Developer'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Developers() {
  return (
    <PageEnter>
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />

        {/* Hero */}
        <section className="relative overflow-hidden pt-28 sm:pt-32 pb-14">
          <div className="absolute inset-0">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[780px] h-[780px] rounded-full bg-blood-500/10 blur-[140px]" />
            <div className="absolute bottom-[-180px] right-[-120px] w-[520px] h-[520px] rounded-full bg-purple-500/8 blur-[120px]" />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(239,68,68,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.6) 1px, transparent 1px)',
                backgroundSize: '64px 64px',
              }}
            />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 glass-red rounded-full px-4 py-2 mb-6 border border-blood-500/20"
            >
              <Sparkles size={14} className="text-blood-400" />
              <span className="text-blood-300 text-sm font-medium">Team behind RudhirSetu</span>
            </motion.div>

            <h1 className="font-syne text-3xl sm:text-5xl md:text-6xl font-black text-white leading-[1.08] mb-4">
              Meet the{' '}
              <span className="text-blood-500 text-glow bg-gradient-to-r from-blood-500 via-red-300 to-blood-500 bg-clip-text text-transparent">
                Developers
              </span>
            </h1>
            <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Built with passion by MCA students
            </p>
          </div>
        </section>

        {/* Developer Cards */}
        <section id="team" className="pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Code2 size={16} className="text-blood-400" />
              <p className="text-white/60 text-sm">Developers</p>
            </div>

            <div className="grid gap-5 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {developers.map((dev, i) => (
                <DeveloperCard key={dev.name} dev={dev} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* About Team */}
        <section className="py-20 border-y border-white/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 border border-white/10 mb-6">
              <Users size={14} className="text-blood-400" />
              <span className="text-white/60 text-sm">Our Mission</span>
            </div>

            <h2 className="font-syne text-2xl sm:text-4xl font-black text-white mb-4">
              Our <span className="text-blood-500">Mission</span>
            </h2>
            <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              We are MCA students building a smart blood donation platform to save lives through technology.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden text-center glass-red rounded-3xl p-8 sm:p-12 border border-blood-500/20 glow-red"
            >
              <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-blood-500/10 blur-[120px]" />

              <p className="text-white/70 text-base sm:text-lg mb-2">Want to collaborate or contribute?</p>
              <h3 className="font-syne text-2xl sm:text-4xl font-black text-white mb-6">
                Let’s build something <span className="text-blood-500">impactful</span>.
              </h3>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.a
                  whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(239,68,68,0.45)' }}
                  whileTap={{ scale: 0.97 }}
                  href="#team"
                  className="inline-flex items-center justify-center gap-2 bg-blood-500 hover:bg-blood-600 text-white font-semibold px-7 py-4 rounded-2xl transition-all duration-300"
                >
                  Contact Team
                </motion.a>

                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(239,68,68,0.25)' }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 glass border border-white/10 text-white font-semibold px-7 py-4 rounded-2xl transition-all duration-300"
                  >
                    Join Us
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PageEnter>
  )
}


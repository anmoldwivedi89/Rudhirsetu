import { motion } from 'framer-motion'
import { Github, Globe, Linkedin, Mail, Code2, Droplets, Star, Award, Zap, Heart } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import { PageEnter, GlassCard } from '../../components/UI'

const skills = ['React.js', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Framer Motion', 'Express', 'Socket.io', 'Firebase', 'Docker', 'TypeScript']
const projects = [
  { name: 'RudhirSetu', desc: 'Real-time blood donation network', tech: ['React', 'Node', 'MongoDB'], stars: 284 },
  { name: 'EduLink', desc: 'AI-powered tutoring platform', tech: ['Next.js', 'Python', 'ML'], stars: 156 },
  { name: 'GreenMap', desc: 'Environmental monitoring dashboard', tech: ['React', 'D3.js', 'API'], stars: 98 },
]

const socials = [
  { icon: Github, label: 'GitHub', handle: '@rudhirsetu-dev', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', handle: 'in/rudhirsetu', href: '#' },
  { icon: Globe, label: 'Portfolio', handle: 'rudhirsetu.dev', href: '#' },
  { icon: Mail, label: 'Email', handle: 'dev@rudhirsetu.in', href: '#' },
]

export default function DeveloperProfile() {
  return (
    <PageEnter>
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar role="admin" />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-3xl">
            {/* Hero card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative glass-red rounded-3xl p-8 border border-blood-500/20 mb-6 overflow-hidden"
            >
              {/* BG decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blood-500/5 blur-[80px] pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative">
                <motion.div
                  animate={{ boxShadow: ['0 0 20px rgba(239,68,68,0.3)', '0 0 40px rgba(239,68,68,0.6)', '0 0 20px rgba(239,68,68,0.3)'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blood-500 via-blood-600 to-blood-900 flex items-center justify-center"
                >
                  <Code2 size={36} className="text-white" />
                </motion.div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <h1 className="font-syne text-2xl font-black text-white">RudhirSetu Dev Team</h1>
                    <span className="text-xs bg-blood-500/20 text-blood-400 border border-blood-500/30 px-2 py-0.5 rounded-full">Hackathon 2025</span>
                  </div>
                  <p className="text-white/50 mb-3">Full-stack developers passionate about tech for social good. Building RudhirSetu to solve India's blood donation crisis.</p>
                  <div className="flex gap-3 flex-wrap">
                    {socials.map(({ icon: Icon, label, handle, href }) => (
                      <motion.a
                        key={label}
                        href={href}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1.5 glass text-white/50 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-xl text-xs transition-all"
                      >
                        <Icon size={12} /> {handle}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { icon: Droplets, label: 'Donors Enabled', value: '48K+' },
                { icon: Heart, label: 'Lives Impacted', value: '12K+' },
                { icon: Zap, label: 'Avg Response', value: '4.2m' },
                { icon: Award, label: 'Hackathon Wins', value: '3' },
              ].map(s => (
                <GlassCard key={s.label} className="p-4 text-center">
                  <s.icon size={18} className="text-blood-400 mx-auto mb-2" />
                  <p className="font-syne font-black text-white text-xl">{s.value}</p>
                  <p className="text-white/30 text-[10px] mt-0.5">{s.label}</p>
                </GlassCard>
              ))}
            </div>

            {/* Skills */}
            <GlassCard className="p-6 mb-5">
              <h3 className="font-syne font-bold text-white mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1.5 glass border border-white/10 hover:border-blood-500/40 text-white/60 hover:text-blood-400 rounded-xl text-sm transition-all cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </GlassCard>

            {/* Projects */}
            <GlassCard className="p-6">
              <h3 className="font-syne font-bold text-white mb-4">Notable Projects</h3>
              <div className="flex flex-col gap-3">
                {projects.map((proj, i) => (
                  <motion.div
                    key={proj.name}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-4 p-4 glass rounded-xl border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-syne font-black text-sm ${i === 0 ? 'bg-blood-500/20 text-blood-400 border border-blood-500/30' : 'bg-white/5 text-white/40 border border-white/10'}`}>
                      {proj.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{proj.name}</p>
                      <p className="text-white/40 text-xs">{proj.desc}</p>
                      <div className="flex gap-1.5 mt-1.5">
                        {proj.tech.map(t => (
                          <span key={t} className="text-[10px] bg-white/5 text-white/40 px-2 py-0.5 rounded-md">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                      <Star size={13} className="fill-yellow-400" />
                      <span className="font-medium">{proj.stars}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>
        </main>
      </div>
    </PageEnter>
  )
}

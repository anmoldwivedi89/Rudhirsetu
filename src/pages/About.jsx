import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, Shield, Zap, Users, Droplets } from 'lucide-react'
import Navbar from '../components/Navbar'
import { PageEnter } from '../components/UI'

export default function About() {
  return (
    <PageEnter>
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass-red rounded-full px-4 py-2 mb-6">
              <Droplets size={14} className="text-blood-400" />
              <span className="text-blood-400 text-sm">Our Mission</span>
            </div>
            <h1 className="font-syne text-5xl font-black text-white mb-4">
              Built to <span className="text-blood-500">Save Lives</span>
            </h1>
            <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
              RudhirSetu was created by a team of engineers who witnessed firsthand how blood shortages cost lives that didn't need to be lost. We built the solution we wished existed.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {[
              { icon: Zap, title: 'Speed is Everything', desc: 'Every minute matters in a blood emergency. Our real-time matching engine connects donors and patients in under 60 seconds — faster than any other platform.' },
              { icon: Shield, title: 'Trust & Safety First', desc: 'Every donor is medically verified. Every hospital is credentialed. We maintain a rigorous verification process so you can trust every interaction.' },
              { icon: Users, title: 'Community-Powered', desc: 'We\'re not just a platform — we\'re a movement. 48,000+ donors who believe that a few minutes of their time can mean everything to a stranger.' },
              { icon: Heart, title: 'Open & Accessible', desc: 'Blood donation should be easy. We\'ve removed every friction point — from discovery to donation — so more people can help more people, faster.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 border border-white/5"
              >
                <div className="w-10 h-10 rounded-xl bg-blood-500/15 border border-blood-500/25 flex items-center justify-center mb-4">
                  <item.icon size={20} className="text-blood-400" />
                </div>
                <h3 className="font-syne font-bold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center glass-red rounded-3xl p-10 border border-blood-500/20"
          >
            <h2 className="font-syne text-3xl font-black text-white mb-3">Join the Network</h2>
            <p className="text-white/50 mb-6">Be part of the movement. Register today and be ready when someone needs you most.</p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(239,68,68,0.5)' }}
                whileTap={{ scale: 0.97 }}
                className="bg-blood-500 text-white font-bold px-8 py-4 rounded-2xl hover:bg-blood-600 transition-colors"
              >
                Get Started — It's Free
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </PageEnter>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlusCircle, Users, CheckCircle, Clock, Activity, TrendingUp, Droplets, Bell } from 'lucide-react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import EmergencyModal from '../../components/EmergencyModal'
import { PageEnter, GlassCard, StatCard, SectionTitle, BloodBadge, UrgencyTag } from '../../components/UI'

const activeRequests = [
  { id: 1, blood: 'O-', patient: 'Emergency Surgery', units: 3, urgency: 'critical', donors: 2, stage: 3 },
  { id: 2, blood: 'B+', patient: 'Scheduled Transfusion', units: 1, urgency: 'medium', donors: 1, stage: 4 },
  { id: 3, blood: 'AB+', patient: 'Post-Op Recovery', units: 2, urgency: 'high', donors: 0, stage: 2 },
]

const stages = ['Created', 'Broadcasted', 'Accepted', 'Fulfilled']

function RequestLifecycle({ stage }) {
  return (
    <div className="flex items-center gap-1 mt-3">
      {stages.map((s, i) => (
        <div key={s} className="flex items-center gap-1 flex-1 last:flex-none">
          <div className={`flex flex-col items-center gap-1`}>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px] font-bold transition-all ${
              i + 1 <= stage ? 'bg-blood-500 border-blood-500 text-white' : 'bg-transparent border-white/20 text-white/20'
            }`}>
              {i + 1 <= stage ? '✓' : i + 1}
            </div>
            <span className={`text-[9px] whitespace-nowrap ${i + 1 <= stage ? 'text-white/60' : 'text-white/20'}`}>{s}</span>
          </div>
          {i < stages.length - 1 && (
            <div className={`flex-1 h-px mb-3 ${i + 1 < stage ? 'bg-blood-500' : 'bg-white/10'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function HospitalDashboard() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <PageEnter>
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar role="hospital" />
        <main className="flex-1 overflow-auto">
          {/* Top Bar */}
          <div className="sticky top-0 z-30 glass border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="font-syne font-bold text-white text-xl">Hospital Command Center</h1>
              <p className="text-white/40 text-xs">Apollo Hospitals Mumbai · Dr. Verma (Admin)</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/hospital/create-request">
                <motion.button
                  whileHover={{ boxShadow: '0 0 20px rgba(239,68,68,0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 bg-blood-500 text-white font-medium px-4 py-2 rounded-xl text-sm hover:bg-blood-600 transition-colors"
                >
                  <PlusCircle size={16} /> New Request
                </motion.button>
              </Link>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setModalOpen(true)}
                className="glass-red border border-blood-500/30 text-blood-400 text-sm px-4 py-2 rounded-xl"
              >
                🚨 Emergency
              </motion.button>
            </div>
          </div>

          <div className="p-6 max-w-6xl">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard icon={Activity} label="Active Requests" value="3" sub="2 critical" color="red" />
              <StatCard icon={CheckCircle} label="Fulfilled (Month)" value="28" sub="+12% vs last" color="green" />
              <StatCard icon={Users} label="Donors Matched" value="47" sub="This month" color="blue" />
              <StatCard icon={Clock} label="Avg Response" value="6m" sub="Industry best" color="purple" />
            </div>

            {/* Active Requests */}
            <SectionTitle sub="Tap to manage each request">Active Blood Requests</SectionTitle>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {activeRequests.map((req, i) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="glass rounded-2xl p-5 border border-white/5 hover:border-white/10 cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <BloodBadge type={req.blood} glow />
                    <UrgencyTag level={req.urgency} />
                  </div>
                  <p className="text-white font-medium text-sm">{req.patient}</p>
                  <div className="flex gap-3 mt-2">
                    <span className="text-white/40 text-xs">🩸 {req.units} units</span>
                    <span className="text-white/40 text-xs">👥 {req.donors} donors</span>
                  </div>
                  <RequestLifecycle stage={req.stage} />
                </motion.div>
              ))}
            </div>

            {/* Donor Approval */}
            <SectionTitle sub="Confirm or reject incoming donors">Donor Approvals</SectionTitle>
            <div className="flex flex-col gap-3">
              {[
                { name: 'Rahul Sharma', blood: 'O-', dist: '0.8 km', req: 'Emergency Surgery' },
                { name: 'Priya Mehta', blood: 'B+', dist: '2.1 km', req: 'Scheduled Transfusion' },
              ].map((d, i) => (
                <motion.div
                  key={d.name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-xl p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-blood-500/20 border border-blood-500/30 flex items-center justify-center font-syne font-bold text-blood-400 text-sm">
                    {d.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{d.name}</p>
                    <p className="text-white/40 text-xs">{d.blood} · {d.dist} · For: {d.req}</p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button whileTap={{ scale: 0.95 }} className="text-xs px-3 py-1.5 rounded-lg glass text-white/40 hover:text-red-400 transition-colors">
                      Reject
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ boxShadow: '0 0 12px rgba(34,197,94,0.3)' }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-all"
                    >
                      Approve
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
      <EmergencyModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </PageEnter>
  )
}

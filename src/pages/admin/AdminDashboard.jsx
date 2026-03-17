import { motion } from 'framer-motion'
import { Users, Activity, Shield, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import { PageEnter, StatCard, GlassCard, SectionTitle, BloodBadge } from '../../components/UI'

const activityLog = [
  { type: 'success', msg: 'O- request fulfilled — Apollo Mumbai', time: '2 min ago' },
  { type: 'info', msg: 'New donor registered: Rahul K. (B+) — Delhi', time: '5 min ago' },
  { type: 'alert', msg: 'Critical AB- request broadcast — 0 donors matched', time: '8 min ago' },
  { type: 'success', msg: 'City Hospital verified & onboarded', time: '14 min ago' },
  { type: 'info', msg: 'Priya M. earned "Hero Donor" badge', time: '22 min ago' },
  { type: 'success', msg: 'B+ request fulfilled — Fortis Delhi', time: '45 min ago' },
]

const recentUsers = [
  { name: 'Rahul Sharma', role: 'donor', blood: 'B+', city: 'Mumbai', status: 'active' },
  { name: 'Apollo Hospitals', role: 'hospital', blood: '-', city: 'Mumbai', status: 'verified' },
  { name: 'Priya Mehta', role: 'donor', blood: 'O-', city: 'Delhi', status: 'active' },
  { name: 'Fortis Healthcare', role: 'hospital', blood: '-', city: 'Delhi', status: 'verified' },
  { name: 'Ankit Kumar', role: 'donor', blood: 'A+', city: 'Bangalore', status: 'pending' },
]

export default function AdminDashboard() {
  return (
    <PageEnter>
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar role="admin" />
        <main className="flex-1 overflow-auto pt-14 md:pt-0">
          <div className="sticky top-0 z-30 glass border-b border-white/5 px-4 md:px-6 py-4">
            <h1 className="font-syne font-bold text-white text-xl">Admin Dashboard</h1>
            <p className="text-white/40 text-xs">Platform Overview · March 2025</p>
          </div>

          <div className="p-4 md:p-6 max-w-6xl">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={Users} label="Total Users" value="48,750" sub="+340 this week" color="blue" />
              <StatCard icon={Activity} label="Active Requests" value="127" sub="12 critical" color="red" />
              <StatCard icon={CheckCircle} label="Fulfilled (Month)" value="2,840" sub="+18% MoM" color="green" />
              <StatCard icon={TrendingUp} label="Response Rate" value="94%" sub="Platform average" color="purple" />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Activity Log */}
              <div className="lg:col-span-2">
                <SectionTitle sub="Live platform activity">Activity Log</SectionTitle>
                <GlassCard className="p-5">
                  {activityLog.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0"
                    >
                      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        log.type === 'success' ? 'bg-green-400' :
                        log.type === 'alert' ? 'bg-red-400 animate-pulse' : 'bg-blue-400'
                      }`} />
                      <p className="text-sm text-white/70 flex-1">{log.msg}</p>
                      <span className="text-white/30 text-xs whitespace-nowrap">{log.time}</span>
                    </motion.div>
                  ))}
                </GlassCard>
              </div>

              {/* Quick Stats Panel */}
              <div>
                <SectionTitle sub="At a glance">Platform Health</SectionTitle>
                <div className="flex flex-col gap-3">
                  {[
                    { label: 'Uptime', value: '99.98%', color: 'green' },
                    { label: 'Donors Online', value: '3,240', color: 'blue' },
                    { label: 'Avg Match Time', value: '4.2 min', color: 'purple' },
                    { label: 'Hospitals Active', value: '340', color: 'red' },
                  ].map(s => (
                    <GlassCard key={s.label} className="px-4 py-3 flex items-center justify-between">
                      <span className="text-white/50 text-sm">{s.label}</span>
                      <span className={`font-syne font-bold text-sm ${
                        s.color === 'green' ? 'text-green-400' :
                        s.color === 'blue' ? 'text-blue-400' :
                        s.color === 'purple' ? 'text-purple-400' : 'text-blood-400'
                      }`}>{s.value}</span>
                    </GlassCard>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Users table */}
            <div className="mt-8">
              <SectionTitle sub="Latest registrations">Recent Users</SectionTitle>
              <GlassCard className="overflow-hidden overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['Name', 'Role', 'Blood', 'City', 'Status'].map(h => (
                        <th key={h} className="text-left text-white/30 text-xs font-medium px-5 py-3 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((u, i) => (
                      <motion.tr
                        key={u.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.07 }}
                        className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors"
                      >
                        <td className="px-5 py-3 text-white text-sm font-medium">{u.name}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-md ${u.role === 'donor' ? 'bg-blood-500/20 text-blood-400' : 'bg-blue-500/20 text-blue-400'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-white/60 text-sm">{u.blood !== '-' ? <BloodBadge type={u.blood} size="sm" /> : '—'}</td>
                        <td className="px-5 py-3 text-white/50 text-sm">{u.city}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${
                            u.status === 'active' ? 'text-green-400 border-green-500/30 bg-green-500/10' :
                            u.status === 'verified' ? 'text-blue-400 border-blue-500/30 bg-blue-500/10' :
                            'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
                          }`}>{u.status}</span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </GlassCard>
            </div>
          </div>
        </main>
      </div>
    </PageEnter>
  )
}

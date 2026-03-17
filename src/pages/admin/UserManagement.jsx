import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, UserCheck, UserX, MoreHorizontal } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import { PageEnter, SectionTitle, GlassCard, BloodBadge } from '../../components/UI'

const users = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@gmail.com', role: 'donor', blood: 'B+', city: 'Mumbai', status: 'active', joined: 'Jan 2023', donations: 8 },
  { id: 2, name: 'Apollo Hospitals', email: 'admin@apollo.com', role: 'hospital', blood: '-', city: 'Mumbai', status: 'verified', joined: 'Mar 2023', donations: 0 },
  { id: 3, name: 'Priya Mehta', email: 'priya@gmail.com', role: 'donor', blood: 'O-', city: 'Delhi', status: 'active', joined: 'Feb 2024', donations: 5 },
  { id: 4, name: 'Fortis Healthcare', email: 'ops@fortis.com', role: 'hospital', blood: '-', city: 'Delhi', status: 'verified', joined: 'Jun 2023', donations: 0 },
  { id: 5, name: 'Ankit Kumar', email: 'ankit@yahoo.com', role: 'donor', blood: 'A+', city: 'Bangalore', status: 'pending', joined: 'Mar 2025', donations: 0 },
  { id: 6, name: 'Sneha Patel', email: 'sneha@gmail.com', role: 'donor', blood: 'AB+', city: 'Ahmedabad', status: 'suspended', joined: 'Nov 2023', donations: 2 },
]

export default function UserManagement() {
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('all')

  const filtered = users.filter(u =>
    (filterRole === 'all' || u.role === filterRole) &&
    (search === '' || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search))
  )

  return (
    <PageEnter>
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar role="admin" />
        <main className="flex-1 p-6">
          <SectionTitle sub={`${users.length} total registered users`}>User Management</SectionTitle>

          {/* Controls */}
          <div className="flex gap-3 mb-5 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search size={15} className="absolute left-3.5 top-3 text-white/30" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full glass border border-white/10 focus:border-blood-500/50 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm outline-none placeholder:text-white/20 transition-colors"
              />
            </div>
            {['all', 'donor', 'hospital'].map(r => (
              <motion.button
                key={r}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterRole(r)}
                className={`px-4 py-2.5 rounded-xl border text-sm capitalize transition-all ${
                  filterRole === r ? 'bg-blood-500/20 border-blood-500 text-blood-400' : 'glass border-white/10 text-white/50'
                }`}
              >
                {r === 'all' ? 'All Users' : r + 's'}
              </motion.button>
            ))}
          </div>

          {/* Table */}
          <GlassCard className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['User', 'Role', 'Blood', 'City', 'Donations', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-white/30 text-xs font-medium px-5 py-3.5 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blood-500/20 border border-blood-500/20 flex items-center justify-center text-xs font-bold text-blood-400 font-syne">
                          {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{u.name}</p>
                          <p className="text-white/30 text-xs">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-md ${u.role === 'donor' ? 'bg-blood-500/20 text-blood-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">{u.blood !== '-' ? <BloodBadge type={u.blood} size="sm" /> : <span className="text-white/20">—</span>}</td>
                    <td className="px-5 py-4 text-white/50 text-sm">{u.city}</td>
                    <td className="px-5 py-4 text-white/60 text-sm">{u.donations > 0 ? `${u.donations} ×` : '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${
                        u.status === 'active' ? 'text-green-400 border-green-500/30 bg-green-500/10' :
                        u.status === 'verified' ? 'text-blue-400 border-blue-500/30 bg-blue-500/10' :
                        u.status === 'pending' ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' :
                        'text-red-400 border-red-500/30 bg-red-500/10'
                      }`}>{u.status}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1">
                        <motion.button whileTap={{ scale: 0.9 }} className="p-1.5 rounded-lg hover:bg-green-500/10 text-white/30 hover:text-green-400 transition-colors">
                          <UserCheck size={14} />
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.9 }} className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors">
                          <UserX size={14} />
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.9 }} className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-colors">
                          <MoreHorizontal size={14} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </main>
      </div>
    </PageEnter>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Edit2, Save, MapPin, Phone, Calendar, Droplets } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import { PageEnter, BloodBadge, GlassCard, PrimaryBtn, SectionTitle } from '../../components/UI'

export default function DonorProfile() {
  const [editing, setEditing] = useState(false)
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

  return (
    <PageEnter>
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar role="donor" />
        <main className="flex-1 p-6">
          <div className="max-w-2xl">
            <SectionTitle sub="Manage your donor profile">My Profile</SectionTitle>

            <GlassCard className="p-8 mb-4">
              {/* Avatar */}
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blood-500 to-blood-700 flex items-center justify-center font-syne font-black text-3xl text-white">
                    RS
                  </div>
                  <motion.button whileTap={{ scale: 0.9 }} className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-blood-500 flex items-center justify-center">
                    <Camera size={14} className="text-white" />
                  </motion.button>
                </div>
                <div>
                  <h2 className="font-syne text-xl font-bold text-white">Rahul Sharma</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <BloodBadge type="B+" glow />
                    <span className="text-green-400 text-xs bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">✓ Verified</span>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditing(!editing)}
                  className="ml-auto glass text-white/60 hover:text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors"
                >
                  <Edit2 size={14} /> {editing ? 'Cancel' : 'Edit'}
                </motion.button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', value: 'Rahul Sharma', icon: null },
                  { label: 'Blood Group', value: 'B+', icon: null },
                  { label: 'Phone', value: '+91 98765 43210', icon: Phone },
                  { label: 'Location', value: 'Andheri West, Mumbai', icon: MapPin },
                  { label: 'Date of Birth', value: '14 Mar 1995', icon: Calendar },
                  { label: 'Weight', value: '72 kg', icon: null },
                ].map(field => (
                  <div key={field.label}>
                    <label className="text-white/40 text-xs mb-1.5 block">{field.label.toUpperCase()}</label>
                    {editing ? (
                      <input
                        defaultValue={field.value}
                        className="w-full bg-white/5 border border-white/10 focus:border-blood-500/50 rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-colors"
                      />
                    ) : (
                      <p className="text-white text-sm py-2.5">{field.value}</p>
                    )}
                  </div>
                ))}
              </div>

              {editing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex gap-3">
                  <PrimaryBtn className="flex-1">
                    <Save size={16} /> Save Changes
                  </PrimaryBtn>
                </motion.div>
              )}
            </GlassCard>
          </div>
        </main>
      </div>
    </PageEnter>
  )
}

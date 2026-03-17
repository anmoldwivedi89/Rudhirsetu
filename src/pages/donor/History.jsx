import { motion } from 'framer-motion'
import { CheckCircle, Droplets, MapPin, Calendar } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import { PageEnter, GlassCard, SectionTitle, BloodBadge } from '../../components/UI'

const history = [
  { id: 1, date: 'Feb 14, 2025', hospital: 'Apollo Mumbai', blood: 'B+', units: 1, status: 'completed', impact: 'Saved 1 life' },
  { id: 2, date: 'Nov 10, 2024', hospital: 'AIIMS Delhi', blood: 'B+', units: 1, status: 'completed', impact: 'Saved 1 life' },
  { id: 3, date: 'Aug 02, 2024', hospital: 'Fortis Hospital', blood: 'B+', units: 1, status: 'completed', impact: 'Saved 1 life' },
  { id: 4, date: 'Apr 18, 2024', hospital: 'City Hospital', blood: 'B+', units: 1, status: 'completed', impact: 'Saved 1 life' },
  { id: 5, date: 'Jan 05, 2024', hospital: 'Max Healthcare', blood: 'B+', units: 1, status: 'completed', impact: 'Saved 1 life' },
]

export default function DonorHistory() {
  return (
    <PageEnter>
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar role="donor" />
        <main className="flex-1 p-4 md:p-6 pt-18 md:pt-6">
          <div className="max-w-2xl">
            <SectionTitle sub={`${history.length} donations · ${history.length} lives saved`}>Donation History</SectionTitle>

            {/* Timeline */}
            <div className="relative">
              {/* vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-blood-500 to-transparent" />

              <div className="flex flex-col gap-4 pl-16">
                {history.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="relative"
                  >
                    {/* Dot */}
                    <div className="absolute -left-10 top-4 w-4 h-4 rounded-full bg-blood-500 border-2 border-black glow-red-sm" />

                    <GlassCard className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <BloodBadge type={item.blood} />
                          <div>
                            <p className="text-white font-medium text-sm">{item.hospital}</p>
                            <p className="text-white/30 text-xs flex items-center gap-1 mt-0.5">
                              <Calendar size={10} /> {item.date}
                            </p>
                          </div>
                        </div>
                        <span className="text-green-400 text-xs flex items-center gap-1">
                          <CheckCircle size={12} /> {item.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                        <span className="text-xs text-blood-400 bg-blood-500/10 border border-blood-500/20 px-2 py-0.5 rounded-md">
                          🩸 {item.units} unit
                        </span>
                        <span className="text-xs text-green-400">💚 {item.impact}</span>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageEnter>
  )
}

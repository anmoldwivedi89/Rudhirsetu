import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, Radio, Droplets } from 'lucide-react'
import { PageEnter, SectionTitle, GlassCard, BloodBadge, UrgencyTag } from '../../components/UI'

const requests = [
  { id: 1, blood: 'O-', patient: 'Emergency Surgery - Ward ICU', units: 3, urgency: 'critical', stage: 3, donors: ['Rahul S.', 'Priya M.'], created: '10:24 AM' },
  { id: 2, blood: 'B+', patient: 'Scheduled Transfusion - Ward 6', units: 1, urgency: 'medium', stage: 4, donors: ['Ankit K.'], created: 'Yesterday' },
  { id: 3, blood: 'AB+', patient: 'Post-Op Recovery - Ward 3', units: 2, urgency: 'high', stage: 2, donors: [], created: '9:05 AM' },
]

const stages = [
  { label: 'Created', icon: '📋' },
  { label: 'Broadcasted', icon: '📡' },
  { label: 'Accepted', icon: '👋' },
  { label: 'Fulfilled', icon: '✅' },
]

export default function RequestTracking() {
  return (
    <PageEnter>
      <div className="w-full">
        <div className="max-w-3xl">
          <SectionTitle sub="Live status of all blood requests">Request Tracker</SectionTitle>

          <div className="flex flex-col gap-5">
            {requests.map((req, i) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 border border-white/5"
              >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <BloodBadge type={req.blood} glow />
                      <div>
                        <p className="text-white font-medium">{req.patient}</p>
                        <p className="text-white/30 text-xs mt-0.5">
                          🩸 {req.units} unit{req.units > 1 ? 's' : ''} · Created: {req.created}
                        </p>
                      </div>
                    </div>
                    <UrgencyTag level={req.urgency} />
                  </div>

                  {/* Lifecycle Track */}
                  <div className="relative flex items-start justify-between mb-4">
                    {/* connector line */}
                    <div className="absolute top-4 left-4 right-4 h-px bg-white/10" />
                    <div
                      className="absolute top-4 left-4 h-px bg-blood-500 transition-all duration-500"
                      style={{ width: `${((req.stage - 1) / (stages.length - 1)) * (100 - 8)}%` }}
                    />

                    {stages.map((s, si) => (
                      <div key={s.label} className="relative flex flex-col items-center gap-1.5 z-10">
                        <motion.div
                          initial={false}
                          animate={si + 1 <= req.stage ? { scale: [1.2, 1] } : {}}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm transition-all ${
                            si + 1 < req.stage ? 'bg-blood-500 border-blood-500' :
                            si + 1 === req.stage ? 'bg-blood-500/20 border-blood-500 animate-pulse' :
                            'bg-transparent border-white/20'
                          }`}
                        >
                          {si + 1 <= req.stage ? (
                            si + 1 === req.stage ? <span className="text-xs">{s.icon}</span> : <CheckCircle size={14} className="text-white" />
                          ) : (
                            <span className="text-white/20 text-xs">{si + 1}</span>
                          )}
                        </motion.div>
                        <span className={`text-[10px] whitespace-nowrap font-medium ${si + 1 <= req.stage ? 'text-white/60' : 'text-white/20'}`}>
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Donors */}
                  {req.donors.length > 0 ? (
                    <div className="flex items-center gap-2 mt-2 pt-3 border-t border-white/5">
                      <span className="text-white/30 text-xs">Donors:</span>
                      {req.donors.map(d => (
                        <span key={d} className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                          👤 {d}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-2 pt-3 border-t border-white/5">
                      <Radio size={12} className="text-blood-400 animate-pulse" />
                      <span className="text-white/30 text-xs">Waiting for donors to respond...</span>
                    </div>
                  )}
                </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageEnter>
  )
}

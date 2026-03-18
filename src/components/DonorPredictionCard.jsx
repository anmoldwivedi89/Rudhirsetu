import { motion, AnimatePresence } from 'framer-motion'
import { Brain, ShieldCheck, ShieldX, CalendarClock, Activity, Zap } from 'lucide-react'

/* ─── Skeleton loader ─────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="glass rounded-3xl p-5 border border-white/10 animate-pulse">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-white/10" />
        <div className="h-4 w-32 rounded bg-white/10" />
      </div>
      <div className="flex items-center justify-center py-6">
        <div className="w-28 h-28 rounded-full bg-white/5" />
      </div>
      <div className="space-y-2 mt-4">
        <div className="h-3 w-3/4 rounded bg-white/5" />
        <div className="h-3 w-1/2 rounded bg-white/5" />
      </div>
    </div>
  )
}

/* ─── Score Ring (SVG) ────────────────────────────────────── */
function ScoreRing({ score = 0 }) {
  const r = 52
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - score / 100)
  // Colour ramp: red → amber → green
  const colour =
    score >= 70 ? '#22c55e' :
    score >= 40 ? '#f59e0b' :
    '#ef4444'

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
        {/* track */}
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        {/* progress */}
        <motion.circle
          cx="60" cy="60" r={r}
          fill="none"
          stroke={colour}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 8px ${colour}88)` }}
        />
      </svg>
      {/* centre text */}
      <div className="text-center z-10">
        <motion.p
          key={score}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-syne font-black text-3xl text-white"
        >
          {score}
        </motion.p>
        <p className="text-white/40 text-[10px] tracking-wider">READINESS</p>
      </div>
    </div>
  )
}

/* ─── Main Card ───────────────────────────────────────────── */
export default function DonorPredictionCard({ prediction, loading, error }) {
  if (loading) return <Skeleton />

  if (error) {
    return (
      <div className="glass rounded-3xl p-5 border border-red-500/20">
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <Activity size={16} />
          <span>AI engine unavailable</span>
        </div>
      </div>
    )
  }

  if (!prediction) return null

  const { eligible, score, nextEligibleDays } = prediction

  const nextDate = new Date()
  nextDate.setDate(nextDate.getDate() + nextEligibleDays)
  const nextDateStr = nextDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="ai-card glass rounded-3xl p-5 border border-white/10 relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div
        className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: eligible ? '#22c55e' : '#ef4444' }}
      />

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
          <Brain size={16} className="text-purple-400" />
        </div>
        <div>
          <h3 className="font-syne font-bold text-white text-sm">AI Prediction</h3>
          <p className="text-white/30 text-[10px]">TensorFlow · Real-time</p>
        </div>
        <div className="ml-auto">
          <Zap size={12} className="text-yellow-400 animate-pulse" />
        </div>
      </div>

      {/* Score ring */}
      <div className="flex justify-center mb-4">
        <ScoreRing score={score} />
      </div>

      {/* Eligibility badge */}
      <AnimatePresence mode="wait">
        <motion.div
          key={eligible ? 'yes' : 'no'}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={`flex items-center justify-center gap-2 mx-auto w-fit px-4 py-2 rounded-full text-sm font-semibold mb-4
            ${eligible
              ? 'bg-green-500/15 border border-green-500/30 text-green-400 ai-glow-green'
              : 'bg-red-500/15 border border-red-500/30 text-red-400 ai-glow-red'
            }`}
        >
          {eligible ? <ShieldCheck size={16} /> : <ShieldX size={16} />}
          {eligible ? 'Eligible to Donate' : 'Not Eligible'}
        </motion.div>
      </AnimatePresence>

      {/* Next donation */}
      <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
        <CalendarClock size={12} />
        {eligible ? (
          <span>Ready now — donate anytime!</span>
        ) : (
          <span>Next eligible: <span className="text-white/70 font-medium">{nextDateStr}</span> ({nextEligibleDays} days)</span>
        )}
      </div>

      {/* Factor tags */}
      <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
        {[
          { label: 'Weight', ok: true },
          { label: 'Age', ok: true },
          { label: 'Gap', ok: score > 30 },
          { label: 'Health', ok: score > 50 },
        ].map(f => (
          <span
            key={f.label}
            className={`text-[10px] px-2 py-0.5 rounded-full border ${
              f.ok
                ? 'border-green-500/20 text-green-400/70 bg-green-500/5'
                : 'border-red-500/20 text-red-400/70 bg-red-500/5'
            }`}
          >
            {f.ok ? '✓' : '✗'} {f.label}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

import { motion } from 'framer-motion'

// Blood Group Badge
export function BloodBadge({ type, size = 'md', glow = false }) {
  const sizes = { sm: 'text-xs px-2 py-0.5', md: 'text-sm px-3 py-1', lg: 'text-lg px-4 py-2 font-bold' }
  return (
    <span className={`inline-flex items-center rounded-lg font-syne font-bold bg-blood-500/20 text-blood-400 border border-blood-500/40 ${sizes[size]} ${glow ? 'glow-red-sm' : ''}`}>
      {type}
    </span>
  )
}

// Urgency Tag
export function UrgencyTag({ level }) {
  const styles = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
    low: 'bg-green-500/20 text-green-400 border-green-500/40',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-md border font-medium ${styles[level] || styles.medium}`}>
      {level?.toUpperCase()}
    </span>
  )
}

// Glass Card
export function GlassCard({ children, className = '', hover = true, onClick }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 20px 60px rgba(0,0,0,0.4)' } : {}}
      onClick={onClick}
      className={`glass rounded-2xl ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {children}
    </motion.div>
  )
}

// Stat Card
export function StatCard({ icon: Icon, label, value, sub, color = 'red' }) {
  const colors = {
    red: 'text-blood-400 bg-blood-500/10 border-blood-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    green: 'text-green-400 bg-green-500/10 border-green-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  }
  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/40 text-sm mb-1">{label}</p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-syne text-3xl font-bold text-white"
          >
            {value}
          </motion.p>
          {sub && <p className="text-white/30 text-xs mt-1">{sub}</p>}
        </div>
        <div className={`p-3 rounded-xl border ${colors[color]}`}>
          <Icon size={20} />
        </div>
      </div>
    </GlassCard>
  )
}

// Skeleton Loader
export function Skeleton({ className = '' }) {
  return (
    <div className={`shimmer-bg rounded-xl ${className}`} />
  )
}

// Primary Button
export function PrimaryBtn({ children, onClick, className = '', loading = false, type = 'button', disabled = false }) {
  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(239,68,68,0.5)' }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`bg-blood-500 hover:bg-blood-600 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 justify-center disabled:opacity-50 ${className}`}
    >
      {loading && (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
        />
      )}
      {children}
    </motion.button>
  )
}

// Ghost Button
export function GhostBtn({ children, onClick, className = '' }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`glass text-white/70 hover:text-white font-medium px-6 py-3 rounded-xl transition-all ${className}`}
    >
      {children}
    </motion.button>
  )
}

// Page wrapper with animation
export function PageEnter({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

// Section Title
export function SectionTitle({ children, sub }) {
  return (
    <div className="mb-6">
      <h2 className="font-syne text-2xl font-bold text-white">{children}</h2>
      {sub && <p className="text-white/40 text-sm mt-1">{sub}</p>}
    </div>
  )
}

// Toggle Switch
export function Toggle({ checked, onChange, label }) {
  return (
    <div className="flex items-center gap-3 cursor-pointer" onClick={() => onChange(!checked)}>
      <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${checked ? 'bg-blood-500' : 'bg-white/10'}`}>
        <motion.div
          animate={{ x: checked ? 24 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
        />
      </div>
      {label && <span className={`text-sm font-medium ${checked ? 'text-blood-400' : 'text-white/40'}`}>{label}</span>}
    </div>
  )
}

// Request Card
export function RequestCard({ bloodType, distance, urgency, hospital, time, onAccept, onIgnore }) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <BloodBadge type={bloodType} glow />
          <div>
            <p className="text-white font-medium text-sm">{hospital}</p>
            <p className="text-white/40 text-xs">{time}</p>
          </div>
        </div>
        <UrgencyTag level={urgency} />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-white/50 text-sm">📍 {distance} away</p>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onIgnore}
            className="text-xs px-3 py-1.5 rounded-lg glass text-white/40 hover:text-white transition-colors"
          >
            Ignore
          </motion.button>
          <motion.button
            whileHover={{ boxShadow: '0 0 15px rgba(239,68,68,0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onAccept}
            className="text-xs px-3 py-1.5 rounded-lg bg-blood-500 text-white font-medium hover:bg-blood-600 transition-colors"
          >
            Accept
          </motion.button>
        </div>
      </div>
    </GlassCard>
  )
}

// Notification Item
export function NotifItem({ type, message, time }) {
  const icons = { alert: '🚨', success: '✅', info: 'ℹ️', warning: '⚠️' }
  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0"
    >
      <span className="text-lg mt-0.5">{icons[type] || icons.info}</span>
      <div className="flex-1">
        <p className="text-sm text-white/80">{message}</p>
        <p className="text-xs text-white/30 mt-0.5">{time}</p>
      </div>
    </motion.div>
  )
}

// Badge/Achievement
export function AchievementBadge({ emoji, label, earned }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
        earned ? 'glass-red border-blood-500/30' : 'glass border-white/5 opacity-40'
      }`}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="text-xs text-white/60 text-center">{label}</span>
    </motion.div>
  )
}

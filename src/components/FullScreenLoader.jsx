export default function FullScreenLoader({ label = 'Loading…' }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="glass rounded-2xl border border-white/10 p-6 flex items-center gap-3">
        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="text-white/70 text-sm">{label}</p>
      </div>
    </div>
  )
}


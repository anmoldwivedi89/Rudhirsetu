export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center px-3 py-3">
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/70 backdrop-blur">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        <span className="text-sm">{label}</span>
      </div>
    </div>
  )
}


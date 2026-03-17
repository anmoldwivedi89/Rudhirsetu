import { History as HistoryIcon } from 'lucide-react'
import { GlassCard, SectionTitle } from '../../components/UI'

export default function HospitalHistory() {
  return (
    <div className="w-full">
      <SectionTitle sub="Completed & past activity">History</SectionTitle>

      <GlassCard className="p-5 border border-white/10">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            <HistoryIcon size={18} className="text-white/70" />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium text-sm">History page is now a distinct route.</p>
            <p className="text-white/45 text-xs mt-1">You can later plug real history data here without changing routing/layout.</p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}


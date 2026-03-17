import { User } from 'lucide-react'
import { GlassCard, SectionTitle } from '../../components/UI'
import { useAuth } from '../../contexts/AuthContext'

export default function HospitalProfile() {
  const { profile } = useAuth()

  return (
    <div className="w-full">
      <SectionTitle sub="Hospital account details">Profile</SectionTitle>

      <GlassCard className="p-5 border border-white/10">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            <User size={18} className="text-white/70" />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium text-sm">{profile?.name || 'Hospital'}</p>
            <p className="text-white/45 text-xs mt-1">{profile?.location || 'Add hospital location in your profile'}</p>
            <p className="text-white/35 text-xs mt-2">This is a separate route from Dashboard/Requests/History.</p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}


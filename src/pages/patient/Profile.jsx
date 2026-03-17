import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Edit2, Save, MapPin, Phone, Calendar, User, Droplets } from 'lucide-react'
import { Navigate, useLocation } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { PageEnter, BloodBadge, GlassCard, PrimaryBtn, SectionTitle } from '../../components/UI'
import { useAuth } from '../../contexts/AuthContext'
import { updateUserProfile } from '../../lib/firestoreUsers'
import FullScreenLoader from '../../components/FullScreenLoader'

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
      {Icon && (
        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
          <Icon size={16} className="text-white/50" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-white/40 text-xs mb-0.5">{label}</p>
        <p className="text-white text-sm font-medium truncate">{value || '—'}</p>
      </div>
    </div>
  )
}

export default function PatientProfile() {
  const [editing, setEditing] = useState(false)
  const { user, profile, loading: authLoading } = useAuth()
  const location = useLocation()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', bloodGroup: '', phone: '', location: '', dob: '' })

  useEffect(() => {
    if (!profile) return
    setForm({
      name: profile.name || '',
      bloodGroup: profile.bloodGroup || '',
      phone: profile.phone || '',
      location: profile.location || '',
      dob: profile.dob || '',
    })
  }, [profile])

  const initials = useMemo(() => {
    const name = (form.name || profile?.name || '').trim()
    if (!name) return 'RS'
    const parts = name.split(/\s+/).filter(Boolean)
    return parts.slice(0, 2).map(p => p[0].toUpperCase()).join('')
  }, [form.name, profile?.name])

  const age = useMemo(() => {
    const dob = form.dob || profile?.dob
    if (!dob) return null
    const birth = new Date(dob)
    if (isNaN(birth.getTime())) return null
    const today = new Date()
    let a = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--
    return a >= 0 ? a : null
  }, [form.dob, profile?.dob])

  if (authLoading) return <FullScreenLoader label="Loading your profile…" />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      await updateUserProfile(user.uid, {
        name: form.name || null,
        bloodGroup: form.bloodGroup || null,
        phone: form.phone || null,
        location: form.location || null,
        dob: form.dob || null,
      })
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageEnter>
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar role="patient" />
        <main className="flex-1 pt-14 md:pt-0">
          <div className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-4xl px-4 md:px-6 py-4 md:py-6">
            <SectionTitle sub="Manage your patient profile">My Profile</SectionTitle>

            <GlassCard className="p-5 sm:p-8 mb-4">
              {/* Avatar + Name Header */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blood-500 to-blood-700 flex items-center justify-center font-syne font-black text-3xl text-white">
                    {initials}
                  </div>
                  <motion.button whileTap={{ scale: 0.9 }} className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-blood-500 flex items-center justify-center">
                    <Camera size={14} className="text-white" />
                  </motion.button>
                </div>
                <div>
                  <h2 className="font-syne text-xl font-bold text-white">{profile?.name || 'Your Profile'}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <BloodBadge type={profile?.bloodGroup || '—'} glow />
                    {age !== null && (
                      <span className="text-white/40 text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                        {age} years
                      </span>
                    )}
                    <span className="text-green-400 text-xs bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">✓ Active</span>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditing(!editing)}
                  className="sm:ml-auto glass text-white/60 hover:text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors min-h-[44px]"
                >
                  <Edit2 size={14} /> {editing ? 'Cancel' : 'Edit'}
                </motion.button>
              </div>

              {/* Form / Display Fields */}
              {editing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'name', label: 'Full Name', placeholder: 'Your name' },
                    { key: 'bloodGroup', label: 'Blood Group', placeholder: 'e.g. B+' },
                    { key: 'phone', label: 'Phone', placeholder: '+91...' },
                    { key: 'location', label: 'City / Location', placeholder: 'City, State' },
                    { key: 'dob', label: 'Date of Birth', placeholder: 'YYYY-MM-DD' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="text-white/40 text-xs mb-1.5 block">{field.label.toUpperCase()}</label>
                      <input
                        value={form[field.key]}
                        onChange={(e) => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full min-h-[44px] bg-white/5 border border-white/10 focus:border-blood-500/50 rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-colors placeholder:text-white/20"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                  <InfoItem icon={User} label="Full Name" value={form.name} />
                  <InfoItem icon={Droplets} label="Blood Group" value={form.bloodGroup} />
                  <InfoItem icon={Phone} label="Phone" value={form.phone} />
                  <InfoItem icon={MapPin} label="Location" value={form.location} />
                  <InfoItem icon={Calendar} label="Date of Birth" value={form.dob} />
                  {age !== null && <InfoItem icon={null} label="Age" value={`${age} years`} />}
                </div>
              )}

              {/* Save Button */}
              {editing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex gap-3">
                  <PrimaryBtn className="flex-1" onClick={handleSave} loading={saving}>
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

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Edit2, Save, MapPin, Phone, Calendar, Droplets } from 'lucide-react'
import { Navigate, useLocation } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { PageEnter, BloodBadge, GlassCard, PrimaryBtn, SectionTitle } from '../../components/UI'
import { useAuth } from '../../contexts/AuthContext'
import { updateUserProfile } from '../../lib/firestoreUsers'
import FullScreenLoader from '../../components/FullScreenLoader'

export default function DonorProfile() {
  const [editing, setEditing] = useState(false)
  const { user, profile, loading: authLoading } = useAuth()
  const location = useLocation()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', bloodGroup: '', phone: '', location: '', dob: '', weight: '' })
  const [medical, setMedical] = useState({ diabetes: null, alcohol: null, smoking: null })

  useEffect(() => {
    if (!profile) return
    setForm({
      name: profile.name || '',
      bloodGroup: profile.bloodGroup || '',
      phone: profile.phone || '',
      location: profile.location || '',
      dob: profile.dob || '',
      weight: profile.weight || '',
    })
    setMedical({
      diabetes: typeof profile.medical?.diabetes === 'boolean' ? profile.medical.diabetes : null,
      alcohol: typeof profile.medical?.alcohol === 'boolean' ? profile.medical.alcohol : null,
      smoking: typeof profile.medical?.smoking === 'boolean' ? profile.medical.smoking : null,
    })
  }, [profile])

  const initials = useMemo(() => {
    const name = (form.name || profile?.name || '').trim()
    if (!name) return 'RS'
    const parts = name.split(/\s+/).filter(Boolean)
    return parts.slice(0, 2).map(p => p[0].toUpperCase()).join('')
  }, [form.name, profile?.name])

  // Never render a blank screen on auth transitions.
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
        weight: form.weight || null,
        medical: {
          diabetes: medical.diabetes,
          alcohol: medical.alcohol,
          smoking: medical.smoking,
        },
      })
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageEnter>
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar role="donor" />
        <main className="flex-1 pt-14 md:pt-0">
          <div className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-4xl px-4 md:px-6 py-4 md:py-6">
            <SectionTitle sub="Manage your donor profile">My Profile</SectionTitle>

            <GlassCard className="p-5 sm:p-8 mb-4">
              {/* Avatar */}
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
                    <span className="text-green-400 text-xs bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">✓ Verified</span>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Full Name', value: form.name, icon: null, placeholder: 'Your name' },
                  { key: 'bloodGroup', label: 'Blood Group', value: form.bloodGroup, icon: null, placeholder: 'e.g. B+' },
                  { key: 'phone', label: 'Phone', value: form.phone, icon: Phone, placeholder: '+91...' },
                  { key: 'location', label: 'Location', value: form.location, icon: MapPin, placeholder: 'City, State' },
                  { key: 'dob', label: 'Date of Birth', value: form.dob, icon: Calendar, placeholder: 'YYYY-MM-DD' },
                  { key: 'weight', label: 'Weight', value: form.weight, icon: null, placeholder: 'e.g. 72 kg' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-white/40 text-xs mb-1.5 block">{field.label.toUpperCase()}</label>
                    {editing ? (
                      <input
                        value={field.value}
                        onChange={(e) => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full min-h-[44px] bg-white/5 border border-white/10 focus:border-blood-500/50 rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-colors placeholder:text-white/20"
                      />
                    ) : (
                      <p className="text-white text-sm py-2.5">{field.value || '—'}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="font-syne font-bold text-white mb-3">Health & Safety</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { key: 'diabetes', label: 'Diabetes' },
                    { key: 'alcohol', label: 'Alcohol' },
                    { key: 'smoking', label: 'Smoking/Tobacco' },
                  ].map(q => (
                    <div key={q.key} className="glass rounded-2xl p-4 border border-white/10">
                      <p className="text-white/60 text-xs mb-2">{q.label}</p>
                      {editing ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setMedical(m => ({ ...m, [q.key]: false }))}
                            className={`flex-1 px-3 py-2 rounded-xl text-xs border transition-colors ${
                              medical[q.key] === false
                                ? 'bg-green-500/20 border-green-500/30 text-green-300'
                                : 'glass border-white/10 text-white/50 hover:text-white'
                            }`}
                          >
                            No
                          </button>
                          <button
                            type="button"
                            onClick={() => setMedical(m => ({ ...m, [q.key]: true }))}
                            className={`flex-1 px-3 py-2 rounded-xl text-xs border transition-colors ${
                              medical[q.key] === true
                                ? 'bg-blood-500/20 border-blood-500/30 text-blood-300'
                                : 'glass border-white/10 text-white/50 hover:text-white'
                            }`}
                          >
                            Yes
                          </button>
                        </div>
                      ) : (
                        <p className="text-white text-sm font-medium">
                          {medical[q.key] === null ? '—' : (medical[q.key] ? 'Yes' : 'No')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

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

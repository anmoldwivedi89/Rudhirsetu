import { useEffect, useMemo, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, Edit2, Save, MapPin, Phone, Building2, Mail, LogOut } from 'lucide-react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { PageEnter, GlassCard, PrimaryBtn, SectionTitle } from '../../components/UI'
import { useAuth } from '../../contexts/AuthContext'
import { updateUserProfile } from '../../lib/firestoreUsers'
import FullScreenLoader from '../../components/FullScreenLoader'
import BlockchainBadge from '../../components/BlockchainBadge'

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

export default function HospitalProfile() {
  const [editing, setEditing] = useState(false)
  const { user, profile, loading: authLoading, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [photoPreview, setPhotoPreview] = useState(null)
  const fileRef = useRef(null)
  const [form, setForm] = useState({ name: '', phone: '', location: '', email: '' })

  useEffect(() => {
    if (!profile) return
    setForm({
      name: profile.name || '',
      phone: profile.phone || '',
      location: profile.location || '',
      email: profile.email || user?.email || '',
    })
  }, [profile, user])

  const initials = useMemo(() => {
    const name = (form.name || profile?.name || '').trim()
    if (!name) return 'H'
    const parts = name.split(/\s+/).filter(Boolean)
    return parts.slice(0, 2).map(p => p[0].toUpperCase()).join('')
  }, [form.name, profile?.name])

  if (authLoading) return <FullScreenLoader label="Loading your profile…" />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (file) setPhotoPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      await updateUserProfile(user.uid, {
        name: form.name || null,
        phone: form.phone || null,
        location: form.location || null,
      })
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <PageEnter>
      <div className="w-full">
        <SectionTitle sub="Manage your hospital profile">Profile</SectionTitle>

        <GlassCard className="p-5 sm:p-8 mb-4">
          {/* Avatar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
            <div className="relative">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="w-24 h-24 rounded-2xl object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blood-500 to-blood-700 flex items-center justify-center font-syne font-black text-3xl text-white">
                  {initials}
                </div>
              )}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-blood-500 flex items-center justify-center"
              >
                <Camera size={14} className="text-white" />
              </motion.button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </div>
            <div>
              <h2 className="font-syne text-xl font-bold text-white">{profile?.name || 'Hospital Profile'}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-white/40 text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Building2 size={10} /> Hospital
                </span>
                <span className="text-green-400 text-xs bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                  ✓ Active
                </span>
                <BlockchainBadge hospitalAddress={profile?.ethAddress || null} />
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

          {/* Fields */}
          {editing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'name', label: 'Hospital Name', placeholder: 'Hospital name' },
                { key: 'phone', label: 'Phone', placeholder: '+91...' },
                { key: 'location', label: 'City / Location', placeholder: 'City, State' },
                { key: 'email', label: 'Email', placeholder: 'email@hospital.com', disabled: true },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-white/40 text-xs mb-1.5 block">{field.label.toUpperCase()}</label>
                  <input
                    value={form[field.key]}
                    onChange={(e) => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    disabled={field.disabled}
                    className="w-full min-h-[44px] bg-white/5 border border-white/10 focus:border-blood-500/50 rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-colors placeholder:text-white/20 disabled:opacity-40"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              <InfoItem icon={Building2} label="Hospital Name" value={form.name} />
              <InfoItem icon={Phone} label="Phone" value={form.phone} />
              <InfoItem icon={MapPin} label="Location" value={form.location} />
              <InfoItem icon={Mail} label="Email" value={form.email} />
            </div>
          )}

          {/* Save */}
          {editing && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex gap-3">
              <PrimaryBtn className="flex-1" onClick={handleSave} loading={saving}>
                <Save size={16} /> Save Changes
              </PrimaryBtn>
            </motion.div>
          )}
        </GlassCard>

        {/* Logout */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="w-full mt-2 flex items-center justify-center gap-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl py-3 text-sm font-semibold transition-colors"
        >
          <LogOut size={16} /> Logout
        </motion.button>
      </div>
    </PageEnter>
  )
}

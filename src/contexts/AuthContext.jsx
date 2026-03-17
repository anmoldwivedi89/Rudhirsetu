import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { getCachedUserRole } from '../lib/roles'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      console.log('[auth] state change:', u ? u.uid : null)
      setUser(u)
      setProfile(null)
      if (!u) {
        setLoading(false)
        return
      }

      try {
        const snap = await getDoc(doc(db, 'users', u.uid))
        if (snap.exists()) setProfile(snap.data())
        else {
          const cachedRole = getCachedUserRole(u.uid)
          setProfile(cachedRole ? { role: cachedRole } : null)
        }
      } catch {
        const cachedRole = getCachedUserRole(u.uid)
        setProfile(cachedRole ? { role: cachedRole } : null)
      } finally {
        setLoading(false)
      }
    })
    return () => unsub()
  }, [])

  const logout = async () => {
    console.log('[auth] logout: start')
    try {
      await signOut(auth)
      console.log('User logged out')
    } finally {
      // Ensure UI clears immediately even if signOut throws in edge cases.
      setUser(null)
      setProfile(null)
      setLoading(false)
    }
  }

  const value = useMemo(() => ({
    user,
    profile,
    role: profile?.role || null,
    loading,
    logout,
  }), [user, profile, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}


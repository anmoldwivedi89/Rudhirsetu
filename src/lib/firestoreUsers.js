import { collection, doc, getDocs, limit, query, updateDoc, where, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

export async function updateUserProfile(uid, patch) {
  if (!uid) throw new Error('Missing uid')
  await updateDoc(doc(db, 'users', uid), { ...patch, updatedAt: serverTimestamp() })
}

export async function listDonors({ bloodGroup } = {}) {
  const base = collection(db, 'users')
  const q = bloodGroup
    ? query(base, where('role', '==', 'donor'), where('bloodGroup', '==', bloodGroup), limit(25))
    : query(base, where('role', '==', 'donor'), limit(25))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function listHospitals({ bloodGroup } = {}) {
  const base = collection(db, 'users')
  // If you store `availableBloodGroups: string[]` on hospital profiles, this can be used.
  // Note: may require a Firestore index depending on your rules/indexes.
  let q = query(base, where('role', '==', 'hospital'), limit(50))
  if (bloodGroup) {
    try {
      q = query(base, where('role', '==', 'hospital'), where('availableBloodGroups', 'array-contains', bloodGroup), limit(50))
    } catch {
      // fallback to role-only query; caller can filter client-side
      q = query(base, where('role', '==', 'hospital'), limit(50))
    }
  }
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}


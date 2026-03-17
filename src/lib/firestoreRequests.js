import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../firebase'

/**
 * requests collection schema (minimal):
 * - createdBy: uid
 * - createdByRole: 'hospital' | 'patient'
 * - createdByName: string | null
 * - createdByLocation: string | null
 * - bloodGroup: string
 * - units: number
 * - urgency: 'critical' | 'high' | 'medium' | 'low'
 * - notes: string | null
 * - status: 'open' | 'accepted' | 'fulfilled' | 'cancelled'
 * - acceptedBy: uid | null
 * - createdAt/updatedAt: timestamps
 */

export async function createBloodRequest({
  createdBy,
  createdByRole,
  createdByName,
  createdByLocation,
  bloodGroup,
  units,
  urgency,
  notes,
}) {
  if (!createdBy) throw new Error('Missing createdBy uid')
  if (!bloodGroup) throw new Error('Missing bloodGroup')

  const payload = {
    createdBy,
    createdByRole,
    createdByName: createdByName || null,
    createdByLocation: createdByLocation || null,
    bloodGroup,
    units: Number(units || 1),
    urgency: urgency || 'critical',
    notes: notes || null,
    status: 'open',
    acceptedBy: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  const ref = await addDoc(collection(db, 'requests'), payload)
  return ref.id
}

export async function listOpenRequestsForDonor({ bloodGroup } = {}) {
  const base = collection(db, 'requests')
  const q = bloodGroup
    ? query(
      base,
      where('status', '==', 'open'),
      where('bloodGroup', '==', bloodGroup),
      orderBy('createdAt', 'desc'),
      limit(25),
    )
    : query(base, where('status', '==', 'open'), orderBy('createdAt', 'desc'), limit(25))

  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function listRequestsByCreator(uid) {
  if (!uid) return []
  const q = query(
    collection(db, 'requests'),
    where('createdBy', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(25),
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function acceptRequest({ requestId, donorUid }) {
  if (!requestId) throw new Error('Missing requestId')
  if (!donorUid) throw new Error('Missing donorUid')
  await updateDoc(doc(db, 'requests', requestId), {
    status: 'accepted',
    acceptedBy: donorUid,
    acceptedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}


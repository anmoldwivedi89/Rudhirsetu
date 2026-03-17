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
  createdByGeo,
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
    createdByGeo: createdByGeo || null, // {lat, lng}
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
    acceptedByRole: 'donor',
    acceptedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function acceptPatientRequestByHospital({
  requestId,
  hospitalUid,
  hospitalName,
  hospitalLocation,
  hospitalGeo,
  hospitalPhone,
  acceptedUnits,
}) {
  if (!requestId) throw new Error('Missing requestId')
  if (!hospitalUid) throw new Error('Missing hospitalUid')
  await updateDoc(doc(db, 'requests', requestId), {
    status: 'accepted',
    acceptedBy: hospitalUid,
    acceptedByRole: 'hospital',
    acceptedByName: hospitalName || null,
    acceptedByLocation: hospitalLocation || null,
    acceptedByGeo: hospitalGeo || null,
    acceptedByPhone: hospitalPhone || null,
    acceptedUnits: Number(acceptedUnits || 0) || null,
    acceptedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function listOpenPatientRequests() {
  const q = query(
    collection(db, 'requests'),
    where('status', '==', 'open'),
    where('createdByRole', '==', 'patient'),
    orderBy('createdAt', 'desc'),
    limit(25),
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}


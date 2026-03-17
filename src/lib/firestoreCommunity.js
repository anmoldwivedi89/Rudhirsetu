import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore'
import { db } from '../firebase'

// Collection: community_posts
// type: 'donor_offer' | 'patient_request'
export async function createCommunityPost(payload) {
  const {
    type,
    createdBy,
    role,
    name,
    phone,
    bloodGroup,
    units,
    urgency,
    locationText,
    geo,
    message,
    consent,
  } = payload || {}

  if (!createdBy) throw new Error('Missing uid')
  if (!type) throw new Error('Missing type')
  if (!bloodGroup) throw new Error('Missing blood group')
  if (type === 'donor_offer' && consent !== true) throw new Error('Consent required')

  const docData = {
    type,
    createdBy,
    role: role || null,
    name: name || null,
    phone: phone || null,
    bloodGroup,
    units: units != null ? Number(units) : null,
    urgency: urgency || null,
    locationText: locationText || null,
    geo: geo || null, // {lat,lng}
    message: message || null,
    consent: type === 'donor_offer' ? true : null,
    status: 'open',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  const ref = await addDoc(collection(db, 'community_posts'), docData)
  return ref.id
}

export async function listCommunityPosts({ type, bloodGroup } = {}) {
  const base = collection(db, 'community_posts')
  let q = query(base, where('status', '==', 'open'), orderBy('createdAt', 'desc'), limit(50))
  if (type) q = query(base, where('status', '==', 'open'), where('type', '==', type), orderBy('createdAt', 'desc'), limit(50))
  const snap = await getDocs(q)
  let rows = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  if (bloodGroup && bloodGroup !== 'All') rows = rows.filter(r => r.bloodGroup === bloodGroup)
  return rows
}


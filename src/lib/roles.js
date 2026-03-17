export const ROLES = /** @type {const} */ ({
  donor: 'donor',
  hospital: 'hospital',
  patient: 'patient',
  admin: 'admin',
})

const ROLE_CACHE_PREFIX = 'rudhirsetu.role.'

export function getDashboardPath(role) {
  switch (role) {
    case ROLES.donor: return '/donor/dashboard'
    case ROLES.hospital: return '/hospital/dashboard'
    case ROLES.patient: return '/patient/dashboard'
    case ROLES.admin: return '/admin/dashboard'
    default: return '/'
  }
}

export function cacheUserRole(uid, role) {
  if (!uid || !role) return
  try {
    localStorage.setItem(`${ROLE_CACHE_PREFIX}${uid}`, role)
  } catch {
    // ignore
  }
}

export function getCachedUserRole(uid) {
  if (!uid) return null
  try {
    return localStorage.getItem(`${ROLE_CACHE_PREFIX}${uid}`) || null
  } catch {
    return null
  }
}


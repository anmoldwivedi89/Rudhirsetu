export const ROLES = /** @type {const} */ ({
  donor: 'donor',
  hospital: 'hospital',
  patient: 'patient',
  admin: 'admin',
})

export function getDashboardPath(role) {
  switch (role) {
    case ROLES.donor: return '/donor/dashboard'
    case ROLES.hospital: return '/hospital/dashboard'
    case ROLES.patient: return '/patient/dashboard'
    case ROLES.admin: return '/admin/dashboard'
    default: return '/'
  }
}


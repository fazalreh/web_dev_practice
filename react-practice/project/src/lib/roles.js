export const USER_ROLES = Object.freeze({
  ADMIN: 'admin',
  CUSTOMER: 'customer',
})

export const DEFAULT_USER_ROLE = USER_ROLES.CUSTOMER
export const USER_ROLE_VALUES = Object.freeze(Object.values(USER_ROLES))

export const ROLE_LABELS = Object.freeze({
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.CUSTOMER]: 'Customer',
})

export function normalizeUserRole(role) {
  return USER_ROLE_VALUES.includes(role) ? role : DEFAULT_USER_ROLE
}

export function getUserRole(user) {
  return normalizeUserRole(user?.user_metadata?.role)
}

export function getRoleLabel(role) {
  return ROLE_LABELS[normalizeUserRole(role)]
}

export function hasAllowedRole(role, allowedRoles = []) {
  if (allowedRoles.length === 0) {
    return true
  }

  return allowedRoles.includes(normalizeUserRole(role))
}

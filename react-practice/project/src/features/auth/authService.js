import { getSupabaseClient } from '../../lib/supabaseClient'
import { normalizeUserRole, USER_ROLES } from '../../lib/roles'

function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

export async function signInWithEmail({ email, password }) {
  const client = getSupabaseClient()

  return client.auth.signInWithPassword({
    email: normalizeEmail(email),
    password,
  })
}

export async function signUpWithEmail({
  email,
  password,
  role = USER_ROLES.CUSTOMER,
}) {
  const client = getSupabaseClient()

  return client.auth.signUp({
    email: normalizeEmail(email),
    password,
    options: {
      data: {
        role: normalizeUserRole(role),
      },
    },
  })
}

export async function signOutCurrentUser() {
  const client = getSupabaseClient()

  return client.auth.signOut()
}

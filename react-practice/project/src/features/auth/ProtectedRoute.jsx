import { useSelector } from 'react-redux'
import { Link, Navigate, useLocation } from 'react-router-dom'

import { getRoleLabel, hasAllowedRole } from '../../lib/roles'
import { getSupabaseSetupMessage } from '../../lib/supabaseConfig'
import { isSupabaseConfigured } from '../../lib/supabaseClient'
import { selectAuth } from './authSlice'

function ProtectedRoute({ allowedRoles = [], children }) {
  const auth = useSelector(selectAuth)
  const location = useLocation()
  const isAllowed = hasAllowedRole(auth.role, allowedRoles)
  const allowedRoleLabels = allowedRoles.map((role) => getRoleLabel(role))

  if (auth.status === 'checking') {
    return (
      <section className="route-state">
        <div className="route-state-card">
          <p className="eyebrow">Authentication</p>
          <h1>Checking session</h1>
          <p className="page-copy">Keeping this workspace behind sign-in.</p>
        </div>
      </section>
    )
  }

  if (!isSupabaseConfigured) {
    return (
      <Navigate
        replace
        state={{
          from: location,
          reason: getSupabaseSetupMessage(),
        }}
        to="/login"
      />
    )
  }

  if (auth.status !== 'authenticated') {
    return (
      <Navigate
        replace
        state={{
          from: location,
          reason: 'Sign in to continue.',
        }}
        to="/login"
      />
    )
  }

  if (!isAllowed) {
    return (
      <section className="route-state">
        <div className="route-state-card">
          <p className="eyebrow">Access control</p>
          <h1>Access denied</h1>
          <p className="page-copy">
            This page is limited to {allowedRoleLabels.join(' or ')} users. Your
            current role is {getRoleLabel(auth.role)}.
          </p>
          <div className="route-actions">
            <Link className="primary-link" to="/">
              Back to overview
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return children
}

export default ProtectedRoute

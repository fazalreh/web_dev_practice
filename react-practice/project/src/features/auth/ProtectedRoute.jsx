import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

import { getSupabaseSetupMessage } from '../../lib/supabaseConfig'
import { isSupabaseConfigured } from '../../lib/supabaseClient'
import { selectAuth } from './authSlice'

function ProtectedRoute({ children }) {
  const auth = useSelector(selectAuth)
  const location = useLocation()

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

  return children
}

export default ProtectedRoute

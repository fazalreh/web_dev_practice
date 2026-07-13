import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

import { selectAuth } from './authSlice'

function getRedirectPath(location) {
  const from = location.state?.from

  if (!from) {
    return '/'
  }

  return `${from.pathname ?? '/'}${from.search ?? ''}${from.hash ?? ''}`
}

function PublicOnlyRoute({ children }) {
  const auth = useSelector(selectAuth)
  const location = useLocation()

  if (auth.status === 'checking') {
    return (
      <section className="route-state">
        <div className="route-state-card">
          <p className="eyebrow">Authentication</p>
          <h1>Checking session</h1>
          <p className="page-copy">Loading the current sign-in state.</p>
        </div>
      </section>
    )
  }

  if (auth.status === 'authenticated') {
    return <Navigate replace to={getRedirectPath(location)} />
  }

  return children
}

export default PublicOnlyRoute

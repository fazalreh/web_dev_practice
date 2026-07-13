import { LogIn, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { clearSession, selectAuth } from './authSlice'
import { signOutCurrentUser } from './authService'

function AuthControls() {
  const auth = useSelector(selectAuth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleSignOut() {
    setIsSigningOut(true)

    try {
      await signOutCurrentUser()
    } catch {
      dispatch(clearSession())
    } finally {
      setIsSigningOut(false)
      navigate('/login')
    }
  }

  if (auth.status === 'checking') {
    return <span className="auth-pill">Checking</span>
  }

  if (auth.status === 'authenticated') {
    return (
      <div className="auth-actions">
        <span className="auth-pill">{auth.user?.email ?? 'Signed in'}</span>
        <button
          aria-label="Sign out"
          className="icon-button"
          disabled={isSigningOut}
          onClick={handleSignOut}
          title="Sign out"
          type="button"
        >
          <LogOut aria-hidden="true" size={19} />
        </button>
      </div>
    )
  }

  return (
    <Link className="auth-link-button" to="/login">
      <LogIn aria-hidden="true" size={18} />
      <span>Sign in</span>
    </Link>
  )
}

export default AuthControls

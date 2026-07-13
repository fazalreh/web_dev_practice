import { LogIn } from 'lucide-react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { setSessionUser, selectAuth } from '../features/auth/authSlice'
import { signInWithEmail } from '../features/auth/authService'
import { getSupabaseSetupMessage } from '../lib/supabaseConfig'
import { isSupabaseConfigured } from '../lib/supabaseClient'

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useSelector(selectAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const redirectTo = location.state?.from?.pathname ?? '/'

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const { data, error: authError } = await signInWithEmail({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        return
      }

      dispatch(
        setSessionUser({
          user: data.session?.user ?? data.user,
          role: data.session?.user?.user_metadata?.role ?? null,
        }),
      )
      navigate(redirectTo, { replace: true })
    } catch (authError) {
      setError(authError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">
            <LogIn aria-hidden="true" size={22} />
          </span>
          <div>
            <p className="eyebrow">Authentication</p>
            <h1>Sign in</h1>
            <p className="page-copy">
              Use your Supabase account to enter the practice workspace.
            </p>
          </div>
        </div>

        {!isSupabaseConfigured && (
          <div className="form-alert warning">{getSupabaseSetupMessage()}</div>
        )}

        {auth.status === 'authenticated' && (
          <div className="form-alert success">You are already signed in.</div>
        )}

        {error && <div className="form-alert danger">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              autoComplete="email"
              disabled={!isSupabaseConfigured || isSubmitting}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="fazal@example.com"
              required
              type="email"
              value={email}
            />
          </label>

          <label>
            <span>Password</span>
            <input
              autoComplete="current-password"
              disabled={!isSupabaseConfigured || isSubmitting}
              minLength={6}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
              required
              type="password"
              value={password}
            />
          </label>

          <button
            className="primary-action"
            disabled={!isSupabaseConfigured || isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Signing in' : 'Sign in'}
          </button>
        </form>

        <p className="auth-switch">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </section>
  )
}

export default LoginPage

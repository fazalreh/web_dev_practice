import { UserRoundPlus } from 'lucide-react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { setSessionUser } from '../features/auth/authSlice'
import { signUpWithEmail } from '../features/auth/authService'
import { getSupabaseSetupMessage } from '../lib/supabaseConfig'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import { USER_ROLES } from '../lib/roles'

function SignupPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState(USER_ROLES.CUSTOMER)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error: authError } = await signUpWithEmail({
        email,
        password,
        role,
      })

      if (authError) {
        setError(authError.message)
        return
      }

      if (data.session) {
        dispatch(
          setSessionUser({
            user: data.session.user,
            role: data.session.user?.user_metadata?.role ?? role,
          }),
        )
        navigate('/', { replace: true })
        return
      }

      setSuccess('Account created. Check your email to confirm it.')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
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
            <UserRoundPlus aria-hidden="true" size={22} />
          </span>
          <div>
            <p className="eyebrow">Authentication</p>
            <h1>Create account</h1>
            <p className="page-copy">
              Register a Supabase user and save the selected role in metadata.
            </p>
          </div>
        </div>

        {!isSupabaseConfigured && (
          <div className="form-alert warning">{getSupabaseSetupMessage()}</div>
        )}

        {success && <div className="form-alert success">{success}</div>}
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
            <span>Role</span>
            <select
              disabled={!isSupabaseConfigured || isSubmitting}
              onChange={(event) => setRole(event.target.value)}
              value={role}
            >
              <option value={USER_ROLES.CUSTOMER}>Customer</option>
              <option value={USER_ROLES.ADMIN}>Admin</option>
            </select>
          </label>

          <label>
            <span>Password</span>
            <input
              autoComplete="new-password"
              disabled={!isSupabaseConfigured || isSubmitting}
              minLength={6}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 6 characters"
              required
              type="password"
              value={password}
            />
          </label>

          <label>
            <span>Confirm password</span>
            <input
              autoComplete="new-password"
              disabled={!isSupabaseConfigured || isSubmitting}
              minLength={6}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repeat password"
              required
              type="password"
              value={confirmPassword}
            />
          </label>

          <button
            className="primary-action"
            disabled={!isSupabaseConfigured || isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Creating account' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </section>
  )
}

export default SignupPage
